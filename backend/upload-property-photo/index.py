import json
import os
import boto3
import base64
import uuid
from datetime import datetime

def handler(event: dict, context) -> dict:
    '''API для загрузки фотографий объектов недвижимости в S3'''
    method = event.get('httpMethod', 'POST')

    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': ''
        }

    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'success': False, 'error': 'Method not allowed'})
        }

    try:
        data = json.loads(event.get('body', '{}'))
        image_data = data.get('image_data')
        
        if not image_data:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': False, 'error': 'Image data required'})
            }

        # Убираем префикс data:image/...;base64,
        if ',' in image_data:
            image_data = image_data.split(',')[1]

        image_bytes = base64.b64decode(image_data)

        # Определяем тип файла
        content_type = 'image/jpeg'
        extension = 'jpg'
        if image_data.startswith('/9j/'):
            content_type = 'image/jpeg'
            extension = 'jpg'
        elif image_data.startswith('iVBOR'):
            content_type = 'image/png'
            extension = 'png'
        elif image_data.startswith('R0lGOD'):
            content_type = 'image/gif'
            extension = 'gif'

        # Инициализация S3
        s3 = boto3.client('s3',
            endpoint_url='https://bucket.poehali.dev',
            aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
            aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY']
        )

        # Генерация уникального имени файла
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        unique_id = str(uuid.uuid4())[:8]
        file_key = f'properties/{timestamp}_{unique_id}.{extension}'

        # Загрузка в S3
        s3.put_object(
            Bucket='files',
            Key=file_key,
            Body=image_bytes,
            ContentType=content_type
        )

        # Формирование CDN URL
        cdn_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{file_key}"

        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'success': True, 'url': cdn_url}, ensure_ascii=False)
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'success': False, 'error': str(e)})
        }
