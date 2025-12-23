import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Управление комментариями к статьям блога
    Args: event - dict с httpMethod, body, queryStringParameters
          context - object с request_id
    Returns: HTTP response dict
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    try:
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor()
        
        if method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            article_id = body_data.get('article_id')
            author_name = body_data.get('author_name', '').strip()
            comment_text = body_data.get('comment_text', '').strip()
            
            if not article_id or not author_name or not comment_text:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Все поля обязательны'}),
                    'isBase64Encoded': False
                }
            
            cur.execute(
                """INSERT INTO article_comments 
                   (article_id, author_name, comment_text, created_at) 
                   VALUES (%s, %s, %s, NOW()) 
                   RETURNING id, created_at""",
                (article_id, author_name, comment_text)
            )
            comment_id, created_at = cur.fetchone()
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'success': True,
                    'comment_id': comment_id,
                    'created_at': created_at.isoformat(),
                    'message': 'Комментарий добавлен'
                }),
                'isBase64Encoded': False
            }
        
        if method == 'GET':
            params = event.get('queryStringParameters', {}) or {}
            article_id = params.get('article_id')
            
            if not article_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'article_id обязателен'}),
                    'isBase64Encoded': False
                }
            
            cur.execute(
                """SELECT id, author_name, comment_text, created_at 
                   FROM article_comments 
                   WHERE article_id = %s AND is_approved = TRUE 
                   ORDER BY created_at DESC""",
                (article_id,)
            )
            
            comments = []
            for row in cur.fetchall():
                comments.append({
                    'id': row[0],
                    'author_name': row[1],
                    'comment_text': row[2],
                    'created_at': row[3].isoformat()
                })
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'comments': comments}),
                'isBase64Encoded': False
            }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
    finally:
        if 'cur' in locals():
            cur.close()
        if 'conn' in locals():
            conn.close()
