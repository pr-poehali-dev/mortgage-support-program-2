import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Dict, Any


def handler(event: Dict[str, Any], context) -> Dict[str, Any]:
    """Обрабатывает webhook от Telegram бота для управления заявками"""
    
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
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    try:
        # Парсим webhook от Telegram
        data = json.loads(event.get('body', '{}'))
        
        # Обрабатываем callback от inline кнопок
        if 'callback_query' in data:
            callback = data['callback_query']
            callback_data = callback.get('data', '')
            message_id = callback['message']['message_id']
            chat_id = callback['message']['chat']['id']
            
            # Парсим действие и телефон
            action, phone = callback_data.split('_', 1)
            
            # Подключаемся к БД
            conn = psycopg2.connect(os.environ['DATABASE_URL'])
            cursor = conn.cursor(cursor_factory=RealDictCursor)
            
            # Находим клиента по телефону
            cursor.execute(
                "SELECT id FROM clients WHERE phone = %s LIMIT 1",
                (phone,)
            )
            client = cursor.fetchone()
            
            if client:
                client_id = client['id']
                
                # Определяем новый статус
                status_map = {
                    'accept': 'in_progress',
                    'complete': 'completed',
                    'reject': 'cancelled'
                }
                new_status = status_map.get(action, 'new')
                
                # Обновляем статус всех заявок клиента
                cursor.execute(
                    """UPDATE requests 
                       SET status = %s, updated_at = CURRENT_TIMESTAMP 
                       WHERE client_id = %s AND status != 'completed' AND status != 'cancelled'""",
                    (new_status, client_id)
                )
                conn.commit()
                
                # Отправляем подтверждение
                status_text = {
                    'accept': '✅ Заявка принята в работу',
                    'complete': '✔️ Заявка завершена',
                    'reject': '❌ Заявка отклонена'
                }
                
                answer_callback(chat_id, callback['id'], status_text.get(action, 'Статус обновлен'))
                update_message_status(chat_id, message_id, callback['message']['text'], status_text.get(action, ''))
            
            cursor.close()
            conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'ok': True}),
            'isBase64Encoded': False
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }


def answer_callback(chat_id: str, callback_id: str, text: str):
    """Отвечает на callback query"""
    import urllib.request
    
    bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
    if not bot_token:
        return
    
    url = f"https://api.telegram.org/bot{bot_token}/answerCallbackQuery"
    
    payload = {
        'callback_query_id': callback_id,
        'text': text,
        'show_alert': False
    }
    
    try:
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode('utf-8'),
            headers={'Content-Type': 'application/json'}
        )
        urllib.request.urlopen(req, timeout=5)
    except:
        pass


def update_message_status(chat_id: str, message_id: int, original_text: str, status: str):
    """Обновляет сообщение с новым статусом"""
    import urllib.request
    
    bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
    if not bot_token:
        return
    
    url = f"https://api.telegram.org/bot{bot_token}/editMessageText"
    
    # Добавляем статус к оригинальному тексту
    new_text = f"{original_text}\n\n🔄 *Статус:* {status}"
    
    payload = {
        'chat_id': chat_id,
        'message_id': message_id,
        'text': new_text,
        'parse_mode': 'Markdown'
    }
    
    try:
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode('utf-8'),
            headers={'Content-Type': 'application/json'}
        )
        urllib.request.urlopen(req, timeout=5)
    except:
        pass
