import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: dict, context) -> dict:
    '''API для работы с CRM: получение списка клиентов и заявок, обновление статусов'''
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token'
            },
            'body': '',
            'isBase64Encoded': False
        }

    # Подключаемся к БД
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    try:
        if method == 'GET':
            params = event.get('queryStringParameters', {}) or {}
            action = params.get('action', 'requests')

            if action == 'requests':
                # Получаем список заявок с информацией о клиентах
                cursor.execute("""
                    SELECT 
                        r.id, r.city, r.service_type, r.message, 
                        r.status, r.priority, r.created_at, r.updated_at,
                        r.property_type, r.property_address, r.property_cost, 
                        r.initial_payment, r.credit_term, r.additional_info,
                        c.id as client_id, c.name, c.full_name, c.phone, c.email, c.source,
                        c.birth_date, c.monthly_income, c.employment_type, c.registration_completed
                    FROM t_p26758318_mortgage_support_pro.requests r
                    LEFT JOIN t_p26758318_mortgage_support_pro.clients c ON r.client_id = c.id
                    ORDER BY r.created_at DESC
                """)
                requests = cursor.fetchall()
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps([dict(row) for row in requests], default=str),
                    'isBase64Encoded': False
                }

            elif action == 'clients':
                # Получаем список всех клиентов
                cursor.execute("""
                    SELECT c.*, COUNT(r.id) as requests_count
                    FROM t_p26758318_mortgage_support_pro.clients c
                    LEFT JOIN t_p26758318_mortgage_support_pro.requests r ON c.id = r.client_id
                    GROUP BY c.id
                    ORDER BY c.created_at DESC
                """)
                clients = cursor.fetchall()
            
            elif action == 'quiz_stats':
                # Статистика по опросам
                cursor.execute("""
                    SELECT 
                        category,
                        region,
                        loan_amount_range,
                        recommended_program,
                        COUNT(*) as count,
                        MAX(created_at) as last_taken
                    FROM t_p26758318_mortgage_support_pro.quiz_results
                    GROUP BY category, region, loan_amount_range, recommended_program
                    ORDER BY count DESC
                """)
                quiz_stats = cursor.fetchall()
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps([dict(row) for row in quiz_stats], default=str),
                    'isBase64Encoded': False
                }
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps([dict(row) for row in clients], default=str),
                    'isBase64Encoded': False
                }

        elif method == 'DELETE':
            params = event.get('queryStringParameters', {}) or {}
            request_id = params.get('request_id')
            
            if not request_id:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'request_id is required'}),
                    'isBase64Encoded': False
                }
            
            cursor.execute(
                "DELETE FROM t_p26758318_mortgage_support_pro.requests WHERE id = %s",
                (request_id,)
            )
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'success': True, 'message': 'Request deleted'}),
                'isBase64Encoded': False
            }

        elif method == 'PUT':
            # Обновление статуса заявки
            body = json.loads(event.get('body', '{}'))
            request_id = body.get('request_id')
            status = body.get('status')
            priority = body.get('priority')
            notes = body.get('notes')

            if not request_id:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'request_id is required'}),
                    'isBase64Encoded': False
                }

            updates = []
            values = []
            
            if status:
                updates.append("status = %s")
                values.append(status)
            if priority:
                updates.append("priority = %s")
                values.append(priority)
            
            updates.append("updated_at = CURRENT_TIMESTAMP")
            values.append(request_id)

            cursor.execute(
                f"UPDATE t_p26758318_mortgage_support_pro.requests SET {', '.join(updates)} WHERE id = %s",
                values
            )

            if notes:
                cursor.execute(
                    "UPDATE t_p26758318_mortgage_support_pro.clients SET notes = %s WHERE id = (SELECT client_id FROM t_p26758318_mortgage_support_pro.requests WHERE id = %s)",
                    (notes, request_id)
                )

            conn.commit()

            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'success': True}),
                'isBase64Encoded': False
            }

        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
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