import json
import os
import requests

def handler(event: dict, context) -> dict:
    '''API для автоматической публикации объявлений в Telegram и VK'''
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
        
        property_id = data.get('property_id')
        title = data.get('title')
        price = data.get('price')
        location = data.get('location')
        area = data.get('area')
        rooms = data.get('rooms')
        photo_url = data.get('photo_url')
        property_url = data.get('property_url')
        
        if not all([property_id, title, price, location]):
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': False, 'error': 'Missing required fields'})
            }

        # Формируем текст объявления
        message_parts = [
            f"🏠 {title}",
            f"",
            f"💰 Цена: {int(price):,} ₽".replace(',', ' '),
            f"📍 {location}"
        ]
        
        if area:
            message_parts.append(f"📐 Площадь: {area} м²")
        if rooms:
            message_parts.append(f"🚪 Комнат: {rooms}")
        
        message_parts.append(f"")
        message_parts.append(f"🔗 Подробнее: {property_url}")
        message_parts.append(f"")
        message_parts.append(f"#недвижимость #севастополь #крым")
        
        message_text = "\n".join(message_parts)
        
        results = {
            'telegram': {'success': False, 'error': None},
            'vk': {'success': False, 'error': None}
        }

        # Публикация в Telegram
        telegram_token = os.environ.get('TELEGRAM_BOT_TOKEN')
        telegram_chat_id = os.environ.get('TELEGRAM_CHAT_ID')
        
        if telegram_token and telegram_chat_id:
            try:
                tg_url = f"https://api.telegram.org/bot{telegram_token}/sendPhoto"
                
                tg_data = {
                    'chat_id': telegram_chat_id,
                    'caption': message_text,
                    'parse_mode': 'HTML'
                }
                
                if photo_url:
                    tg_data['photo'] = photo_url
                    response = requests.post(tg_url, json=tg_data, timeout=10)
                else:
                    # Если нет фото, отправляем текстом
                    tg_url = f"https://api.telegram.org/bot{telegram_token}/sendMessage"
                    tg_data = {
                        'chat_id': telegram_chat_id,
                        'text': message_text,
                        'parse_mode': 'HTML'
                    }
                    response = requests.post(tg_url, json=tg_data, timeout=10)
                
                if response.status_code == 200:
                    results['telegram']['success'] = True
                else:
                    results['telegram']['error'] = f"Status {response.status_code}"
            except Exception as e:
                results['telegram']['error'] = str(e)

        # Публикация в VK
        vk_token = os.environ.get('VK_ACCESS_TOKEN')
        vk_group_id = os.environ.get('VK_GROUP_ID')
        
        if vk_token and vk_group_id:
            try:
                # Сначала загружаем фото на сервер VK (если есть)
                attachments = []
                
                if photo_url:
                    # Получаем адрес сервера для загрузки
                    upload_server_response = requests.get(
                        'https://api.vk.com/method/photos.getWallUploadServer',
                        params={
                            'access_token': vk_token,
                            'v': '5.131',
                            'group_id': vk_group_id
                        },
                        timeout=10
                    )
                    upload_server_data = upload_server_response.json()
                    
                    if 'response' in upload_server_data:
                        upload_url = upload_server_data['response']['upload_url']
                        
                        # Скачиваем фото
                        photo_response = requests.get(photo_url, timeout=10)
                        
                        # Загружаем фото на сервер VK
                        upload_response = requests.post(
                            upload_url,
                            files={'photo': ('photo.jpg', photo_response.content, 'image/jpeg')},
                            timeout=10
                        )
                        upload_data = upload_response.json()
                        
                        # Сохраняем фото в альбоме
                        save_response = requests.get(
                            'https://api.vk.com/method/photos.saveWallPhoto',
                            params={
                                'access_token': vk_token,
                                'v': '5.131',
                                'group_id': vk_group_id,
                                'photo': upload_data['photo'],
                                'server': upload_data['server'],
                                'hash': upload_data['hash']
                            },
                            timeout=10
                        )
                        save_data = save_response.json()
                        
                        if 'response' in save_data and len(save_data['response']) > 0:
                            photo_info = save_data['response'][0]
                            attachments.append(f"photo{photo_info['owner_id']}_{photo_info['id']}")
                
                # Публикуем пост на стене
                post_response = requests.get(
                    'https://api.vk.com/method/wall.post',
                    params={
                        'access_token': vk_token,
                        'v': '5.131',
                        'owner_id': f'-{vk_group_id}',
                        'from_group': '1',
                        'message': message_text,
                        'attachments': ','.join(attachments) if attachments else ''
                    },
                    timeout=10
                )
                post_data = post_response.json()
                
                if 'response' in post_data:
                    results['vk']['success'] = True
                    results['vk']['post_id'] = post_data['response']['post_id']
                else:
                    results['vk']['error'] = post_data.get('error', {}).get('error_msg', 'Unknown error')
            except Exception as e:
                results['vk']['error'] = str(e)

        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'success': True,
                'results': results
            }, ensure_ascii=False)
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'success': False, 'error': str(e)})
        }
