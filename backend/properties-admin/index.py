import json
import os
import base64
import psycopg2
import boto3
from typing import Dict, Any, List
from datetime import datetime


def get_db_connection():
    """Создает подключение к БД"""
    dsn = os.environ.get('DATABASE_URL')
    return psycopg2.connect(dsn)


def upload_to_s3(image_data: str, property_id: int) -> str:
    """Загружает изображение в S3 и возвращает URL"""
    s3 = boto3.client('s3',
        endpoint_url='https://bucket.poehali.dev',
        aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
    )
    
    # Декодируем base64
    image_bytes = base64.b64decode(image_data.split(',')[1] if ',' in image_data else image_data)
    
    # Определяем тип изображения
    content_type = 'image/jpeg'
    if image_data.startswith('data:image/png'):
        content_type = 'image/png'
    elif image_data.startswith('data:image/webp'):
        content_type = 'image/webp'
    
    # Генерируем имя файла
    filename = f'properties/{property_id}/{datetime.now().timestamp()}.jpg'
    
    # Загружаем в S3
    s3.put_object(
        Bucket='files',
        Key=filename,
        Body=image_bytes,
        ContentType=content_type
    )
    
    # Возвращаем CDN URL
    cdn_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{filename}"
    return cdn_url


def handler(event: Dict[str, Any], context) -> Dict[str, Any]:
    """
    API для управления объектами недвижимости (ручное добавление + Avito).
    
    GET / - получить все объекты (ручные + Avito)
    GET /?id=123 - получить конкретный объект
    POST / - создать новый объект
    PUT / - обновить объект
    DELETE /?id=123 - удалить объект
    """
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        if method == 'GET':
            query_params = event.get('queryStringParameters', {}) or {}
            property_id = query_params.get('id')
            
            if property_id:
                # Получаем конкретный объект
                cursor.execute("""
                    SELECT id, title, type, price, location, area, rooms, floor, 
                           total_floors, land_area, photo_url, description, features, 
                           property_link, price_type, is_active, created_at, updated_at
                    FROM t_p26758318_mortgage_support_pro.manual_properties
                    WHERE id = %s
                """, (int(property_id),))
                
                row = cursor.fetchone()
                if row:
                    result = {
                        'id': row[0],
                        'title': row[1],
                        'type': row[2],
                        'price': row[3],
                        'location': row[4],
                        'area': row[5],
                        'rooms': row[6],
                        'floor': row[7],
                        'totalFloors': row[8],
                        'landArea': row[9],
                        'image': row[10],
                        'description': row[11],
                        'features': row[12] or [],
                        'propertyLink': row[13],
                        'priceType': row[14],
                        'isActive': row[15],
                        'createdAt': row[16].isoformat() if row[16] else None,
                        'updatedAt': row[17].isoformat() if row[17] else None
                    }
                else:
                    result = None
            else:
                # Получаем все активные объекты
                cursor.execute("""
                    SELECT id, title, type, price, location, area, rooms, floor, 
                           total_floors, land_area, photo_url, description, features, 
                           property_link, price_type, is_active
                    FROM t_p26758318_mortgage_support_pro.manual_properties
                    WHERE is_active = true
                    ORDER BY created_at DESC
                """)
                
                rows = cursor.fetchall()
                result = [
                    {
                        'id': row[0],
                        'title': row[1],
                        'type': row[2],
                        'price': row[3],
                        'location': row[4],
                        'area': row[5],
                        'rooms': row[6],
                        'floor': row[7],
                        'totalFloors': row[8],
                        'landArea': row[9],
                        'image': row[10] or 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
                        'description': row[11] or '',
                        'features': row[12] or [],
                        'propertyLink': row[13] or '',
                        'priceType': row[14] or 'total',
                        'isActive': row[15]
                    }
                    for row in rows
                ]
            
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'success': True, 'data': result})
            }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            
            # Загружаем фото если есть
            photo_url = None
            if body.get('image_data'):
                # Сначала создаем запись чтобы получить ID
                cursor.execute("""
                    INSERT INTO t_p26758318_mortgage_support_pro.manual_properties 
                    (title, type, price, location, area, rooms, floor, total_floors, 
                     land_area, description, features, property_link, price_type)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    RETURNING id
                """, (
                    body.get('title'),
                    body.get('type'),
                    body.get('price'),
                    body.get('location'),
                    body.get('area'),
                    body.get('rooms'),
                    body.get('floor'),
                    body.get('total_floors'),
                    body.get('land_area'),
                    body.get('description', ''),
                    body.get('features', []),
                    body.get('property_link', ''),
                    body.get('price_type', 'total')
                ))
                
                property_id = cursor.fetchone()[0]
                photo_url = upload_to_s3(body['image_data'], property_id)
                
                # Обновляем URL фото
                cursor.execute("""
                    UPDATE t_p26758318_mortgage_support_pro.manual_properties 
                    SET photo_url = %s 
                    WHERE id = %s
                """, (photo_url, property_id))
            else:
                cursor.execute("""
                    INSERT INTO t_p26758318_mortgage_support_pro.manual_properties 
                    (title, type, price, location, area, rooms, floor, total_floors, 
                     land_area, photo_url, description, features, property_link, price_type)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    RETURNING id
                """, (
                    body.get('title'),
                    body.get('type'),
                    body.get('price'),
                    body.get('location'),
                    body.get('area'),
                    body.get('rooms'),
                    body.get('floor'),
                    body.get('total_floors'),
                    body.get('land_area'),
                    body.get('photo_url'),
                    body.get('description', ''),
                    body.get('features', []),
                    body.get('property_link', ''),
                    body.get('price_type', 'total')
                ))
                
                property_id = cursor.fetchone()[0]
            
            conn.commit()
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'success': True, 'id': property_id})
            }
        
        elif method == 'PUT':
            body = json.loads(event.get('body', '{}'))
            property_id = body.get('id')
            
            if not property_id:
                cursor.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': False, 'error': 'ID обязателен'})
                }
            
            # Загружаем новое фото если есть
            photo_url = body.get('photo_url')
            if body.get('image_data'):
                photo_url = upload_to_s3(body['image_data'], property_id)
            
            cursor.execute("""
                UPDATE t_p26758318_mortgage_support_pro.manual_properties
                SET title = %s, type = %s, price = %s, location = %s, area = %s,
                    rooms = %s, floor = %s, total_floors = %s, land_area = %s,
                    photo_url = %s, description = %s, features = %s, 
                    property_link = %s, price_type = %s, is_active = %s,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = %s
            """, (
                body.get('title'),
                body.get('type'),
                body.get('price'),
                body.get('location'),
                body.get('area'),
                body.get('rooms'),
                body.get('floor'),
                body.get('total_floors'),
                body.get('land_area'),
                photo_url,
                body.get('description', ''),
                body.get('features', []),
                body.get('property_link', ''),
                body.get('price_type', 'total'),
                body.get('is_active', True),
                property_id
            ))
            
            conn.commit()
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'success': True})
            }
        
        elif method == 'DELETE':
            query_params = event.get('queryStringParameters', {}) or {}
            property_id = query_params.get('id')
            
            if not property_id:
                cursor.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': False, 'error': 'ID обязателен'})
                }
            
            # Мягкое удаление
            cursor.execute("""
                UPDATE t_p26758318_mortgage_support_pro.manual_properties
                SET is_active = false, updated_at = CURRENT_TIMESTAMP
                WHERE id = %s
            """, (int(property_id),))
            
            conn.commit()
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'success': True})
            }
        
        else:
            cursor.close()
            conn.close()
            return {
                'statusCode': 405,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': False, 'error': 'Метод не поддерживается'})
            }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': False,
                'error': str(e)
            })
        }
