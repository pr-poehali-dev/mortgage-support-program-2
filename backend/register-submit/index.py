"""
Backend функция для обработки заявок на ипотеку
Принимает упрощённую форму с ФИО, телефоном, email и документами
"""
import json
import os
import psycopg2
import urllib.request
from psycopg2.extras import RealDictCursor
from typing import Dict, Any


def send_telegram_notification(client_data: dict):
    """Отправляет уведомление о новой заявке в Telegram"""
    bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
    chat_id = os.environ.get('TELEGRAM_CHAT_ID')
    
    if not bot_token or not chat_id:
        return
    
    try:
        text = f"🏠 *Новая заявка на ипотеку*\n\n"
        text += f"👤 *ФИО:* {client_data.get('full_name', 'Не указано')}\n"
        text += f"📱 *Телефон:* {client_data.get('phone', 'Не указан')}\n"
        text += f"✉️ *Email:* {client_data.get('email', 'Не указан')}\n"
        
        documents_count = len(client_data.get('documents', []))
        if documents_count > 0:
            text += f"📎 *Документов загружено:* {documents_count}\n"
            text += f"🔗 *Ссылки на документы:*\n"
            for i, doc_url in enumerate(client_data.get('documents', [])[:5], 1):
                text += f"  {i}. {doc_url}\n"
            if documents_count > 5:
                text += f"  ... и ещё {documents_count - 5} документов\n"
        
        phone = client_data.get('phone', '')
        inline_keyboard = {
            'inline_keyboard': [[
                {'text': '✅ Принять в работу', 'callback_data': f'accept_{phone}'},
                {'text': '📞 Позвонить', 'url': f'tel:{phone}'}
            ]]
        }
        
        url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
        payload = {
            'chat_id': chat_id,
            'text': text,
            'parse_mode': 'Markdown',
            'reply_markup': inline_keyboard
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
    """Обработчик заявок на ипотеку с упрощённой формой"""
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
    
    body = json.loads(event.get('body', '{}'))
    
    full_name = body.get('fullName', '')
    phone = body.get('phone', '')
    email = body.get('email', '')
    documents = body.get('documents', [])
    
    if not full_name or not phone or not email:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'ФИО, телефон и email обязательны'}),
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        cursor.execute(
            "SELECT id FROM t_p26758318_mortgage_support_pro.clients WHERE phone = %s OR email = %s LIMIT 1",
            (phone, email)
        )
        existing_client = cursor.fetchone()
        
        if existing_client:
            client_id = existing_client['id']
            cursor.execute("""
                UPDATE t_p26758318_mortgage_support_pro.clients 
                SET 
                    full_name = %s,
                    name = %s,
                    phone = %s,
                    email = %s,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = %s
            """, (full_name, full_name, phone, email, client_id))
        else:
            cursor.execute("""
                INSERT INTO t_p26758318_mortgage_support_pro.clients (
                    full_name, name, phone, email, source
                ) VALUES (%s, %s, %s, %s, 'mortgage_form')
                RETURNING id
            """, (full_name, full_name, phone, email))
            client_id = cursor.fetchone()['id']
        
        documents_json = json.dumps(documents) if documents else None
        
        cursor.execute("""
            INSERT INTO t_p26758318_mortgage_support_pro.requests (
                client_id, status, message, additional_info
            ) VALUES (%s, 'new', 'Заявка на ипотеку через упрощённую форму', %s)
            RETURNING id
        """, (client_id, documents_json))
        request_id = cursor.fetchone()['id']
        
        conn.commit()
        
        send_telegram_notification({
            'full_name': full_name,
            'phone': phone,
            'email': email,
            'documents': documents
        })
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': True,
                'client_id': client_id,
                'request_id': request_id,
                'message': 'Заявка успешно отправлена'
            }),
            'isBase64Encoded': False
        }
        
    except Exception as e:
        conn.rollback()
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
    finally:
        cursor.close()
        conn.close()
