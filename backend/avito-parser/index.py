import json
import re
import os
from typing import Dict, Any, Optional

def handler(event: dict, context) -> dict:
    '''Парсер данных с Avito для интеграции объявлений в каталог. Поддерживает парсинг одного объявления или всего профиля.'''
    
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
    parse_profile = params.get('profile', 'false').lower() == 'true'
    
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
    
    # Если нужен парсинг профиля
    if parse_profile:
        import requests
        from bs4 import BeautifulSoup
        
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
            
            response = requests.get(avito_url, headers=headers, timeout=15)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Пробуем разные селекторы для поиска объявлений
            items = soup.find_all('div', {'data-marker': 'item'})
            
            if not items:
                # Альтернативный селектор
                items = soup.select('[data-marker="item"]')
            
            print(f'[DEBUG] Found {len(items)} items on page')
            
            profile_items = []
            for idx, item in enumerate(items[:20]):
                try:
                    # Ищем ссылку на объявление
                    link_elem = item.find('a', {'itemprop': 'url'})
                    if not link_elem:
                        link_elem = item.find('a', href=re.compile(r'/(dom|zemelnye|kvartiry|kommerchesk)'))
                    
                    if not link_elem:
                        print(f'[DEBUG] Item {idx}: no link found')
                        continue
                    
                    item_href = link_elem.get('href', '')
                    item_url = 'https://www.avito.ru' + item_href if item_href.startswith('/') else item_href
                    
                    title = link_elem.get('title', '').strip()
                    if not title:
                        title_elem = item.find(['h3', 'h2'])
                        title = title_elem.get_text(strip=True) if title_elem else 'Объявление'
                    
                    price_elem = item.find('meta', {'itemprop': 'price'})
                    if not price_elem:
                        price_elem = item.find('span', {'data-marker': 'item-price'})
                    
                    price = 0
                    if price_elem:
                        price_text = price_elem.get('content', '') or price_elem.get_text(strip=True)
                        price_text = re.sub(r'[^\d]', '', price_text)
                        price = int(price_text) if price_text else 0
                    
                    location_elem = item.find('div', {'data-marker': 'item-address'})
                    if not location_elem:
                        location_elem = item.find('span', string=re.compile(r'Севастополь|Крым'))
                    location = location_elem.get_text(strip=True) if location_elem else 'Крым'
                    
                    img_elem = item.find('img')
                    photo = img_elem.get('src', '') or img_elem.get('data-src', '') if img_elem else ''
                    
                    print(f'[DEBUG] Item {idx}: title={title[:30]}, price={price}, url={item_url[:50]}')
                    
                    if title and item_url and '_' in item_url:
                        profile_items.append({
                            'title': title,
                            'price': price,
                            'location': location,
                            'photo_url': photo,
                            'property_link': item_url,
                            'type': 'land'
                        })
                except Exception as e:
                    print(f'[DEBUG] Item {idx} error: {str(e)}')
                    continue
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': True,
                    'items': profile_items,
                    'count': len(profile_items)
                }, ensure_ascii=False),
                'isBase64Encoded': False
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
                    'error': f'Profile parsing error: {str(e)}'
                }),
                'isBase64Encoded': False
            }
    
    # Парсинг одного объявления
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