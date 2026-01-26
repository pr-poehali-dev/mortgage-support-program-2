import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime
from decimal import Decimal

def convert_to_serializable(obj):
    if isinstance(obj, Decimal):
        return float(obj)
    elif isinstance(obj, datetime):
        return obj.isoformat()
    elif isinstance(obj, dict):
        return {k: convert_to_serializable(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [convert_to_serializable(i) for i in obj]
    return obj

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
            show_all = event.get('queryStringParameters', {}).get('show_all')
            
            if property_id:
                cur.execute('''
                    SELECT * FROM t_p26758318_mortgage_support_pro.manual_properties 
                    WHERE id = %s
                ''', (property_id,))
                prop = cur.fetchone()
                prop_dict = convert_to_serializable(dict(prop)) if prop else None
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
                data.get('description') or None,
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
                    
                    # Формируем URL для просмотра объекта
                    property_url = f"https://{event.get('headers', {}).get('Host', 'xn--80ajijbmjhop8h.xn--p1ai')}/property/{property_id}"
                    
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
                data.get('description') or None,
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
            params = event.get('queryStringParameters', {})
            property_id = params.get('id')
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