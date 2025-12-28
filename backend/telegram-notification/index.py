import json
import os
import urllib.request
import urllib.parse
import urllib.error


def handler(event: dict, context) -> dict:
    """Отправка заявок с сайта в Telegram через бота"""
    
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
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    try:
        body = json.loads(event.get('body', '{}'))
        name = body.get('name', '')
        phone = body.get('phone', '')
        city = body.get('city', '')
        
        print(f"[DEBUG] Received data: name={name}, phone={phone}, city={city}")
        
        if not name or not phone or not city:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Missing required fields'})
            }
        
        bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
        chat_id = os.environ.get('TELEGRAM_CHAT_ID')
        
        print(f"[DEBUG] Bot token present: {bool(bot_token)}, Chat ID: {chat_id}")
        
        if not bot_token or not chat_id:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Telegram credentials not configured', 'details': {'bot_token': bool(bot_token), 'chat_id': bool(chat_id)}})
            }
        
        message = f"🏠 Новая заявка на ипотеку\n\n📍 Город: {city}\n👤 Имя: {name}\n📞 Телефон: {phone}"
        
        url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
        
        try:
            chat_id_int = int(chat_id)
        except ValueError:
            chat_id_int = chat_id
        
        payload = {
            'chat_id': chat_id_int,
            'text': message
        }
        
        print(f"[DEBUG] Payload: {payload}")
        
        data = json.dumps(payload).encode('utf-8')
        
        req = urllib.request.Request(url, data=data, method='POST')
        req.add_header('Content-Type', 'application/json')
        print(f"[DEBUG] Sending to Telegram API...")
        
        try:
            with urllib.request.urlopen(req) as response:
                result = json.loads(response.read().decode('utf-8'))
                print(f"[DEBUG] Telegram API response: {result}")
                
                if result.get('ok'):
                    print(f"[SUCCESS] Message sent to chat {chat_id}")
                    return {
                        'statusCode': 200,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'body': json.dumps({'success': True, 'message': 'Заявка отправлена'})
                    }
                else:
                    print(f"[ERROR] Telegram API error: {result}")
                    return {
                        'statusCode': 500,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'body': json.dumps({'error': 'Failed to send telegram message', 'telegram_error': result})
                    }
        except urllib.error.HTTPError as http_err:
            error_body = http_err.read().decode('utf-8')
            print(f"[ERROR] HTTP Error {http_err.code}: {error_body}")
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': f'HTTP Error {http_err.code}', 'details': error_body})
            }
    
    except Exception as e:
        print(f"[ERROR] Exception: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)})
        }