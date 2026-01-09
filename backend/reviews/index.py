import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime

def get_db_connection():
    '''Получение подключения к базе данных'''
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event: dict, context) -> dict:
    '''API для управления отзывами: получение, добавление, модерация'''
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token'
            },
            'body': ''
        }
    
    try:
        if method == 'GET':
            return get_reviews(event)
        elif method == 'POST':
            return create_review(event)
        elif method == 'PUT':
            return update_review(event)
        elif method == 'DELETE':
            return delete_review(event)
        else:
            return {
                'statusCode': 405,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Method not allowed'})
            }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }

def get_reviews(event: dict) -> dict:
    '''Получение списка отзывов (публичные - только одобренные, admin - все)'''
    query_params = event.get('queryStringParameters') or {}
    is_admin = query_params.get('admin') == 'true'
    admin_token = event.get('headers', {}).get('X-Admin-Token', '')
    
    conn = get_db_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            if is_admin and admin_token == os.environ.get('ADMIN_TOKEN', 'default_secret'):
                cur.execute('''
                    SELECT id, author_name, rating, review_text, review_date, 
                           source, is_approved, created_at
                    FROM reviews 
                    ORDER BY created_at DESC
                ''')
            else:
                cur.execute('''
                    SELECT id, author_name, rating, review_text, review_date, source
                    FROM reviews 
                    WHERE is_approved = true
                    ORDER BY review_date DESC
                ''')
            
            reviews = cur.fetchall()
            
            for review in reviews:
                if isinstance(review['review_date'], datetime):
                    review['review_date'] = review['review_date'].isoformat()
                if 'created_at' in review and isinstance(review['created_at'], datetime):
                    review['created_at'] = review['created_at'].isoformat()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'reviews': reviews})
            }
    finally:
        conn.close()

def create_review(event: dict) -> dict:
    '''Создание нового отзыва'''
    try:
        body = json.loads(event.get('body', '{}'))
        author_name = body.get('author_name', '').strip()
        rating = body.get('rating')
        review_text = body.get('review_text', '').strip()
        
        if not author_name or not rating or not review_text:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Заполните все поля'})
            }
        
        if rating < 1 or rating > 5:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Оценка должна быть от 1 до 5'})
            }
        
        conn = get_db_connection()
        try:
            with conn.cursor() as cur:
                cur.execute('''
                    INSERT INTO reviews (author_name, rating, review_text, review_date, source, is_approved)
                    VALUES (%s, %s, %s, %s, %s, %s)
                    RETURNING id
                ''', (author_name, rating, review_text, datetime.now(), 'website', False))
                
                review_id = cur.fetchone()[0]
                conn.commit()
                
                return {
                    'statusCode': 201,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'message': 'Спасибо за отзыв! Он появится после модерации.',
                        'id': review_id
                    })
                }
        finally:
            conn.close()
    except json.JSONDecodeError:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Invalid JSON'})
        }

def update_review(event: dict) -> dict:
    '''Обновление отзыва (модерация и редактирование) - только для админа'''
    admin_token = event.get('headers', {}).get('X-Admin-Token', '')
    
    if admin_token != os.environ.get('ADMIN_TOKEN', 'default_secret'):
        return {
            'statusCode': 403,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Unauthorized'})
        }
    
    try:
        body = json.loads(event.get('body', '{}'))
        review_id = body.get('id')
        
        if not review_id:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Review ID required'})
            }
        
        conn = get_db_connection()
        try:
            with conn.cursor() as cur:
                update_fields = []
                params = []
                
                if 'author_name' in body:
                    update_fields.append('author_name = %s')
                    params.append(body['author_name'])
                
                if 'rating' in body:
                    update_fields.append('rating = %s')
                    params.append(body['rating'])
                
                if 'review_text' in body:
                    update_fields.append('review_text = %s')
                    params.append(body['review_text'])
                
                if 'is_approved' in body:
                    update_fields.append('is_approved = %s')
                    params.append(body['is_approved'])
                
                update_fields.append('updated_at = %s')
                params.append(datetime.now())
                
                params.append(review_id)
                
                cur.execute(f'''
                    UPDATE reviews 
                    SET {', '.join(update_fields)}
                    WHERE id = %s
                ''', params)
                
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'message': 'Review updated successfully'})
                }
        finally:
            conn.close()
    except json.JSONDecodeError:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Invalid JSON'})
        }

def delete_review(event: dict) -> dict:
    '''Удаление отзыва - только для админа'''
    admin_token = event.get('headers', {}).get('X-Admin-Token', '')
    
    if admin_token != os.environ.get('ADMIN_TOKEN', 'default_secret'):
        return {
            'statusCode': 403,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Unauthorized'})
        }
    
    try:
        body = json.loads(event.get('body', '{}'))
        review_id = body.get('id')
        
        if not review_id:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Review ID required'})
            }
        
        conn = get_db_connection()
        try:
            with conn.cursor() as cur:
                cur.execute('DELETE FROM reviews WHERE id = %s', (review_id,))
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'message': 'Review deleted successfully'})
                }
        finally:
            conn.close()
    except json.JSONDecodeError:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Invalid JSON'})
        }
