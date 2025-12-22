"""
Backend функция для расширенной аналитики админ-панели
Предоставляет детальную статистику по дням, источникам трафика, программам
"""
import json
import os
from typing import Dict, Any
from datetime import datetime, timedelta
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
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Password',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    # Check admin password
    headers = event.get('headers', {})
    admin_password = headers.get('X-Admin-Password') or headers.get('x-admin-password')
    expected_password = os.environ.get('ADMIN_PASSWORD', 'admin123')
    
    if admin_password != expected_password:
        return {
            'statusCode': 401,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({'error': 'Unauthorized'}),
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
        if method == 'GET':
            # Get query parameters
            params = event.get('queryStringParameters') or {}
            days = int(params.get('days', '30'))
            
            # Get daily statistics for last N days
            cur.execute("""
                SELECT 
                    DATE(created_at) as date,
                    COUNT(*) as views
                FROM analytics_events
                WHERE event_type = 'page_view' 
                    AND created_at >= CURRENT_DATE - INTERVAL '%s days'
                GROUP BY DATE(created_at)
                ORDER BY date DESC
            """ % days)
            daily_views = cur.fetchall()
            
            # Get daily applications
            cur.execute("""
                SELECT 
                    DATE(created_at) as date,
                    COUNT(*) as applications
                FROM analytics_events
                WHERE event_type = 'application_sent'
                    AND created_at >= CURRENT_DATE - INTERVAL '%s days'
                GROUP BY DATE(created_at)
                ORDER BY date DESC
            """ % days)
            daily_applications = cur.fetchall()
            
            # Get traffic sources
            cur.execute("""
                SELECT 
                    COALESCE(source, 'Прямой переход') as source,
                    COUNT(*) as count
                FROM analytics_events
                WHERE event_type = 'page_view'
                    AND created_at >= CURRENT_DATE - INTERVAL '%s days'
                GROUP BY source
                ORDER BY count DESC
                LIMIT 10
            """ % days)
            traffic_sources = cur.fetchall()
            
            # Get popular programs
            cur.execute("""
                SELECT 
                    program,
                    COUNT(*) as count
                FROM analytics_events
                WHERE event_type = 'application_sent'
                    AND program IS NOT NULL
                    AND created_at >= CURRENT_DATE - INTERVAL '%s days'
                GROUP BY program
                ORDER BY count DESC
            """ % days)
            popular_programs = cur.fetchall()
            
            # Get total statistics
            cur.execute("""
                SELECT 
                    COUNT(CASE WHEN event_type = 'page_view' THEN 1 END) as total_views,
                    COUNT(CASE WHEN event_type = 'application_sent' THEN 1 END) as total_applications
                FROM analytics_events
                WHERE created_at >= CURRENT_DATE - INTERVAL '%s days'
            """ % days)
            totals = cur.fetchone()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({
                    'daily_views': [dict(row) for row in daily_views],
                    'daily_applications': [dict(row) for row in daily_applications],
                    'traffic_sources': [dict(row) for row in traffic_sources],
                    'popular_programs': [dict(row) for row in popular_programs],
                    'totals': dict(totals),
                    'period_days': days
                }, default=str),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            # Track analytics event
            body_data = json.loads(event.get('body', '{}'))
            event_type = body_data.get('event_type')
            source = body_data.get('source')
            program = body_data.get('program')
            
            if event_type not in ['page_view', 'application_sent']:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Access-Control-Allow-Origin': '*',
                        'Content-Type': 'application/json'
                    },
                    'body': json.dumps({'error': 'Invalid event type'}),
                    'isBase64Encoded': False
                }
            
            cur.execute("""
                INSERT INTO analytics_events (event_type, source, program)
                VALUES (%s, %s, %s)
                RETURNING id
            """, (event_type, source, program))
            
            result = cur.fetchone()
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({'id': result['id']}),
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
