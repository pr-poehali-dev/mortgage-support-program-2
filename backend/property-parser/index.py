import json
import os
import re
import urllib.request
import xml.etree.ElementTree as ET
import html
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime

SCHEMA = 't_p26758318_mortgage_support_pro'

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
}

def handler(event: dict, context) -> dict:
    """Парсер объявлений по недвижимости из открытых RSS-источников (Avito, ЦИАН, Яндекс и др.)"""
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    params = event.get('queryStringParameters') or {}
    action = params.get('action', 'search')

    if method == 'GET' and action == 'search':
        city = params.get('city', 'Севастополь')
        prop_type = params.get('type', '')
        operation = params.get('operation', 'sale')
        min_price = params.get('min_price')
        max_price = params.get('max_price')
        rooms = params.get('rooms')

        results = []

        # 1. Ищем в кэше БД
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        conditions = ["is_active = true", "parsed_at > NOW() - INTERVAL '24 hours'"]
        values = []

        if city:
            conditions.append("LOWER(location) LIKE %s")
            values.append(f'%{city.lower()}%')
        if operation:
            conditions.append("operation = %s")
            values.append(operation)
        if prop_type:
            conditions.append("property_type = %s")
            values.append(prop_type)
        if min_price:
            conditions.append("price >= %s")
            values.append(int(min_price))
        if max_price:
            conditions.append("price <= %s")
            values.append(int(max_price))
        if rooms:
            conditions.append("rooms = %s")
            values.append(int(rooms))

        where = ' AND '.join(conditions)
        cursor.execute(f"SELECT * FROM {SCHEMA}.parsed_listings WHERE {where} ORDER BY parsed_at DESC LIMIT 50", values)
        cached = [dict(r) for r in cursor.fetchall()]

        if cached:
            conn.close()
            return _ok({'listings': cached, 'source': 'cache', 'count': len(cached)})

        # 2. Парсим свежие данные
        listings = []
        listings += parse_avito_rss(city, prop_type, operation)
        listings += parse_cian_rss(city, prop_type, operation)
        listings += parse_domofond_rss(city, prop_type, operation)

        # Фильтруем по цене и комнатам
        if min_price:
            listings = [l for l in listings if l.get('price') and l['price'] >= int(min_price)]
        if max_price:
            listings = [l for l in listings if l.get('price') and l['price'] <= int(max_price)]
        if rooms:
            listings = [l for l in listings if l.get('rooms') == int(rooms)]

        # Сохраняем в кэш
        for listing in listings:
            try:
                cursor.execute(f"""
                    INSERT INTO {SCHEMA}.parsed_listings
                        (external_id, source, title, price, location, area, rooms, floor, total_floors,
                         property_type, operation, photo_url, url, description, phone)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    ON CONFLICT (external_id, source) DO UPDATE SET
                        title=EXCLUDED.title, price=EXCLUDED.price,
                        parsed_at=CURRENT_TIMESTAMP, is_active=true
                """, (
                    listing.get('external_id', ''),
                    listing.get('source', ''),
                    listing.get('title', ''),
                    listing.get('price'),
                    listing.get('location', ''),
                    listing.get('area'),
                    listing.get('rooms'),
                    listing.get('floor'),
                    listing.get('total_floors'),
                    listing.get('property_type', ''),
                    listing.get('operation', 'sale'),
                    listing.get('photo_url', ''),
                    listing.get('url', ''),
                    listing.get('description', ''),
                    listing.get('phone', ''),
                ))
            except Exception as e:
                print(f'DB save error: {e}')
        conn.commit()
        conn.close()

        return _ok({'listings': listings[:50], 'source': 'live', 'count': len(listings)})

    if method == 'POST' and action == 'save_to_client':
        body = json.loads(event.get('body', '{}')) if event.get('body') else {}
        client_id = body.get('client_id')
        listing = body.get('listing', {})
        if not client_id or not listing:
            return _err(400, 'client_id and listing are required')

        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute(f"""
            INSERT INTO {SCHEMA}.client_properties
                (client_id, title, property_type, address, area, rooms, floor, total_floors, price, description, photo_url)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING *
        """, (
            client_id,
            listing.get('title', ''),
            listing.get('property_type', ''),
            listing.get('location', ''),
            listing.get('area'),
            listing.get('rooms'),
            listing.get('floor'),
            listing.get('total_floors'),
            listing.get('price'),
            (listing.get('description', '') or '') + ('\n\nИсточник: ' + listing.get('url', '') if listing.get('url') else ''),
            listing.get('photo_url', ''),
        ))
        prop = dict(cursor.fetchone())
        conn.commit()
        conn.close()
        return _ok({'success': True, 'property': prop})

    return _err(405, 'Method not allowed')


def parse_avito_rss(city: str, prop_type: str, operation: str) -> list:
    """Парсит RSS-ленту Авито по недвижимости"""
    results = []
    cat_map = {
        'apartment': 'kvartiry',
        'house': 'doma_dachi_kottedzhi',
        'land': 'zemelnye_uchastki',
        'commercial': 'kommercheskaya_nedvizhimost',
        '': 'nedvizhimost',
    }
    op_map = {'sale': 'prodam', 'rent': 'sdam'}
    cat = cat_map.get(prop_type, 'nedvizhimost')
    op = op_map.get(operation, 'prodam')

    city_slug = _transliterate(city)
    url = f'https://www.avito.ru/{city_slug}/{cat}?operation=1&s=104&output=rss'

    try:
        req = urllib.request.Request(url, headers={
            'User-Agent': 'Mozilla/5.0 (compatible; RSS reader)',
            'Accept': 'application/rss+xml, application/xml, text/xml'
        })
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = resp.read()
        root = ET.fromstring(data)
        items = root.findall('.//item')

        for i, item in enumerate(items[:30]):
            title = _text(item, 'title')
            link = _text(item, 'link')
            desc = _text(item, 'description')
            ext_id = f"avito_{i}_{hash(link) % 999999}"

            price = _extract_price(title + ' ' + desc)
            area = _extract_area(title + ' ' + desc)
            rooms = _extract_rooms(title)
            photo = _extract_img(desc)

            results.append({
                'external_id': ext_id,
                'source': 'Авито',
                'title': title[:200],
                'price': price,
                'location': city,
                'area': area,
                'rooms': rooms,
                'floor': None,
                'total_floors': None,
                'property_type': prop_type or 'apartment',
                'operation': operation,
                'photo_url': photo,
                'url': link,
                'description': _clean(desc)[:500],
                'phone': '',
            })
    except Exception as e:
        print(f'Avito RSS error: {e}')
    return results


def parse_cian_rss(city: str, prop_type: str, operation: str) -> list:
    """Парсит RSS-ленту ЦИАН"""
    results = []
    city_map = {
        'Москва': 'moscow', 'Санкт-Петербург': 'spb', 'Севастополь': 'sevastopol',
        'Симферополь': 'simferopol', 'Краснодар': 'krasnodar', 'Ростов': 'rostov-na-donu',
    }
    city_slug = city_map.get(city, city.lower().replace(' ', '-'))
    op_map = {'sale': 'sale', 'rent': 'rent'}
    op = op_map.get(operation, 'sale')
    type_map = {'apartment': 'flat', 'house': 'suburban', 'land': 'land', '': 'flat'}
    ptype = type_map.get(prop_type, 'flat')

    url = f'https://www.cian.ru/export/xml/{op}/{ptype}/?region=&locationId=&xml_version=2'
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = resp.read()
        root = ET.fromstring(data)
        offers = root.findall('.//offer') or root.findall('.//item')

        for i, offer in enumerate(offers[:20]):
            title = _text(offer, 'title') or _text(offer, 'name') or 'Объект недвижимости'
            link = _text(offer, 'url') or _text(offer, 'link')
            price_raw = _text(offer, 'bargainTerms/price') or _text(offer, 'price')
            price = int(price_raw) if price_raw and price_raw.isdigit() else _extract_price(title)
            area_raw = _text(offer, 'totalArea') or _text(offer, 'area')
            area = float(area_raw) if area_raw else None
            rooms_raw = _text(offer, 'roomsCount') or _text(offer, 'rooms')
            rooms = int(rooms_raw) if rooms_raw and rooms_raw.isdigit() else None
            floor_raw = _text(offer, 'floorNumber') or _text(offer, 'floor')
            floor = int(floor_raw) if floor_raw and floor_raw.isdigit() else None
            total_raw = _text(offer, 'building/floorsCount') or _text(offer, 'floorsCount')
            total = int(total_raw) if total_raw and total_raw.isdigit() else None
            location_raw = _text(offer, 'location/address') or _text(offer, 'address') or city
            photo = _text(offer, 'photos/photo/fullUrl') or _text(offer, 'photo')

            results.append({
                'external_id': f'cian_{i}_{hash(link or title) % 999999}',
                'source': 'ЦИАН',
                'title': title[:200],
                'price': price,
                'location': location_raw,
                'area': area,
                'rooms': rooms,
                'floor': floor,
                'total_floors': total,
                'property_type': prop_type or 'apartment',
                'operation': operation,
                'photo_url': photo or '',
                'url': link or '',
                'description': '',
                'phone': '',
            })
    except Exception as e:
        print(f'CIAN RSS error: {e}')
    return results


def parse_domofond_rss(city: str, prop_type: str, operation: str) -> list:
    """Парсит RSS Domofond/Яндекс.Недвижимость"""
    results = []
    type_map = {'apartment': 'APARTMENT', 'house': 'HOUSE', 'land': 'LOT', '': 'APARTMENT'}
    op_map = {'sale': 'SELL', 'rent': 'RENT'}
    ptype = type_map.get(prop_type, 'APARTMENT')
    op = op_map.get(operation, 'SELL')
    city_encoded = urllib.request.quote(city)
    url = f'https://realty.yandex.ru/moskva/kupit/kvartira/?output=rss'

    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = resp.read()
        root = ET.fromstring(data)
        items = root.findall('.//item')

        for i, item in enumerate(items[:20]):
            title = _text(item, 'title')
            link = _text(item, 'link')
            desc = _text(item, 'description')
            if city.lower() not in (title + desc).lower():
                continue

            price = _extract_price(title + ' ' + desc)
            area = _extract_area(title + ' ' + desc)
            rooms = _extract_rooms(title)
            photo = _extract_img(desc)

            results.append({
                'external_id': f'yandex_{i}_{hash(link or title) % 999999}',
                'source': 'Яндекс.Недвижимость',
                'title': title[:200],
                'price': price,
                'location': city,
                'area': area,
                'rooms': rooms,
                'floor': None,
                'total_floors': None,
                'property_type': prop_type or 'apartment',
                'operation': operation,
                'photo_url': photo or '',
                'url': link or '',
                'description': _clean(desc)[:500],
                'phone': '',
            })
    except Exception as e:
        print(f'Yandex Realty RSS error: {e}')
    return results


def _text(elem, path: str) -> str:
    found = elem.find(path)
    if found is not None and found.text:
        return found.text.strip()
    return ''


def _clean(text: str) -> str:
    if not text:
        return ''
    text = html.unescape(text)
    text = re.sub(r'<[^>]+>', '', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()


def _extract_price(text: str) -> int | None:
    text = _clean(text)
    match = re.search(r'(\d[\d\s]{2,})\s*(?:руб|₽|rub)', text, re.IGNORECASE)
    if match:
        return int(re.sub(r'\s', '', match.group(1)))
    match = re.search(r'(\d{4,})', text.replace(' ', ''))
    if match:
        return int(match.group(1))
    return None


def _extract_area(text: str) -> float | None:
    match = re.search(r'(\d+(?:[.,]\d+)?)\s*м²?', text, re.IGNORECASE)
    if match:
        return float(match.group(1).replace(',', '.'))
    return None


def _extract_rooms(text: str) -> int | None:
    text_l = text.lower()
    if 'студ' in text_l:
        return 0
    match = re.search(r'(\d)\s*[-]?\s*комн', text_l)
    if match:
        return int(match.group(1))
    return None


def _extract_img(desc: str) -> str:
    if not desc:
        return ''
    match = re.search(r'<img[^>]+src=["\']([^"\']+)["\']', desc, re.IGNORECASE)
    if match:
        return match.group(1)
    return ''


def _transliterate(text: str) -> str:
    table = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
        'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'j', 'к': 'k', 'л': 'l', 'м': 'm',
        'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
        'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
        'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
        ' ': '_',
    }
    return ''.join(table.get(c.lower(), c) for c in text).lower()


def _ok(data: dict) -> dict:
    return {
        'statusCode': 200,
        'headers': {**CORS, 'Content-Type': 'application/json'},
        'body': json.dumps(data, ensure_ascii=False, default=str),
    }


def _err(code: int, msg: str) -> dict:
    return {
        'statusCode': code,
        'headers': {**CORS, 'Content-Type': 'application/json'},
        'body': json.dumps({'error': msg}, ensure_ascii=False),
    }
