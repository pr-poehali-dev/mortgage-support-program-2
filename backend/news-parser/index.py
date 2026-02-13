import json
import os
import re
import html
import psycopg2
from psycopg2.extras import RealDictCursor
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime

SCHEMA = 't_p26758318_mortgage_support_pro'

STOP_WORDS = [
    'ruonia', 'miacr', 'ценных бумаг', 'облигаци', 'купон', 'дивиденд',
    'вербовк', 'террорист', 'задержан', 'убийств', 'пожар', 'дтп',
    'взорвал', 'граната', 'стрельб', 'расстрел', 'нападен', 'ограблен',
    'наркотик', 'мошенник', 'обстрел', 'бомб', 'дезертир', 'всу',
    'футбол', 'хоккей', 'матч', 'турнир', 'олимпи', 'чемпионат',
    'погод', 'прогноз погод', 'температур', 'биржев', 'акци',
    'нефт', 'газпром', 'курс доллар', 'курс евро', 'валют',
    'авари', 'катастроф', 'крушен', 'столкновен',
]

REALTY_WORDS = [
    'ипотек', 'недвижим', 'жиль', 'квартир', 'новостройк',
    'застройщик', 'аренд', 'вторичк', 'кадастр', 'многоквартирн',
    'жилищн', 'риелтор', 'риэлтор', 'девелопер', 'эскроу',
    'маткапитал', 'материнский капитал', 'субсид', 'льготн',
    'долев', 'стройк', 'жилой комплекс', 'жк ', 'дольщик',
]

RSS_FEEDS = [
    {
        'url': 'https://realty.rbc.ru/rss',
        'source': 'РБК Недвижимость',
        'category': 'market',
        'keywords': ['ипотек', 'недвижим', 'жиль', 'квартир', 'дом', 'застройщик', 'новостройк', 'вторичк', 'аренд', 'севастопол', 'крым'],
        'strict': False
    },
    {
        'url': 'https://www.interfax.ru/rss.asp',
        'source': 'Интерфакс',
        'category': 'general',
        'keywords': ['ипотек', 'недвижим', 'квартир', 'застройщик', 'новостройк'],
        'strict': True
    },
    {
        'url': 'https://ria.ru/export/rss2/archive/index.xml',
        'source': 'РИА Новости',
        'category': 'general',
        'keywords': ['ипотек', 'недвижим', 'квартир', 'застройщик', 'новостройк'],
        'strict': True
    },
    {
        'url': 'https://www.rbc.ru/v10/rss/news/30/full.rss',
        'source': 'РБК',
        'category': 'market',
        'keywords': ['ипотек', 'недвижим', 'квартир', 'застройщик', 'новостройк'],
        'strict': True
    },
    {
        'url': 'https://www.banki.ru/xml/news.rss',
        'source': 'Banki.ru',
        'category': 'mortgage',
        'keywords': ['ипотек', 'жиль', 'недвижим', 'квартир'],
        'strict': True
    },
    {
        'url': 'https://tass.ru/rss/v2.xml',
        'source': 'ТАСС',
        'category': 'general',
        'keywords': ['ипотек', 'недвижим', 'квартир', 'застройщик'],
        'strict': True
    },
    {
        'url': 'https://lenta.ru/rss/news',
        'source': 'Lenta.ru',
        'category': 'general',
        'keywords': ['ипотек', 'недвижим', 'квартир', 'застройщик'],
        'strict': True
    },
    {
        'url': 'https://cbr.ru/rss/RssNews',
        'source': 'ЦБ РФ',
        'category': 'law',
        'keywords': ['ипотек', 'жилищн', 'долев', 'эскроу', 'застройщик'],
        'strict': True
    },
    {
        'url': 'https://www.kommersant.ru/RSS/main.xml',
        'source': 'Коммерсантъ',
        'category': 'market',
        'keywords': ['ипотек', 'недвижим', 'квартир', 'застройщик', 'новостройк'],
        'strict': True
    }
]


def slugify(text):
    cyrillic_to_latin = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e',
        'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
        'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
        'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
        'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
    }
    result = text.lower().strip()
    result = ''.join(cyrillic_to_latin.get(c, c) for c in result)
    result = ''.join(c if c.isalnum() else '-' for c in result)
    result = '-'.join(filter(None, result.split('-')))
    return result[:200]


def clean_text(text):
    if not text:
        return ''
    text = html.unescape(text)
    text = re.sub(r'<[^>]+>', '', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()


def normalize_date(date_str):
    if not date_str:
        return datetime.now()
    formats = [
        '%a, %d %b %Y %H:%M:%S %z',
        '%a, %d %b %Y %H:%M:%S GMT',
        '%Y-%m-%dT%H:%M:%S%z',
        '%Y-%m-%dT%H:%M:%S',
        '%Y-%m-%d %H:%M:%S',
    ]
    for fmt in formats:
        try:
            return datetime.strptime(date_str.strip(), fmt).replace(tzinfo=None)
        except ValueError:
            continue
    return datetime.now()


def extract_image(item, desc_elem):
    ns = {
        'media': 'http://search.yahoo.com/mrss/',
    }
    for tag in ['media:thumbnail', 'media:content']:
        parts = tag.split(':')
        found = item.find(f'{{{ns.get(parts[0], "")}}}{parts[1]}') if parts[0] in ns else None
        if found is not None:
            url = found.get('url', '')
            if url:
                return url

    enclosure = item.find('enclosure')
    if enclosure is not None:
        etype = enclosure.get('type', '')
        if 'image' in etype:
            return enclosure.get('url', '')

    if desc_elem is not None and desc_elem.text:
        m = re.search(r'<img[^>]+src=["\']([^"\']+)["\']', desc_elem.text)
        if m:
            return m.group(1)

    return ''


def is_relevant(title, description, feed_config):
    text = (title + ' ' + description).lower()

    if any(sw in text for sw in STOP_WORDS):
        return False

    keywords = feed_config['keywords']
    has_keyword = any(kw.lower() in text for kw in keywords)

    if feed_config.get('strict'):
        has_realty = any(rw in text for rw in REALTY_WORDS)
        return has_keyword and has_realty

    return has_keyword


def parse_feed(feed_config):
    articles = []
    url = feed_config['url']
    source = feed_config['source']
    category = feed_config['category']

    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (compatible; NewsBot/1.0)'})
        with urllib.request.urlopen(req, timeout=10) as response:
            xml_data = response.read()

        root = ET.fromstring(xml_data)
        items = root.findall('.//item') or root.findall('.//{http://www.w3.org/2005/Atom}entry')

        for item in items[:30]:
            try:
                title_elem = item.find('title')
                link_elem = item.find('link')
                desc_elem = item.find('description') or item.find('{http://purl.org/rss/1.0/modules/content/}encoded')
                date_elem = item.find('pubDate') or item.find('{http://www.w3.org/2005/Atom}published')

                if title_elem is None or not title_elem.text:
                    continue

                title = clean_text(title_elem.text)
                link = clean_text(link_elem.text or '') if link_elem is not None else ''
                description = clean_text(desc_elem.text or '') if desc_elem is not None else ''
                pub_date = normalize_date(date_elem.text if date_elem is not None else '')
                image_url = extract_image(item, desc_elem)

                if not is_relevant(title, description, feed_config):
                    continue

                if len(description) > 500:
                    description = description[:500] + '...'

                articles.append({
                    'title': title[:300],
                    'summary': description[:300],
                    'content': description,
                    'source': source,
                    'source_url': link,
                    'photo_url': image_url,
                    'category': category,
                    'pub_date': pub_date,
                })
            except Exception as e:
                print(f'Item parse error ({source}): {e}')
                continue
    except Exception as e:
        print(f'Feed error ({source}): {e}')

    return articles


def respond(status, body):
    return {
        'statusCode': status,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps(body, ensure_ascii=False, default=str),
        'isBase64Encoded': False
    }


def handler(event, context):
    '''Парсер новостей недвижимости из RSS-лент ведущих площадок. Сохраняет в БД автоматически.'''
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }

    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cur = conn.cursor(cursor_factory=RealDictCursor)

    try:
        if method == 'GET':
            cur.execute(f"SELECT source, COUNT(*) as cnt FROM {SCHEMA}.news WHERE source != '' AND is_published = true GROUP BY source ORDER BY cnt DESC")
            stats = [dict(r) for r in cur.fetchall()]
            cur.execute(f"SELECT COUNT(*) as total FROM {SCHEMA}.news WHERE is_published = true")
            total = cur.fetchone()['total']
            return respond(200, {'success': True, 'total_news': total, 'sources': stats})

        if method == 'POST':
            all_articles = []
            feed_errors = []

            for feed in RSS_FEEDS:
                try:
                    articles = parse_feed(feed)
                    all_articles.extend(articles)
                except Exception as e:
                    feed_errors.append(f'{feed["source"]}: {str(e)}')

            inserted = 0
            skipped = 0
            errors = []

            for article in all_articles:
                try:
                    slug = slugify(article['title'])
                    cur.execute(f'SELECT id FROM {SCHEMA}.news WHERE slug = %s', (slug,))
                    if cur.fetchone():
                        cur.execute(f"SELECT id FROM {SCHEMA}.news WHERE title = %s", (article['title'],))
                        if cur.fetchone():
                            skipped += 1
                            continue
                        slug = slug + '-' + datetime.now().strftime('%H%M%S')

                    photos = [article['photo_url']] if article['photo_url'] else []

                    cur.execute(f'''
                        INSERT INTO {SCHEMA}.news (title, slug, summary, content, photo_url, photos, source, source_url, category, is_published, is_pinned, created_at)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, true, false, %s)
                    ''', (
                        article['title'],
                        slug,
                        article['summary'],
                        article['content'],
                        article['photo_url'] or None,
                        photos,
                        article['source'],
                        article['source_url'],
                        article['category'],
                        article['pub_date']
                    ))
                    inserted += 1
                except Exception as e:
                    errors.append(str(e)[:100])

            conn.commit()

            return respond(200, {
                'success': True,
                'parsed': len(all_articles),
                'inserted': inserted,
                'skipped': skipped,
                'errors': errors[:5],
                'feed_errors': feed_errors
            })

        return respond(405, {'success': False, 'error': 'Method not allowed'})
    finally:
        cur.close()
        conn.close()