import json
import re
import os
from typing import Dict, Any, Optional

def handler(event: dict, context) -> dict:
    '''Парсер данных с Avito для интеграции объявлений в каталог'''
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    params = event.get('queryStringParameters', {}) or {}
    avito_url = params.get('url', '')
    
    if not avito_url:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Missing url parameter'}),
            'isBase64Encoded': False
        }
    
    # Extract listing ID from URL
    listing_id_match = re.search(r'_(\d+)$', avito_url)
    if not listing_id_match:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Invalid Avito URL format'}),
            'isBase64Encoded': False
        }
    
    listing_id = listing_id_match.group(1)
    
    # Mock data based on the Avito listing from Sevastopol
    # In production, this would use a web scraping library or Avito API
    property_data = {
        'title': 'Участок 14,6 сот. (СНТ, ДНП)',
        'price': 10400000,
        'location': 'Севастополь, Балаклавский р-н, Фиолент',
        'land_area': 14.6,
        'type': 'land',
        'description': '''Продаю земельный участок на Фиолентe "ТCH «Союз" учaсток № 283

📍 Расположение:
• Расстояние до центра: 12 км
• Расстояние до моря: 1 км
• Район: Балаклавский, Фиолент

📐 Характеристики участка:
• Площадь: 14,6 соток (1460 м²)
• Кадастровые номера: 91:01:005018:128 (1326 м²) и 91:01:005018:800 (147 м²)
• Рельеф: ровный
• На участке черновая коробка дома 100 м²

⚡ Коммуникации:
• Электричество и вода по границе участка
• Возможно подключение газа
• Круглогодичные соседи
• Удобные подъездные пути
• Развитая инфраструктура

📋 Документы:
• Готов к сделке
• Соответствует требованиям РФ
• Единственный собственник

Идеально для строительства дома или дачи в живописном районе рядом с морем!''',
        'photos': [
            'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800',
            'https://images.unsplash.com/photo-1464146072230-91cabc968266?w=800',
            'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800'
        ],
        'property_link': avito_url,
        'phone': '+7 (978) 123-45-67',
        'features': [
            'Электричество по границе',
            'Вода по границе',
            'Возможно подключение газа',
            'Ровный рельеф',
            'Черновая коробка дома 100 м²',
            '1 км до моря',
            'Развитая инфраструктура'
        ]
    }
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({
            'success': True,
            'data': property_data
        }, ensure_ascii=False),
        'isBase64Encoded': False
    }
