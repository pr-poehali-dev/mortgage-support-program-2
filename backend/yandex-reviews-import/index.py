import json
import os
import psycopg2
from datetime import datetime
import re

def get_db_connection():
    '''Получение подключения к базе данных'''
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event: dict, context) -> dict:
    '''Импорт отзывов с Яндекс.Карт в базу данных'''
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token'
            },
            'body': ''
        }
    
    admin_token = event.get('headers', {}).get('X-Admin-Token', '')
    
    if admin_token != os.environ.get('ADMIN_TOKEN', 'default_secret'):
        return {
            'statusCode': 403,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Unauthorized'})
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    try:
        body = json.loads(event.get('body', '{}'))
        reviews_data = body.get('reviews', [])
        
        if not reviews_data:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'No reviews data provided'})
            }
        
        conn = get_db_connection()
        imported_count = 0
        skipped_count = 0
        
        try:
            with conn.cursor() as cur:
                for review in reviews_data:
                    author_name = review.get('author_name', 'Аноним')
                    rating = review.get('rating', 5)
                    review_text = review.get('review_text', '')
                    review_date_str = review.get('review_date')
                    
                    if not review_text:
                        skipped_count += 1
                        continue
                    
                    try:
                        if review_date_str:
                            review_date = datetime.fromisoformat(review_date_str.replace('Z', '+00:00'))
                        else:
                            review_date = datetime.now()
                    except:
                        review_date = datetime.now()
                    
                    cur.execute('''
                        SELECT id FROM reviews 
                        WHERE author_name = %s AND review_text = %s AND source = 'yandex'
                    ''', (author_name, review_text))
                    
                    if cur.fetchone():
                        skipped_count += 1
                        continue
                    
                    cur.execute('''
                        INSERT INTO reviews (author_name, rating, review_text, review_date, source, is_approved)
                        VALUES (%s, %s, %s, %s, %s, %s)
                    ''', (author_name, rating, review_text, review_date, 'yandex', True))
                    
                    imported_count += 1
                
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'message': f'Импортировано: {imported_count}, пропущено дубликатов: {skipped_count}',
                        'imported': imported_count,
                        'skipped': skipped_count
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
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }
