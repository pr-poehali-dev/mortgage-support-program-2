"""
Backend функция для сохранения данных регистрации в CRM
Принимает данные из 4-шаговой формы регистрации и создаёт полный профиль клиента
"""
import json
import os
import psycopg2
import urllib.request
from psycopg2.extras import RealDictCursor
from typing import Dict, Any


def send_telegram_notification(client_data: dict):
    """Отправляет уведомление о новой регистрации в Telegram"""
    bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
    chat_id = os.environ.get('TELEGRAM_CHAT_ID')
    
    if not bot_token or not chat_id:
        return
    
    try:
        text = f"📋 *Новая регистрация клиента*\n\n"
        text += f"👤 *ФИО:* {client_data.get('full_name', 'Не указано')}\n"
        text += f"📱 *Телефон:* {client_data.get('phone', 'Не указан')}\n"
        text += f"✉️ *Email:* {client_data.get('email', 'Не указан')}\n"
        text += f"📅 *Дата рождения:* {client_data.get('birth_date', 'Не указана')}\n\n"
        
        text += f"💼 *Занятость:* {client_data.get('employment_type', 'Не указано')}\n"
        text += f"💰 *Доход:* {client_data.get('monthly_income', 'Не указан')} руб/мес\n\n"
        
        text += f"🏠 *Тип недвижимости:* {client_data.get('property_type', 'Не указано')}\n"
        text += f"💵 *Стоимость:* {client_data.get('property_cost', 'Не указана')} руб\n"
        text += f"📍 *Адрес:* {client_data.get('property_address', 'Не указан')}\n"
        
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
    
    # Обязательные поля
    full_name = body.get('fullName', '')
    phone = body.get('phone', '')
    email = body.get('email', '')
    
    if not full_name or not phone:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Full name and phone are required'}),
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        # Проверяем существующего клиента
        cursor.execute(
            "SELECT id FROM t_p26758318_mortgage_support_pro.clients WHERE phone = %s OR email = %s LIMIT 1",
            (phone, email)
        )
        existing_client = cursor.fetchone()
        
        if existing_client:
            client_id = existing_client['id']
            # Обновляем полную информацию
            cursor.execute("""
                UPDATE t_p26758318_mortgage_support_pro.clients 
                SET 
                    full_name = %s,
                    name = %s,
                    phone = %s,
                    email = %s,
                    birth_date = %s,
                    birth_place = %s,
                    passport_series = %s,
                    passport_number = %s,
                    passport_issue_date = %s,
                    passport_issuer = %s,
                    registration_address = %s,
                    inn = %s,
                    snils = %s,
                    marital_status = %s,
                    children_count = %s,
                    employment_type = %s,
                    employer = %s,
                    position = %s,
                    work_experience = %s,
                    monthly_income = %s,
                    registration_completed = TRUE,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = %s
            """, (
                full_name, full_name, phone, email,
                body.get('birthDate'), body.get('birthPlace'),
                body.get('passportSeries'), body.get('passportNumber'),
                body.get('passportIssueDate'), body.get('passportIssuer'),
                body.get('registrationAddress'),
                body.get('inn'), body.get('snils'),
                body.get('maritalStatus'), body.get('childrenCount', 0),
                body.get('employmentType'), body.get('employer'),
                body.get('position'), body.get('workExperience'),
                body.get('monthlyIncome'),
                client_id
            ))
        else:
            # Создаём нового клиента
            cursor.execute("""
                INSERT INTO t_p26758318_mortgage_support_pro.clients (
                    full_name, name, phone, email, birth_date, birth_place,
                    passport_series, passport_number, passport_issue_date, passport_issuer,
                    registration_address, inn, snils, marital_status, children_count,
                    employment_type, employer, position, work_experience, monthly_income,
                    registration_completed, source
                ) VALUES (
                    %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, TRUE, 'registration'
                ) RETURNING id
            """, (
                full_name, full_name, phone, email,
                body.get('birthDate'), body.get('birthPlace'),
                body.get('passportSeries'), body.get('passportNumber'),
                body.get('passportIssueDate'), body.get('passportIssuer'),
                body.get('registrationAddress'),
                body.get('inn'), body.get('snils'),
                body.get('maritalStatus'), body.get('childrenCount', 0),
                body.get('employmentType'), body.get('employer'),
                body.get('position'), body.get('workExperience'),
                body.get('monthlyIncome')
            ))
            client_id = cursor.fetchone()['id']
        
        # Создаём заявку с информацией о недвижимости
        cursor.execute("""
            INSERT INTO t_p26758318_mortgage_support_pro.requests (
                client_id, property_type, property_address, property_cost,
                initial_payment, credit_term, additional_info, status, message
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, 'new', 'Регистрация через форму на сайте')
            RETURNING id
        """, (
            client_id,
            body.get('propertyType'),
            body.get('propertyAddress'),
            body.get('propertyCost'),
            body.get('initialPayment'),
            body.get('creditTerm'),
            body.get('additionalInfo')
        ))
        request_id = cursor.fetchone()['id']
        
        conn.commit()
        
        # Отправляем уведомление в Telegram
        send_telegram_notification({
            'full_name': full_name,
            'phone': phone,
            'email': email,
            'birth_date': body.get('birthDate'),
            'employment_type': body.get('employmentType'),
            'monthly_income': body.get('monthlyIncome'),
            'property_type': body.get('propertyType'),
            'property_cost': body.get('propertyCost'),
            'property_address': body.get('propertyAddress')
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
                'message': 'Registration completed successfully'
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
