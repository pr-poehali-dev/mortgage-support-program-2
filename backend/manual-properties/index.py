import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime

def handler(event: dict, context) -> dict:
    '''API для управления собственными объектами недвижимости'''
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
            
            if property_id:
                cur.execute('''
                    SELECT * FROM t_p26758318_mortgage_support_pro.manual_properties 
                    WHERE id = %s AND is_active = true
                ''', (property_id,))
                prop = cur.fetchone()
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True, 'property': dict(prop) if prop else None}, ensure_ascii=False)
                }
            else:
                cur.execute('''
                    SELECT * FROM t_p26758318_mortgage_support_pro.manual_properties 
                    WHERE is_active = true 
                    ORDER BY created_at DESC
                ''')
                properties = [dict(row) for row in cur.fetchall()]
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True, 'properties': properties}, ensure_ascii=False)
                }

        elif method == 'POST':
            data = json.loads(event.get('body', '{}'))
            
            cur.execute('''
                INSERT INTO t_p26758318_mortgage_support_pro.manual_properties 
                (title, type, price, location, area, rooms, floor, total_floors, land_area, 
                 photo_url, description, features, property_link, price_type, is_active, created_at, updated_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, true, NOW(), NOW())
                RETURNING id
            ''', (
                data.get('title'),
                data.get('type'),
                data.get('price'),
                data.get('location'),
                data.get('area'),
                data.get('rooms'),
                data.get('floor'),
                data.get('total_floors'),
                data.get('land_area'),
                data.get('photo_url'),
                data.get('description'),
                data.get('features', []),
                data.get('property_link'),
                data.get('price_type', 'total')
            ))
            
            property_id = cur.fetchone()['id']
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True, 'id': property_id}, ensure_ascii=False)
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
            
            cur.execute('''
                UPDATE t_p26758318_mortgage_support_pro.manual_properties 
                SET title = %s, type = %s, price = %s, location = %s, area = %s, 
                    rooms = %s, floor = %s, total_floors = %s, land_area = %s, 
                    photo_url = %s, description = %s, features = %s, property_link = %s, 
                    price_type = %s, updated_at = NOW()
                WHERE id = %s
            ''', (
                data.get('title'),
                data.get('type'),
                data.get('price'),
                data.get('location'),
                data.get('area'),
                data.get('rooms'),
                data.get('floor'),
                data.get('total_floors'),
                data.get('land_area'),
                data.get('photo_url'),
                data.get('description'),
                data.get('features', []),
                data.get('property_link'),
                data.get('price_type', 'total'),
                property_id
            ))
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True}, ensure_ascii=False)
            }

        elif method == 'DELETE':
            property_id = event.get('queryStringParameters', {}).get('id')
            
            if not property_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': False, 'error': 'Property ID required'})
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
                'body': json.dumps({'success': True}, ensure_ascii=False)
            }

        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'success': False, 'error': 'Method not allowed'})
        }

    finally:
        cur.close()
        conn.close()
