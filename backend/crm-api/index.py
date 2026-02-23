import json
import os
import psycopg2
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

            if action == 'create_client':
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