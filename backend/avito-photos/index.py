import json
import os
import base64
import psycopg2
import boto3
from typing import Dict, Any
from datetime import datetime


def get_db_connection():
    """Создает подключение к БД"""
    dsn = os.environ.get('DATABASE_URL')
    return psycopg2.connect(dsn)


def upload_to_s3(image_data: str, avito_id: int) -> str:
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
    filename = f'avito/{avito_id}/{datetime.now().timestamp()}.jpg'
    
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
    API для управления фотографиями объявлений Avito.
    
    GET / - получить все фото
    GET /?avito_id=123 - получить фото конкретного объявления
    POST / - загрузить новое фото (body: {avito_id, image_data, description})
    PUT / - обновить фото (body: {avito_id, image_data, description})
    DELETE /?avito_id=123 - удалить фото объявления
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
            # Получение фото
            query_params = event.get('queryStringParameters', {}) or {}
            avito_id = query_params.get('avito_id')
            
            if avito_id:
                cursor.execute(
                    "SELECT avito_id, photo_url, description, created_at, updated_at FROM t_p26758318_mortgage_support_pro.avito_listing_photos WHERE avito_id = %s",
                    (int(avito_id),)
                )
                row = cursor.fetchone()
                
                if row:
                    result = {
                        'avito_id': row[0],
                        'photo_url': row[1],
                        'description': row[2],
                        'created_at': row[3].isoformat() if row[3] else None,
                        'updated_at': row[4].isoformat() if row[4] else None
                    }
                else:
                    result = None
            else:
                cursor.execute(
                    "SELECT avito_id, photo_url, description, created_at, updated_at FROM t_p26758318_mortgage_support_pro.avito_listing_photos ORDER BY updated_at DESC"
                )
                rows = cursor.fetchall()
                result = [
                    {
                        'avito_id': row[0],
                        'photo_url': row[1],
                        'description': row[2],
                        'created_at': row[3].isoformat() if row[3] else None,
                        'updated_at': row[4].isoformat() if row[4] else None
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
        
        elif method == 'POST' or method == 'PUT':
            # Добавление/обновление фото
            body = json.loads(event.get('body', '{}'))
            avito_id = body.get('avito_id')
            image_data = body.get('image_data')
            description = body.get('description', '')
            
            if not avito_id or not image_data:
                cursor.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': False, 'error': 'avito_id и image_data обязательны'})
                }
            
            # Загружаем фото в S3
            photo_url = upload_to_s3(image_data, int(avito_id))
            
            # Сохраняем в БД (UPSERT)
            cursor.execute("""
                INSERT INTO t_p26758318_mortgage_support_pro.avito_listing_photos (avito_id, photo_url, description, updated_at)
                VALUES (%s, %s, %s, CURRENT_TIMESTAMP)
                ON CONFLICT (avito_id) 
                DO UPDATE SET 
                    photo_url = EXCLUDED.photo_url,
                    description = EXCLUDED.description,
                    updated_at = CURRENT_TIMESTAMP
            """, (int(avito_id), photo_url, description))
            
            conn.commit()
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': True,
                    'data': {
                        'avito_id': int(avito_id),
                        'photo_url': photo_url,
                        'description': description
                    }
                })
            }
        
        elif method == 'DELETE':
            # Удаление фото
            query_params = event.get('queryStringParameters', {}) or {}
            avito_id = query_params.get('avito_id')
            
            if not avito_id:
                cursor.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': False, 'error': 'avito_id обязателен'})
                }
            
            cursor.execute(
                "DELETE FROM t_p26758318_mortgage_support_pro.avito_listing_photos WHERE avito_id = %s",
                (int(avito_id),)
            )
            
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
