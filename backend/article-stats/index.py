import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Управление статистикой статей: просмотры и репосты
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
        
        if method == 'GET':
            params = event.get('queryStringParameters', {}) or {}
            article_id = params.get('article_id')
            
            if article_id:
                cur.execute(
                    """SELECT article_id, views_count, shares_telegram, shares_whatsapp, 
                              shares_vk, shares_facebook, shares_ok, shares_total 
                       FROM article_stats WHERE article_id = %s""",
                    (article_id,)
                )
                row = cur.fetchone()
                
                if row:
                    stats = {
                        'article_id': row[0],
                        'views_count': row[1],
                        'shares': {
                            'telegram': row[2],
                            'whatsapp': row[3],
                            'vk': row[4],
                            'facebook': row[5],
                            'ok': row[6],
                            'total': row[7]
                        }
                    }
                else:
                    stats = {
                        'article_id': int(article_id),
                        'views_count': 0,
                        'shares': {
                            'telegram': 0,
                            'whatsapp': 0,
                            'vk': 0,
                            'facebook': 0,
                            'ok': 0,
                            'total': 0
                        }
                    }
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps(stats),
                    'isBase64Encoded': False
                }
            else:
                cur.execute(
                    """SELECT article_id, views_count, shares_total 
                       FROM article_stats 
                       ORDER BY article_id"""
                )
                
                all_stats = []
                for row in cur.fetchall():
                    all_stats.append({
                        'article_id': row[0],
                        'views_count': row[1],
                        'shares_total': row[2]
                    })
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'stats': all_stats}),
                    'isBase64Encoded': False
                }
        
        if method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            article_id = body_data.get('article_id')
            action = body_data.get('action')
            platform = body_data.get('platform')
            
            if not article_id or not action:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'article_id и action обязательны'}),
                    'isBase64Encoded': False
                }
            
            if action == 'view':
                cur.execute(
                    """INSERT INTO article_stats (article_id, views_count, updated_at) 
                       VALUES (%s, 1, NOW())
                       ON CONFLICT (article_id) 
                       DO UPDATE SET views_count = article_stats.views_count + 1, 
                                     updated_at = NOW()
                       RETURNING views_count""",
                    (article_id,)
                )
                new_count = cur.fetchone()[0]
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'success': True,
                        'views_count': new_count
                    }),
                    'isBase64Encoded': False
                }
            
            elif action == 'share':
                if not platform:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'platform обязателен для share'}),
                        'isBase64Encoded': False
                    }
                
                platform_column = f'shares_{platform}'
                valid_platforms = ['telegram', 'whatsapp', 'vk', 'facebook', 'ok']
                
                if platform not in valid_platforms:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': f'Неверная платформа: {platform}'}),
                        'isBase64Encoded': False
                    }
                
                cur.execute(
                    f"""INSERT INTO article_stats (article_id, {platform_column}, shares_total, updated_at) 
                        VALUES (%s, 1, 1, NOW())
                        ON CONFLICT (article_id) 
                        DO UPDATE SET {platform_column} = article_stats.{platform_column} + 1,
                                      shares_total = article_stats.shares_total + 1,
                                      updated_at = NOW()
                        RETURNING shares_total""",
                    (article_id,)
                )
                new_total = cur.fetchone()[0]
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'success': True,
                        'shares_total': new_total
                    }),
                    'isBase64Encoded': False
                }
            
            else:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'action должен быть view или share'}),
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
