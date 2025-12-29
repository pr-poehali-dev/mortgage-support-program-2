import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

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
