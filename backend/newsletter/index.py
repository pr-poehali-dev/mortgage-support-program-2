import json
import os
import psycopg2
import urllib.request
from typing import Dict, Any


def send_telegram_notification(email: str, name: str):
    """Отправляет уведомление о новой подписке в Telegram"""
    bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
    chat_id = os.environ.get('TELEGRAM_CHAT_ID')
    
    if not bot_token or not chat_id:
        return
    
    try:
        text = f"📧 *Новая подписка на рассылку*\n\n"
        text += f"👤 *Имя:* {name}\n"
        text += f"✉️ *Email:* {email}\n"
        
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
        urllib.request.urlopen(req, timeout=5)
    except:
        pass

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Управление подписками на рассылку блога
    Args: event - dict с httpMethod, body
          context - object с request_id
    Returns: HTTP response dict
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    try:
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor()
        
        if method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            email = body_data.get('email', '').strip().lower()
            name = body_data.get('name', '').strip()
            
            if not email or not name:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Email и имя обязательны'}),
                    'isBase64Encoded': False
                }
            
            cur.execute(
                "SELECT id FROM newsletter_subscribers WHERE email = %s",
                (email,)
            )
            existing = cur.fetchone()
            
            if existing:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Этот email уже подписан'}),
                    'isBase64Encoded': False
                }
            
            cur.execute(
                "INSERT INTO newsletter_subscribers (email, name, subscribed_at) VALUES (%s, %s, NOW()) RETURNING id",
                (email, name)
            )
            subscriber_id = cur.fetchone()[0]
            conn.commit()
            
            # Отправляем уведомление в Telegram
            send_telegram_notification(email, name)
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'success': True,
                    'subscriber_id': subscriber_id,
                    'message': 'Подписка оформлена успешно'
                }),
                'isBase64Encoded': False
            }
        
        if method == 'GET':
            cur.execute("SELECT COUNT(*) FROM newsletter_subscribers WHERE is_active = TRUE")
            count = cur.fetchone()[0]
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'subscribers_count': count}),
                'isBase64Encoded': False
            }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
    finally:
        if 'cur' in locals():
            cur.close()
        if 'conn' in locals():
            conn.close()