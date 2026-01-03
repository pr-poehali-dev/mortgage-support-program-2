import json
import os
import requests
from typing import Dict, Any, List


def get_avito_token() -> str:
    """Получает access token для Avito API"""
    client_id = os.environ.get('AVITO_CLIENT_ID', '')
    client_secret = os.environ.get('AVITO_CLIENT_SECRET', '')
    
    print(f"[DEBUG] Client ID начинается с: {client_id[:10]}...")
    
    response = requests.post(
        'https://api.avito.ru/token/',
        data={
            'grant_type': 'client_credentials',
            'client_id': client_id,
            'client_secret': client_secret
        }
    )
    
    print(f"[DEBUG] Статус ответа токена: {response.status_code}")
    
    if response.status_code != 200:
        print(f"[DEBUG] Ошибка получения токена: {response.text}")
    
    response.raise_for_status()
    return response.json()['access_token']


def get_user_items(access_token: str, user_id: str = '92755531') -> List[Dict[str, Any]]:
    """Получает список объявлений пользователя через API Avito"""
    headers = {
        'Authorization': f'Bearer {access_token}'
    }
    
    # Пробуем разные endpoints Avito API
    endpoints = [
        '/autoload/v1/items',  # Autoload API - управление объявлениями
        '/core/v1/items',       # Core API - чтение объявлений
        f'/core/v1/accounts/{user_id}/items',  # По ID пользователя
    ]
    
    for endpoint in endpoints:
        print(f"[DEBUG] Пробую endpoint: {endpoint}")
        
        response = requests.get(
            f'https://api.avito.ru{endpoint}',
            headers=headers
        )
        
        print(f"[DEBUG] Статус ответа: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"[DEBUG] Структура ответа: {list(data.keys())}")
            
            # API может возвращать разную структуру
            if 'resources' in data:
                items = data['resources']
                print(f"[DEBUG] Найдено объявлений: {len(items)}")
                return items
            elif 'items' in data:
                items = data['items']
                print(f"[DEBUG] Найдено объявлений: {len(items)}")
                return items
            elif 'result' in data and isinstance(data['result'], list):
                items = data['result']
                print(f"[DEBUG] Найдено объявлений: {len(items)}")
                return items
            else:
                print(f"[DEBUG] Неизвестная структура ответа: {data}")
        else:
            print(f"[DEBUG] Ошибка {response.status_code}: {response.text[:200]}")
    
    print(f"[DEBUG] Ни один endpoint не вернул объявления")
    return []


def transform_avito_item(item: Dict[str, Any]) -> Dict[str, Any]:
    """Преобразует объявление Avito в формат для сайта"""
    # Извлекаем категорию (может быть строкой или объектом)
    category_obj = item.get('category', {})
    if isinstance(category_obj, dict):
        category = category_obj.get('name', '').lower()
    else:
        category = str(category_obj).lower()
    
    # Определяем тип недвижимости
    if 'квартир' in category:
        obj_type = 'apartment'
    elif 'дом' in category or 'коттедж' in category or 'таунхаус' in category:
        obj_type = 'house'
    elif 'участок' in category or 'земельн' in category:
        obj_type = 'land'
    elif 'коммерч' in category:
        obj_type = 'commercial'
    else:
        obj_type = 'apartment'
    
    # Извлекаем характеристики
    props = {p['name']: p['value'] for p in item.get('properties', [])}
    
    # Извлекаем адрес (может быть строкой или объектом)
    address = item.get('address', 'Крым')
    if isinstance(address, dict):
        location = address.get('name', 'Крым')
    else:
        location = str(address)
    
    # Генерируем URL на Avito
    avito_url = item.get('url', '')
    if avito_url and not avito_url.startswith('http'):
        avito_url = f"https://www.avito.ru{avito_url}"
    elif not avito_url:
        avito_url = f"https://www.avito.ru/items/{item.get('id', '')}"
    
    return {
        'type': obj_type,
        'title': item.get('title', 'Объявление'),
        'price': int(item.get('price', 0)),
        'location': location,
        'area': int(props.get('Площадь, м²', 0)) if 'Площадь, м²' in props else None,
        'rooms': int(props.get('Количество комнат', 0)) if 'Количество комнат' in props else None,
        'floor': int(props.get('Этаж', 0)) if 'Этаж' in props else None,
        'totalFloors': int(props.get('Этажей в доме', 0)) if 'Этажей в доме' in props else None,
        'landArea': float(props.get('Площадь участка, сот.', 0)) if 'Площадь участка, сот.' in props else None,
        'image': item.get('images', [{}])[0].get('640x480') if item.get('images') else 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
        'description': item.get('description', ''),
        'features': [props.get(k) for k in ['Тип дома', 'Ремонт', 'Вид из окон'] if k in props and props[k]],
        'avitoLink': avito_url,
        'priceType': 'total'
    }


def handler(event: Dict[str, Any], context) -> Dict[str, Any]:
    """
    API для получения объявлений с Avito.
    Возвращает список объявлений пользователя в формате для сайта.
    """
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    try:
        print(f"[DEBUG] Получаю токен Avito API...")
        access_token = get_avito_token()
        print(f"[DEBUG] Токен получен успешно")
        
        print(f"[DEBUG] Запрашиваю объявления пользователя...")
        items = get_user_items(access_token)
        print(f"[DEBUG] Получено объявлений: {len(items)}")
        
        if not items:
            print(f"[DEBUG] Объявления не найдены, возвращаем пустой список")
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Cache-Control': 'max-age=60'
                },
                'body': json.dumps({
                    'success': True,
                    'count': 0,
                    'listings': [],
                    'message': 'Объявления не найдены. Проверьте права доступа API или ID пользователя.'
                })
            }
        
        print(f"[DEBUG] Преобразую объявления в формат сайта...")
        
        # Выводим структуру первого объявления для отладки
        if items:
            first_item = items[0]
            print(f"[DEBUG] Тип первого элемента: {type(first_item)}")
            print(f"[DEBUG] Первый элемент (JSON): {json.dumps(first_item, ensure_ascii=False)[:300]}")
        
        listings = []
        for i, item in enumerate(items):
            try:
                if not isinstance(item, dict):
                    print(f"[DEBUG] Пропуск item #{i}: не является словарем (тип: {type(item)})")
                    continue
                listing = transform_avito_item(item)
                listings.append(listing)
            except Exception as e:
                print(f"[ERROR] Ошибка преобразования item #{i}: {str(e)}")
                print(f"[ERROR] Ключи item: {list(item.keys()) if isinstance(item, dict) else 'N/A'}")
                continue
        print(f"[DEBUG] Преобразование завершено: {len(listings)} из {len(items)}")
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'max-age=300'
            },
            'body': json.dumps({
                'success': True,
                'count': len(listings),
                'listings': listings
            })
        }
    
    except requests.HTTPError as e:
        print(f"[ERROR] HTTPError: {str(e)}")
        error_detail = e.response.text if hasattr(e, 'response') and e.response.text else str(e)
        print(f"[ERROR] Детали ошибки: {error_detail}")
        
        try:
            error_json = e.response.json() if hasattr(e, 'response') else {}
        except:
            error_json = {'message': error_detail}
        
        return {
            'statusCode': e.response.status_code if hasattr(e, 'response') else 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': False,
                'error': 'Avito API error',
                'detail': error_json
            })
        }
    
    except Exception as e:
        print(f"[ERROR] Общая ошибка: {str(e)}")
        import traceback
        print(f"[ERROR] Traceback: {traceback.format_exc()}")
        
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