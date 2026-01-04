import json
import os
import boto3
import base64
import uuid
from datetime import datetime
from io import BytesIO
from PIL import Image, ImageDraw
import requests

def get_average_brightness(image):
    '''Определяет среднюю яркость изображения'''
    grayscale = image.convert('L')
    pixels = list(grayscale.getdata())
    return sum(pixels) / len(pixels)

def add_watermark(image_bytes):
    '''Добавляет водяной знак на изображение'''
    # Открываем изображение
    image = Image.open(BytesIO(image_bytes)).convert('RGBA')
    
    # Определяем яркость изображения
    brightness = get_average_brightness(image)
    is_dark = brightness < 128
    
    # Выбираем логотип в зависимости от яркости
    logo_url = 'https://cdn.poehali.dev/files/с дескриптором белый вариант (1).png' if is_dark else 'https://cdn.poehali.dev/files/с дескриптором черный вариант (2).png'
    
    # Загружаем логотип
    response = requests.get(logo_url)
    logo = Image.open(BytesIO(response.content)).convert('RGBA')
    
    # Масштабируем логотип (20% от ширины изображения)
    logo_width = int(image.width * 0.2)
    aspect_ratio = logo.height / logo.width
    logo_height = int(logo_width * aspect_ratio)
    logo = logo.resize((logo_width, logo_height), Image.Resampling.LANCZOS)
    
    # Создаем полупрозрачный логотип
    alpha = logo.split()[3]
    alpha = alpha.point(lambda p: int(p * 0.7))  # 70% прозрачности
    logo.putalpha(alpha)
    
    # Позиционируем логотип в правом нижнем углу с отступом
    position = (image.width - logo_width - 20, image.height - logo_height - 20)
    
    # Накладываем логотип
    image.paste(logo, position, logo)
    
    # Конвертируем обратно в RGB и сохраняем в байты
    output = BytesIO()
    image.convert('RGB').save(output, format='JPEG', quality=90)
    return output.getvalue()

def handler(event: dict, context) -> dict:
    '''API для загрузки фотографий объектов недвижимости в S3 с водяным знаком'''
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
        photo_data = data.get('photo_data')
        
        if not photo_data:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': False, 'error': 'Photo data required'})
            }

        # Убираем префикс data:image/...;base64,
        if ',' in photo_data:
            photo_data = photo_data.split(',')[1]

        image_bytes = base64.b64decode(photo_data)

        # Добавляем водяной знак
        watermarked_bytes = add_watermark(image_bytes)

        # Инициализация S3
        s3 = boto3.client('s3',
            endpoint_url='https://bucket.poehali.dev',
            aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
            aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY']
        )

        # Генерация уникального имени файла
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        unique_id = str(uuid.uuid4())[:8]
        file_key = f'properties/{timestamp}_{unique_id}.jpg'

        # Загрузка в S3
        s3.put_object(
            Bucket='files',
            Key=file_key,
            Body=watermarked_bytes,
            ContentType='image/jpeg'
        )

        # Формирование CDN URL
        photo_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{file_key}"

        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'success': True, 'photo_url': photo_url}, ensure_ascii=False)
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'success': False, 'error': str(e)})
        }
