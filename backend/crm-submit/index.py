import json
import os
import psycopg2
import urllib.request
from psycopg2.extras import RealDictCursor


def send_telegram_notification(name: str, phone: str, email: str, city: str, message: str, source: str):
    """Отправляет уведомление о новой заявке в Telegram с кнопками быстрых действий"""
    bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
    chat_id = os.environ.get('TELEGRAM_CHAT_ID')
    
    if not bot_token or not chat_id:
        return
    
    try:
        text = f"🔔 *Новая заявка с сайта*\n\n"
        text += f"👤 *Имя:* {name}\n"
        text += f"📱 *Телефон:* {phone}\n"
        text += f"✉️ *Email:* {email or 'Не указан'}\n"
        
        if city:
            text += f"📍 *Регион:* {city}\n"
        
        text += f"📝 *Сообщение:*\n{message or 'Нет сообщения'}\n\n"
        text += f"🌐 *Источник:* {source}"
        
        # Inline клавиатура с быстрыми действиями
        inline_keyboard = {
            'inline_keyboard': [
                [
                    {'text': '✅ Принять в работу', 'callback_data': f'accept_{phone}'},
                    {'text': '📞 Позвонить', 'url': f'tel:{phone}'}
                ],
                [
                    {'text': '✉️ Написать Email', 'url': f'mailto:{email}' if email else 'mailto:info@example.com'},
                    {'text': '💬 WhatsApp', 'url': f'https://wa.me/{phone.replace("+", "").replace(" ", "").replace("-", "")}'}
                ],
                [
                    {'text': '✔️ Завершить', 'callback_data': f'complete_{phone}'},
                    {'text': '❌ Отклонить', 'callback_data': f'reject_{phone}'}
                ]
            ]
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


def handler(event: dict, context) -> dict:
    '''Приём заявок с сайта и автоматическое добавление в CRM'''
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
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

    # Парсим данные заявки
    body = json.loads(event.get('body', '{}'))
    name = body.get('name', '')
    phone = body.get('phone', '')
    email = body.get('email', '')
    city = body.get('city', '')
    service_type = body.get('serviceType', '')
    message = body.get('message', '')
    source = body.get('source', 'website')

    if not name or not phone:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Name and phone are required'}),
            'isBase64Encoded': False
        }

    # Подключаемся к БД
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    try:
        # Проверяем, существует ли клиент с таким email или телефоном
        cursor.execute(
            "SELECT id FROM clients WHERE email = %s OR phone = %s LIMIT 1",
            (email, phone)
        )
        existing_client = cursor.fetchone()

        if existing_client:
            client_id = existing_client['id']
            # Обновляем информацию о клиенте
            cursor.execute(
                """UPDATE clients 
                   SET name = %s, phone = %s, email = %s, 
                       source = %s, updated_at = CURRENT_TIMESTAMP 
                   WHERE id = %s""",
                (name, phone, email, source, client_id)
            )
        else:
            # Создаём нового клиента
            cursor.execute(
                """INSERT INTO clients (name, phone, email, source) 
                   VALUES (%s, %s, %s, %s) RETURNING id""",
                (name, phone, email, source)
            )
            client_id = cursor.fetchone()['id']

        # Создаём заявку
        cursor.execute(
            """INSERT INTO requests 
               (client_id, city, service_type, message, status) 
               VALUES (%s, %s, %s, %s, 'new') RETURNING id""",
            (client_id, city, service_type, message)
        )
        request_id = cursor.fetchone()['id']

        conn.commit()

        # Отправляем уведомление в Telegram
        send_telegram_notification(name, phone, email, city, message, source)

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
                'message': 'Request submitted successfully'
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