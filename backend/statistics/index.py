"""
Backend функция для сбора статистики посещений и заявок
Хранит счетчики в базе данных PostgreSQL
"""
import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    # Handle CORS OPTIONS
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
    
    # Connect to database
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({'error': 'Database not configured'}),
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(dsn)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        # Ensure statistics table exists
        cur.execute("""
            CREATE TABLE IF NOT EXISTS statistics (
                id SERIAL PRIMARY KEY,
                metric_name VARCHAR(100) UNIQUE NOT NULL,
                metric_value INTEGER DEFAULT 0,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Initialize counters if not exist
        cur.execute("""
            INSERT INTO statistics (metric_name, metric_value)
            VALUES ('page_views', 0), ('applications_sent', 0)
            ON CONFLICT (metric_name) DO NOTHING
        """)
        conn.commit()
        
        if method == 'GET':
            # Get current statistics
            cur.execute("""
                SELECT metric_name, metric_value 
                FROM statistics 
                WHERE metric_name IN ('page_views', 'applications_sent')
            """)
            rows = cur.fetchall()
            
            stats = {row['metric_name']: row['metric_value'] for row in rows}
            
            return {
                'statusCode': 200,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({
                    'page_views': stats.get('page_views', 0),
                    'applications_sent': stats.get('applications_sent', 0)
                }),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            # Increment counter
            body_data = json.loads(event.get('body', '{}'))
            metric_name = body_data.get('metric')
            
            if metric_name not in ['page_views', 'applications_sent']:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Access-Control-Allow-Origin': '*',
                        'Content-Type': 'application/json'
                    },
                    'body': json.dumps({'error': 'Invalid metric name'}),
                    'isBase64Encoded': False
                }
            
            cur.execute("""
                UPDATE statistics 
                SET metric_value = metric_value + 1,
                    updated_at = CURRENT_TIMESTAMP
                WHERE metric_name = %s
                RETURNING metric_value
            """, (metric_name,))
            
            result = cur.fetchone()
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({
                    'metric': metric_name,
                    'value': result['metric_value']
                }),
                'isBase64Encoded': False
            }
        
        return {
            'statusCode': 405,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    finally:
        cur.close()
        conn.close()
