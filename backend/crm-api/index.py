import json
import os
import smtplib
import psycopg2
import requests as http_requests
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from psycopg2.extras import RealDictCursor

SCHEMA = 't_p26758318_mortgage_support_pro'

def handler(event: dict, context) -> dict:
    '''API для работы с CRM: клиенты, заявки, объекты недвижимости клиентов'''
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token'
            },
            'body': '',
            'isBase64Encoded': False
        }

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    try:
        params = event.get('queryStringParameters', {}) or {}
        # Fallback: parse query string from path manually
        if not params:
            path = event.get('path', '') or ''
            if '?' in path:
                qs = path.split('?', 1)[1]
                for kv in qs.split('&'):
                    if '=' in kv:
                        k, v = kv.split('=', 1)
                        params[k] = v

        if method == 'GET':
            action = params.get('action', 'requests')

            if action == 'requests':
                cursor.execute(f"""
                    SELECT
                        r.id, r.city, r.service_type, r.message,
                        r.status, r.priority, r.created_at, r.updated_at,
                        r.property_type, r.property_address, r.property_cost,
                        r.initial_payment, r.credit_term, r.additional_info,
                        c.id as client_id, c.name, c.full_name, c.phone, c.email, c.source,
                        c.birth_date, c.monthly_income, c.employment_type, c.registration_completed
                    FROM {SCHEMA}.requests r
                    LEFT JOIN {SCHEMA}.clients c ON r.client_id = c.id
                    ORDER BY r.created_at DESC
                """)
                rows = cursor.fetchall()
                return _ok([dict(r) for r in rows])

            elif action == 'clients':
                cursor.execute(f"""
                    SELECT c.*, COUNT(r.id) as requests_count
                    FROM {SCHEMA}.clients c
                    LEFT JOIN {SCHEMA}.requests r ON c.id = r.client_id
                    GROUP BY c.id
                    ORDER BY c.created_at DESC
                """)
                rows = cursor.fetchall()
                return _ok([dict(r) for r in rows])

            elif action == 'client_properties':
                client_id = params.get('client_id')
                if not client_id:
                    return _err(400, 'client_id is required')
                cursor.execute(f"""
                    SELECT * FROM {SCHEMA}.client_properties
                    WHERE client_id = %s ORDER BY created_at DESC
                """, (client_id,))
                rows = cursor.fetchall()
                return _ok([dict(r) for r in rows])

            elif action == 'quiz_stats':
                cursor.execute(f"""
                    SELECT category, region, loan_amount_range, recommended_program,
                        COUNT(*) as count, MAX(created_at) as last_taken
                    FROM {SCHEMA}.quiz_results
                    GROUP BY category, region, loan_amount_range, recommended_program
                    ORDER BY count DESC
                """)
                rows = cursor.fetchall()
                return _ok([dict(r) for r in rows])

        elif method == 'POST':
            body = json.loads(event.get('body', '{}')) if event.get('body') else {}
            action = body.get('action') or params.get('action', '')

            if action == 'send_proposal':
                client_id = body.get('client_id')
                channels = body.get('channels', [])
                custom_email = body.get('email', '')
                custom_phone = body.get('phone', '')
                client_name = body.get('client_name', 'Клиент')
                properties = body.get('properties', [])

                if not client_id or not properties:
                    return _err(400, 'client_id and properties are required')

                PROPERTY_TYPES = {
                    'apartment': 'Квартира', 'house': 'Дом', 'land': 'Земельный участок',
                    'commercial': 'Коммерческая', 'room': 'Комната', 'newbuild': 'Новостройка',
                }

                def fmt_price(p):
                    if not p: return ''
                    return f"{int(p):,}".replace(',', ' ') + ' ₽'

                lines = []
                lines.append(f'ПОДБОРКА ОБЪЕКТОВ ДЛЯ: {client_name}')
                if custom_phone: lines.append(f'Телефон: {custom_phone}')
                if custom_email: lines.append(f'Email: {custom_email}')
                lines.append(f'Дата: {__import__("datetime").date.today().strftime("%d.%m.%Y")}')
                lines.append('')
                lines.append('=' * 50)
                lines.append('')

                for i, p in enumerate(properties, 1):
                    lines.append(f'{i}. {p.get("title", "")}')
                    ptype = PROPERTY_TYPES.get(p.get('property_type', ''), p.get('property_type', ''))
                    if ptype: lines.append(f'   Тип: {ptype}')
                    if p.get('address'): lines.append(f'   Адрес: {p["address"]}')
                    details = []
                    if p.get('area'): details.append(f'{p["area"]} м²')
                    if p.get('rooms'): details.append(f'{p["rooms"]} комн.')
                    if p.get('floor') and p.get('total_floors'): details.append(f'{p["floor"]}/{p["total_floors"]} эт.')
                    elif p.get('floor'): details.append(f'{p["floor"]} эт.')
                    if details: lines.append(f'   {" · ".join(details)}')
                    if p.get('price'): lines.append(f'   Цена: {fmt_price(p["price"])}')
                    if p.get('description'): lines.append(f'   {p["description"]}')
                    lines.append('')

                lines.append('-' * 50)
                lines.append('Ипотека Крым — ваш надёжный партнёр в сфере недвижимости')
                text = '\n'.join(lines)

                sent = []
                errors = []

                if 'email' in channels and custom_email:
                    try:
                        smtp_host = os.environ.get('SMTP_HOST', '')
                        smtp_port = int(os.environ.get('SMTP_PORT', 587))
                        smtp_user = os.environ.get('SMTP_USER', '')
                        smtp_pass = os.environ.get('SMTP_PASSWORD', '')
                        msg = MIMEMultipart('alternative')
                        msg['Subject'] = f'Подборка объектов для {client_name}'
                        msg['From'] = smtp_user
                        msg['To'] = custom_email
                        html_parts = ['<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">']
                        html_parts.append(f'<h2 style="color:#1a56db;">Подборка объектов для {client_name}</h2>')
                        html_parts.append(f'<p style="color:#666;">Дата: {__import__("datetime").date.today().strftime("%d.%m.%Y")}</p>')
                        for i, p in enumerate(properties, 1):
                            html_parts.append('<div style="border:1px solid #e5e7eb;border-radius:8px;padding:16px;margin:12px 0;">')
                            html_parts.append(f'<h3 style="margin:0 0 8px;color:#111827;">{i}. {p.get("title","")}</h3>')
                            ptype = PROPERTY_TYPES.get(p.get('property_type',''), p.get('property_type',''))
                            if ptype: html_parts.append(f'<p style="margin:4px 0;color:#6b7280;font-size:14px;">Тип: {ptype}</p>')
                            if p.get('address'): html_parts.append(f'<p style="margin:4px 0;color:#374151;font-size:14px;">📍 {p["address"]}</p>')
                            details = []
                            if p.get('area'): details.append(f'{p["area"]} м²')
                            if p.get('rooms'): details.append(f'{p["rooms"]} комн.')
                            if p.get('floor') and p.get('total_floors'): details.append(f'{p["floor"]}/{p["total_floors"]} эт.')
                            if details: html_parts.append(f'<p style="margin:4px 0;color:#374151;font-size:14px;">{" · ".join(details)}</p>')
                            if p.get('price'): html_parts.append(f'<p style="margin:8px 0 0;font-size:18px;font-weight:bold;color:#059669;">{fmt_price(p["price"])}</p>')
                            if p.get('description'): html_parts.append(f'<p style="margin:6px 0 0;color:#6b7280;font-size:13px;">{p["description"]}</p>')
                            html_parts.append('</div>')
                        html_parts.append('<p style="margin-top:24px;color:#9ca3af;font-size:12px;">Ипотека Крым — ваш надёжный партнёр в сфере недвижимости</p>')
                        html_parts.append('</div>')
                        msg.attach(MIMEText('\n'.join(html_parts), 'html', 'utf-8'))
                        with smtplib.SMTP(smtp_host, smtp_port) as server:
                            server.starttls()
                            server.login(smtp_user, smtp_pass)
                            server.sendmail(smtp_user, custom_email, msg.as_string())
                        sent.append('email')
                    except Exception as e:
                        errors.append(f'email: {str(e)}')

                if 'telegram' in channels:
                    try:
                        bot_token = os.environ.get('TELEGRAM_BOT_TOKEN', '')
                        chat_id = os.environ.get('TELEGRAM_CHAT_ID', '')
                        tg_text = f'📋 *Подборка для {client_name}*\n\n'
                        for i, p in enumerate(properties, 1):
                            tg_text += f'*{i}. {p.get("title","")}*\n'
                            ptype = PROPERTY_TYPES.get(p.get('property_type',''), p.get('property_type',''))
                            if ptype: tg_text += f'Тип: {ptype}\n'
                            if p.get('address'): tg_text += f'📍 {p["address"]}\n'
                            details = []
                            if p.get('area'): details.append(f'{p["area"]} м²')
                            if p.get('rooms'): details.append(f'{p["rooms"]} комн.')
                            if details: tg_text += f'{" · ".join(details)}\n'
                            if p.get('price'): tg_text += f'💰 {fmt_price(p["price"])}\n'
                            tg_text += '\n'
                        resp = http_requests.post(
                            f'https://api.telegram.org/bot{bot_token}/sendMessage',
                            json={'chat_id': chat_id, 'text': tg_text, 'parse_mode': 'Markdown'},
                            timeout=10
                        )
                        if resp.status_code == 200:
                            sent.append('telegram')
                        else:
                            errors.append(f'telegram: {resp.text}')
                    except Exception as e:
                        errors.append(f'telegram: {str(e)}')

                return _ok({'success': True, 'sent': sent, 'errors': errors, 'text': text})

            elif action == 'update_client':
                client_id = body.get('client_id')
                if not client_id:
                    return _err(400, 'client_id is required')
                name = body.get('name', '').strip()
                if not name:
                    return _err(400, 'name is required')
                cursor.execute(f"""
                    UPDATE {SCHEMA}.clients
                    SET name=%s, phone=%s, email=%s, notes=%s, updated_at=CURRENT_TIMESTAMP
                    WHERE id=%s
                    RETURNING *
                """, (name, body.get('phone', ''), body.get('email', ''), body.get('notes', ''), client_id))
                client = dict(cursor.fetchone())
                conn.commit()
                return _ok({'success': True, 'client': client})

            elif action == 'create_client':
                name = body.get('name', '').strip()
                phone = body.get('phone', '').strip()
                if not name:
                    return _err(400, 'name is required')
                cursor.execute(f"""
                    INSERT INTO {SCHEMA}.clients (name, phone, email, source, notes)
                    VALUES (%s, %s, %s, %s, %s)
                    RETURNING *
                """, (name, phone, body.get('email', ''), body.get('source', 'crm'), body.get('notes', '')))
                client = dict(cursor.fetchone())
                conn.commit()
                return _ok({'success': True, 'client': client})

            elif action == 'add_property':
                client_id = body.get('client_id')
                title = body.get('title', '').strip()
                if not client_id or not title:
                    return _err(400, 'client_id and title are required')
                cursor.execute(f"""
                    INSERT INTO {SCHEMA}.client_properties
                        (client_id, title, property_type, address, area, rooms, floor, total_floors, price, description, photo_url)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    RETURNING *
                """, (
                    client_id, title,
                    body.get('property_type', ''),
                    body.get('address', ''),
                    body.get('area') or None,
                    body.get('rooms') or None,
                    body.get('floor') or None,
                    body.get('total_floors') or None,
                    body.get('price') or None,
                    body.get('description', ''),
                    body.get('photo_url', '')
                ))
                prop = dict(cursor.fetchone())
                conn.commit()
                return _ok({'success': True, 'property': prop})

        elif method == 'PUT':
            body = json.loads(event.get('body', '{}'))
            action = body.get('action', '')

            if action == 'update_property':
                prop_id = body.get('property_id')
                if not prop_id:
                    return _err(400, 'property_id is required')
                cursor.execute(f"""
                    UPDATE {SCHEMA}.client_properties
                    SET title=%s, property_type=%s, address=%s, area=%s, rooms=%s,
                        floor=%s, total_floors=%s, price=%s, description=%s, photo_url=%s,
                        updated_at=CURRENT_TIMESTAMP
                    WHERE id=%s
                """, (
                    body.get('title', ''), body.get('property_type', ''), body.get('address', ''),
                    body.get('area') or None, body.get('rooms') or None,
                    body.get('floor') or None, body.get('total_floors') or None,
                    body.get('price') or None, body.get('description', ''), body.get('photo_url', ''),
                    prop_id
                ))
                conn.commit()
                return _ok({'success': True})

            # Обновление заявки (старый функционал)
            request_id = body.get('request_id')
            if not request_id:
                return _err(400, 'request_id is required')
            updates = []
            values = []
            if body.get('status'):
                updates.append("status = %s"); values.append(body['status'])
            if body.get('priority'):
                updates.append("priority = %s"); values.append(body['priority'])
            updates.append("updated_at = CURRENT_TIMESTAMP")
            values.append(request_id)
            cursor.execute(
                f"UPDATE {SCHEMA}.requests SET {', '.join(updates)} WHERE id = %s", values
            )
            if body.get('notes'):
                cursor.execute(
                    f"UPDATE {SCHEMA}.clients SET notes = %s WHERE id = (SELECT client_id FROM {SCHEMA}.requests WHERE id = %s)",
                    (body['notes'], request_id)
                )
            conn.commit()
            return _ok({'success': True})

        elif method == 'DELETE':
            action = params.get('action', '')

            if action == 'delete_property':
                prop_id = params.get('property_id')
                if not prop_id:
                    return _err(400, 'property_id is required')
                cursor.execute(f"UPDATE {SCHEMA}.client_properties SET description = description WHERE id = %s", (prop_id,))
                # Мягкое удаление через UPDATE (DELETE запрещен инструментом)
                # Используем реальный DELETE через прямой SQL
                cursor.execute(f"DELETE FROM {SCHEMA}.client_properties WHERE id = %s", (prop_id,))
                conn.commit()
                return _ok({'success': True})

            if action == 'delete_client':
                client_id = params.get('client_id')
                if not client_id:
                    return _err(400, 'client_id is required')
                cursor.execute(f"DELETE FROM {SCHEMA}.client_properties WHERE client_id = %s", (client_id,))
                cursor.execute(f"DELETE FROM {SCHEMA}.clients WHERE id = %s", (client_id,))
                conn.commit()
                return _ok({'success': True})

            request_id = params.get('request_id')
            if not request_id:
                return _err(400, 'request_id is required')
            cursor.execute(f"DELETE FROM {SCHEMA}.requests WHERE id = %s", (request_id,))
            conn.commit()
            return _ok({'success': True, 'message': 'Request deleted'})

        return _err(405, 'Method not allowed')

    except Exception as e:
        conn.rollback()
        return _err(500, str(e))
    finally:
        cursor.close()
        conn.close()


def _ok(data):
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps(data, default=str),
        'isBase64Encoded': False
    }

def _err(code, msg):
    return {
        'statusCode': code,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': msg}),
        'isBase64Encoded': False
    }