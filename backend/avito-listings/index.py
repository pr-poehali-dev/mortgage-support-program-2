import json
import os
import requests
from typing import Dict, Any, List


def get_avito_token() -> str:
    """Получает access token для Avito API"""
    client_id = os.environ['AVITO_CLIENT_ID']
    client_secret = os.environ['AVITO_CLIENT_SECRET']
    
    response = requests.post(
        'https://api.avito.ru/token/',
        data={
            'grant_type': 'client_credentials',
            'client_id': client_id,
            'client_secret': client_secret
        }
    )
    response.raise_for_status()
    return response.json()['access_token']


def get_user_items(access_token: str) -> List[Dict[str, Any]]:
    """Получает список объявлений пользователя"""
    headers = {
        'Authorization': f'Bearer {access_token}'
    }
    
    response = requests.get(
        'https://api.avito.ru/core/v1/accounts/self/items',
        headers=headers
    )
    response.raise_for_status()
    return response.json().get('resources', [])


def transform_avito_item(item: Dict[str, Any]) -> Dict[str, Any]:
    """Преобразует объявление Avito в формат для сайта"""
    category = item.get('category', {}).get('name', '').lower()
    
    # Определяем тип недвижимости
    if 'квартир' in category:
        obj_type = 'apartment'
    elif 'дом' in category or 'коттедж' in category or 'таунхаус' in category:
        obj_type = 'house'
    elif 'участок' in category or 'земля' in category:
        obj_type = 'land'
    elif 'коммерч' in category:
        obj_type = 'commercial'
    else:
        obj_type = 'apartment'
    
    # Извлекаем характеристики
    props = {p['name']: p['value'] for p in item.get('properties', [])}
    
    return {
        'type': obj_type,
        'title': item.get('title', ''),
        'price': int(item.get('price', 0)),
        'location': item.get('address', {}).get('name', 'Крым'),
        'area': int(props.get('Площадь, м²', 0)) if 'Площадь, м²' in props else None,
        'rooms': int(props.get('Количество комнат', 0)) if 'Количество комнат' in props else None,
        'floor': int(props.get('Этаж', 0)) if 'Этаж' in props else None,
        'totalFloors': int(props.get('Этажей в доме', 0)) if 'Этажей в доме' in props else None,
        'landArea': float(props.get('Площадь участка, сот.', 0)) if 'Площадь участка, сот.' in props else None,
        'image': item.get('images', [{}])[0].get('640x480') if item.get('images') else 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
        'description': item.get('description', ''),
        'features': [props.get(k) for k in ['Тип дома', 'Ремонт', 'Вид из окон'] if k in props and props[k]],
        'avitoLink': f"https://www.avito.ru{item.get('url', '')}",
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
        # Получаем токен
        access_token = get_avito_token()
        
        # Получаем объявления
        items = get_user_items(access_token)
        
        # Преобразуем в формат сайта
        listings = [transform_avito_item(item) for item in items if item.get('status') == 'active']
        
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
        error_detail = e.response.json() if e.response.text else str(e)
        return {
            'statusCode': e.response.status_code if hasattr(e, 'response') else 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': False,
                'error': 'Avito API error',
                'detail': error_detail
            })
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
