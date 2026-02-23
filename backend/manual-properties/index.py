import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime
from decimal import Decimal

def convert_to_serializable(obj):
    """Convert non-serializable objects to JSON-serializable format (v2 debug)"""
    if isinstance(obj, Decimal):
        return float(obj)
    elif isinstance(obj, datetime):
        return obj.isoformat()
    elif isinstance(obj, dict):
        return {k: convert_to_serializable(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [convert_to_serializable(i) for i in obj]
    return obj

def generate_seo_tags(data: dict) -> str:
    '''Генерирует строку SEO-тегов на основе полей объекта'''
    tags = []

    TYPE_MAP = {
        'apartment': 'квартира', 'house': 'дом', 'land': 'земельный участок',
        'commercial': 'коммерческая недвижимость', 'room': 'комната', 'newbuild': 'новостройка',
    }
    OP_MAP = {'sale': 'купить продажа', 'rent': 'аренда снять'}
    RENOV_MAP = {
        'euro': 'евроремонт', 'cosmetic': 'косметический ремонт', 'designer': 'дизайнерский ремонт',
        'none': 'без ремонта', 'rough': 'черновая отделка',
    }
    BUILD_MAP = {
        'new': 'новостройка новый дом', 'secondary': 'вторичка вторичное жильё',
        'panel': 'панельный дом', 'brick': 'кирпичный дом', 'monolith': 'монолитный дом',
    }

    prop_type = data.get('type') or data.get('property_category', '')
    if prop_type in TYPE_MAP:
        tags.append(TYPE_MAP[prop_type])

    operation = data.get('operation', '')
    if operation in OP_MAP:
        tags.append(OP_MAP[operation])

    location = data.get('location', '')
    if location:
        parts = [p.strip() for p in location.replace(',', ' ').split() if len(p) > 3]
        tags += parts[:4]

    rooms = data.get('rooms')
    if rooms is not None:
        try:
            r = int(rooms)
            if r == 0:
                tags.append('студия')
            elif r == 1:
                tags.append('однокомнатная 1-комнатная')
            elif r == 2:
                tags.append('двухкомнатная 2-комнатная')
            elif r == 3:
                tags.append('трёхкомнатная 3-комнатная')
            elif r >= 4:
                tags.append(f'{r}-комнатная многокомнатная')
        except:
            pass

    area = data.get('area')
    if area:
        try:
            tags.append(f'{float(area):.0f} кв м площадь')
        except:
            pass

    floor = data.get('floor')
    total_floors = data.get('total_floors')
    if floor:
        tags.append(f'{floor} этаж')
    if total_floors:
        tags.append(f'{total_floors} этажей этажность')

    renovation = data.get('renovation', '')
    if renovation and renovation in RENOV_MAP:
        tags.append(RENOV_MAP[renovation])

    building_type = data.get('building_type', '')
    if building_type and building_type in BUILD_MAP:
        tags.append(BUILD_MAP[building_type])

    if data.get('furniture'):
        tags.append('с мебелью')
    if data.get('balcony') in ('balcony', 'loggia', 'both'):
        tags.append('балкон лоджия')
    if data.get('gas'):
        tags.append('газ')
    if data.get('water'):
        tags.append('вода')
    if data.get('electricity'):
        tags.append('электричество')

    price = data.get('price')
    if price:
        try:
            p = int(price)
            if p < 2_000_000:
                tags.append('недорого дёшево')
            if p > 10_000_000:
                tags.append('элитная')
        except:
            pass

    price_type = data.get('price_type', 'total')
    if price_type == 'per_meter':
        tags.append('цена за метр')

    if not tags:
        return ''
    return '\n\n#' + ' #'.join(t.replace(' ', '_') for t in tags if t)


def slugify(text: str) -> str:
    '''Преобразует текст в SEO-friendly URL slug'''
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
    return result[:100]

def handler(event: dict, context) -> dict:
    '''API для управления собственными объектами недвижимости и массового импорта с Avito'''
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': ''
        }

    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cur = conn.cursor(cursor_factory=RealDictCursor)

    try:
        if method == 'GET':
            property_id = event.get('queryStringParameters', {}).get('id')
            slug = event.get('queryStringParameters', {}).get('slug')
            show_all = event.get('queryStringParameters', {}).get('show_all')
            
            if property_id or slug:
                if slug:
                    cur.execute('''
                        SELECT * FROM t_p26758318_mortgage_support_pro.manual_properties 
                        WHERE slug = %s
                    ''', (slug,))
                else:
                    cur.execute('''
                        SELECT * FROM t_p26758318_mortgage_support_pro.manual_properties 
                        WHERE id = %s
                    ''', (property_id,))
                prop = cur.fetchone()
                
                if not prop:
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'success': False, 'error': 'Объект не найден'}, ensure_ascii=False),
                        'isBase64Encoded': False
                    }
                
                prop_dict = convert_to_serializable(dict(prop))
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True, 'property': prop_dict}, ensure_ascii=False),
                    'isBase64Encoded': False
                }
            else:
                if show_all == 'true':
                    cur.execute('''
                        SELECT * FROM t_p26758318_mortgage_support_pro.manual_properties 
                        ORDER BY created_at DESC
                    ''')
                else:
                    cur.execute('''
                        SELECT * FROM t_p26758318_mortgage_support_pro.manual_properties 
                        WHERE is_active = true 
                        ORDER BY created_at DESC
                    ''')
                properties = [convert_to_serializable(dict(row)) for row in cur.fetchall()]
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True, 'properties': properties}, ensure_ascii=False),
                    'isBase64Encoded': False
                }

        elif method == 'POST':
            data = json.loads(event.get('body', '{}'))
            
            # Генерация slug для всех объектов
            if data.get('regenerate_slugs'):
                cur.execute('''
                    SELECT id, title FROM t_p26758318_mortgage_support_pro.manual_properties 
                    WHERE slug IS NULL OR slug = ''
                ''')
                properties = cur.fetchall()
                updated = 0
                
                for prop in properties:
                    new_slug = f"{slugify(prop['title'])}-{prop['id']}"
                    cur.execute('''
                        UPDATE t_p26758318_mortgage_support_pro.manual_properties 
                        SET slug = %s WHERE id = %s
                    ''', (new_slug, prop['id']))
                    updated += 1
                
                conn.commit()
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True, 'updated': updated}, ensure_ascii=False),
                    'isBase64Encoded': False
                }
            
            # Массовое обновление SEO-тегов для всех объектов
            if data.get('rebuild_seo_tags'):
                import re as _re
                cur.execute('SELECT * FROM t_p26758318_mortgage_support_pro.manual_properties')
                all_props = cur.fetchall()
                updated = 0
                for prop in all_props:
                    row = dict(prop)
                    seo = generate_seo_tags(row)
                    old_desc = row.get('description') or ''
                    clean = _re.sub(r'\n\n#[\s\S]*$', '', old_desc).rstrip()
                    new_desc = (clean + seo) if seo else clean or None
                    if new_desc != old_desc:
                        cur.execute(
                            'UPDATE t_p26758318_mortgage_support_pro.manual_properties SET description = %s, updated_at = NOW() WHERE id = %s',
                            (new_desc, row['id'])
                        )
                        updated += 1
                conn.commit()
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True, 'updated': updated}, ensure_ascii=False),
                    'isBase64Encoded': False
                }

            # Массовый импорт
            if 'items' in data:
                imported = 0
                errors = []
                
                for item in data['items']:
                    try:
                        photos = item.get('photos', [])
                        if not photos and item.get('photo_url'):
                            photos = [item.get('photo_url')]
                        
                        # Проверяем, есть ли уже объект с такой ссылкой
                        cur.execute('''
                            SELECT id FROM t_p26758318_mortgage_support_pro.manual_properties 
                            WHERE property_link = %s AND is_active = true
                        ''', (item.get('property_link'),))
                        
                        if cur.fetchone():
                            continue  # Пропускаем дубликаты
                        
                        cur.execute('''
                            INSERT INTO t_p26758318_mortgage_support_pro.manual_properties 
                            (title, type, price, location, area, rooms, floor, total_floors, land_area, 
                             photo_url, photos, description, features, property_link, price_type, phone, is_active, created_at, updated_at)
                            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, true, NOW(), NOW())
                        ''', (
                            item.get('title'),
                            item.get('type'),
                            item.get('price'),
                            item.get('location'),
                            item.get('area'),
                            item.get('rooms'),
                            item.get('floor'),
                            item.get('total_floors'),
                            item.get('land_area'),
                            photos[0] if photos else None,
                            photos,
                            item.get('description'),
                            item.get('features', []),
                            item.get('property_link'),
                            item.get('price_type', 'total'),
                            item.get('phone')
                        ))
                        imported += 1
                    except Exception as e:
                        errors.append(str(e))
                
                conn.commit()
                
                return {
                    'statusCode': 201,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True, 'imported': imported, 'errors': errors}, ensure_ascii=False),
                    'isBase64Encoded': False
                }
            
            # Один объект
            photos = data.get('photos', [])
            if not photos and data.get('photo_url'):
                photos = [data.get('photo_url')]
            
            # Конвертируем пустые строки в None для числовых полей
            def to_number(value):
                if value == '' or value is None:
                    return None
                try:
                    return float(value) if '.' in str(value) else int(value)
                except:
                    return None

            # Автоматически добавляем SEO-теги в описание
            base_desc = data.get('description') or ''
            seo_tags = generate_seo_tags(data)
            if seo_tags and seo_tags not in base_desc:
                full_desc = base_desc.rstrip() + seo_tags
            else:
                full_desc = base_desc or None
            
            cur.execute('''
                INSERT INTO t_p26758318_mortgage_support_pro.manual_properties 
                (title, type, property_category, operation, price, location, area, rooms, floor, total_floors, land_area, 
                 photo_url, photos, description, features, property_link, price_type, phone, contact_name,
                 building_type, renovation, bathroom, balcony, furniture, pets_allowed, children_allowed, 
                 utilities_included, wall_material, contact_method, rutube_link, is_active, created_at, updated_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, true, NOW(), NOW())
                RETURNING id
            ''', (
                data.get('title'),
                data.get('type'),
                data.get('property_category', data.get('type')),
                data.get('operation', 'sale'),
                to_number(data.get('price')),
                data.get('location'),
                to_number(data.get('area')),
                to_number(data.get('rooms')),
                to_number(data.get('floor')),
                to_number(data.get('total_floors')),
                to_number(data.get('land_area')),
                photos[0] if photos else None,
                photos,
                full_desc or None,
                data.get('features', []),
                data.get('property_link') or None,
                data.get('price_type', 'total'),
                data.get('phone') or None,
                data.get('contact_name') or None,
                data.get('building_type') or None,
                data.get('renovation') or None,
                data.get('bathroom') or None,
                data.get('balcony') or None,
                data.get('furniture', False),
                data.get('pets_allowed', False),
                data.get('children_allowed', True),
                data.get('utilities_included', False),
                data.get('wall_material') or None,
                data.get('contact_method', 'phone'),
                data.get('rutube_link') or None
            ))
            
            property_id = cur.fetchone()['id']
            
            # Генерируем slug для нового объекта
            title = data.get('title', '')
            generated_slug = f"{slugify(title)}-{property_id}"
            cur.execute('''
                UPDATE t_p26758318_mortgage_support_pro.manual_properties 
                SET slug = %s WHERE id = %s
            ''', (generated_slug, property_id))
            
            conn.commit()
            
            # Если объявление неактивно (с сайта), отправляем уведомление админу
            if not data.get('is_active', True):
                try:
                    import requests
                    
                    bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
                    chat_id = os.environ.get('TELEGRAM_CHAT_ID')
                    
                    if bot_token and chat_id:
                        message = f"📢 *Новое объявление с сайта*\n\n"
                        message += f"📋 *{data.get('title', 'Без названия')}*\n"
                        message += f"💰 {to_number(data.get('price')) or 0:,.0f} ₽\n"
                        message += f"📍 {data.get('location', 'Не указано')}\n"
                        if data.get('area'):
                            message += f"📐 {data.get('area')} м²\n"
                        if data.get('phone'):
                            message += f"📱 {data.get('phone')}\n"
                        if data.get('contact_name'):
                            message += f"👤 {data.get('contact_name')}\n"
                        message += f"\n✅ Требуется модерация в админ-панели"
                        
                        requests.post(
                            f'https://api.telegram.org/bot{bot_token}/sendMessage',
                            json={'chat_id': chat_id, 'text': message, 'parse_mode': 'Markdown'},
                            timeout=5
                        )
                except Exception as e:
                    print(f'Telegram notification error: {e}')
            
            # Автопостинг в Telegram и VK (только для активных объявлений)
            if data.get('is_active', True):
                try:
                    import requests
                    
                    # Формируем URL для просмотра объекта (используем slug)
                    cur.execute('SELECT slug FROM t_p26758318_mortgage_support_pro.manual_properties WHERE id = %s', (property_id,))
                    result = cur.fetchone()
                    slug_value = result['slug'] if result else property_id
                    property_url = f"https://{event.get('headers', {}).get('Host', 'xn--80ajijbmjhop8h.xn--p1ai')}/property/{slug_value}"
                    
                    autopost_data = {
                        'property_id': property_id,
                        'title': data.get('title'),
                        'price': to_number(data.get('price')) or 0,
                        'location': data.get('location'),
                        'area': to_number(data.get('area')),
                        'rooms': to_number(data.get('rooms')),
                        'photo_url': photos[0] if photos else None,
                        'property_url': property_url
                    }
                    
                    # Вызываем функцию автопостинга
                    requests.post(
                        'https://functions.poehali.dev/4fd2d8f0-f94b-4d4b-8156-16b0e7ea6bb2',
                        json=autopost_data,
                        timeout=5
                    )
                except Exception as e:
                    # Не прерываем выполнение, если автопостинг не сработал
                    print(f'Autopost error: {e}')
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True, 'id': property_id}, ensure_ascii=False),
                'isBase64Encoded': False
            }

        elif method == 'PUT':
            data = json.loads(event.get('body', '{}'))
            property_id = data.get('id')
            
            if not property_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': False, 'error': 'Property ID required'})
                }
            
            # Архивирование / публикация объекта
            if 'is_active' in data and len(data) == 2:
                cur.execute('''
                    UPDATE t_p26758318_mortgage_support_pro.manual_properties
                    SET is_active = %s, updated_at = NOW()
                    WHERE id = %s
                ''', (data['is_active'], property_id))
                conn.commit()
                action = 'опубликован' if data['is_active'] else 'архивирован'
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True, 'message': f'Объект {action}'}, ensure_ascii=False),
                    'isBase64Encoded': False
                }
            
            photos = data.get('photos', [])
            if not photos and data.get('photo_url'):
                photos = [data.get('photo_url')]
            
            # Конвертируем пустые строки в None для числовых полей
            def to_number(value):
                if value == '' or value is None:
                    return None
                try:
                    return float(value) if '.' in str(value) else int(value)
                except:
                    return None
            
            # Автоматически обновляем SEO-теги в описании
            base_desc_put = data.get('description') or ''
            seo_tags_put = generate_seo_tags(data)
            # Убираем старый блок тегов (начинается с \n\n#) и добавляем новый
            import re as _re
            clean_desc_put = _re.sub(r'\n\n#[\s\S]*$', '', base_desc_put).rstrip()
            full_desc_put = (clean_desc_put + seo_tags_put) if seo_tags_put else clean_desc_put or None

            cur.execute('''
                UPDATE t_p26758318_mortgage_support_pro.manual_properties 
                SET title = %s, type = %s, property_category = %s, operation = %s, price = %s, location = %s, area = %s, 
                    rooms = %s, floor = %s, total_floors = %s, land_area = %s, 
                    photo_url = %s, photos = %s, description = %s, features = %s, property_link = %s, 
                    price_type = %s, phone = %s, contact_name = %s,
                    building_type = %s, renovation = %s, bathroom = %s, balcony = %s,
                    furniture = %s, pets_allowed = %s, children_allowed = %s, utilities_included = %s,
                    wall_material = %s, contact_method = %s, rutube_link = %s, updated_at = NOW()
                WHERE id = %s
            ''', (
                data.get('title'),
                data.get('type'),
                data.get('property_category', data.get('type')),
                data.get('operation', 'sale'),
                to_number(data.get('price')),
                data.get('location'),
                to_number(data.get('area')),
                to_number(data.get('rooms')),
                to_number(data.get('floor')),
                to_number(data.get('total_floors')),
                to_number(data.get('land_area')),
                photos[0] if photos else None,
                photos,
                full_desc_put,
                data.get('features', []),
                data.get('property_link') or None,
                data.get('price_type', 'total'),
                data.get('phone') or None,
                data.get('contact_name') or None,
                data.get('building_type') or None,
                data.get('renovation') or None,
                data.get('bathroom') or None,
                data.get('balcony') or None,
                data.get('furniture', False),
                data.get('pets_allowed', False),
                data.get('children_allowed', True),
                data.get('utilities_included', False),
                data.get('wall_material') or None,
                data.get('contact_method', 'phone'),
                data.get('rutube_link') or None,
                property_id
            ))
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True}, ensure_ascii=False),
                'isBase64Encoded': False
            }

        elif method == 'DELETE':
            params = event.get('queryStringParameters', {}) or {}
            body_data = json.loads(event.get('body', '{}'))
            property_id = params.get('id') or body_data.get('id')
            delete_all = params.get('all')
            
            if delete_all == 'true':
                cur.execute('''
                    UPDATE t_p26758318_mortgage_support_pro.manual_properties 
                    SET is_active = false, updated_at = NOW()
                    WHERE is_active = true
                ''')
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True}, ensure_ascii=False),
                    'isBase64Encoded': False
                }
            
            if not property_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': False, 'error': 'Property ID required'}),
                    'isBase64Encoded': False
                }
            
            cur.execute('''
                UPDATE t_p26758318_mortgage_support_pro.manual_properties 
                SET is_active = false, updated_at = NOW()
                WHERE id = %s
            ''', (property_id,))
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True}, ensure_ascii=False),
                'isBase64Encoded': False
            }

        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'success': False, 'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'success': False, 'error': str(e)}, ensure_ascii=False),
            'isBase64Encoded': False
        }
    finally:
        cur.close()
        conn.close()