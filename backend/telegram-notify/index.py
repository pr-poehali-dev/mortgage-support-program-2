import json
import os
import urllib.request
import urllib.parse
from typing import Dict, Any


def handler(event: Dict[str, Any], context) -> Dict[str, Any]:
    """Отправляет уведомление о новой заявке в Telegram"""
    
    method = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
    chat_id = os.environ.get('TELEGRAM_CHAT_ID')
    
    if not bot_token or not chat_id:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Telegram credentials not configured'}),
            'isBase64Encoded': False
        }
    
    try:
        data = json.loads(event.get('body', '{}'))
        
        name = data.get('name', 'Не указано')
        phone = data.get('phone', 'Не указан')
        email = data.get('email', 'Не указан')
        message = data.get('message', 'Нет сообщения')
        region = data.get('region', '')
        source = data.get('source', 'Сайт')
        
        # Форматируем сообщение
        text = f"🔔 *Новая заявка с сайта*\n\n"
        text += f"👤 *Имя:* {name}\n"
        text += f"📱 *Телефон:* {phone}\n"
        text += f"✉️ *Email:* {email}\n"
        
        if region:
            text += f"📍 *Регион:* {region}\n"
        
        text += f"📝 *Сообщение:*\n{message}\n\n"
        text += f"🌐 *Источник:* {source}"
        
        # Отправляем в Telegram
        url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
        
        payload = {
            'chat_id': chat_id,
            'text': text,
            'parse_mode': 'Markdown'
        }
        
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode('utf-8'),
            headers={'Content-Type': 'application/json'}
        )
        
        with urllib.request.urlopen(req, timeout=10) as response:
            result = json.loads(response.read().decode('utf-8'))
            
            if result.get('ok'):
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'success': True, 'message': 'Notification sent'}),
                    'isBase64Encoded': False
                }
            else:
                return {
                    'statusCode': 500,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Failed to send notification'}),
                    'isBase64Encoded': False
                }
                
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
