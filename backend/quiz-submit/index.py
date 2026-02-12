"""
Backend функция для сохранения результатов опроса/квиза в CRM
Сохраняет анонимные данные опроса для аналитики
"""
import json
import os
import psycopg2
import urllib.request
from psycopg2.extras import RealDictCursor
from typing import Dict, Any
import uuid


def send_telegram_notification(category: str, region: str, loan_range: str, program: str):
    """Отправляет уведомление о прохождении опроса в Telegram"""
    bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
    chat_id = os.environ.get('TELEGRAM_CHAT_ID')
    
    if not bot_token or not chat_id:
        return
    
    try:
        text = f"📊 *Пройден опрос по подбору ипотеки*\n\n"
        text += f"👥 *Категория:* {category}\n"
        text += f"📍 *Регион:* {region}\n"
        text += f"💰 *Сумма кредита:* {loan_range}\n"
        text += f"✅ *Рекомендованная программа:* {program}\n"
        
        url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
        payload = {
            'chat_id': chat_id,
            'text': text,
            'parse_mode': 'Markdown'
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
    
    category = body.get('category', '')
    region = body.get('region', '')
    loan_amount_range = body.get('loanAmountRange', '')
    recommended_program = body.get('recommendedProgram', '')
    session_id = body.get('sessionId', str(uuid.uuid4()))
    
    if not category or not region or not loan_amount_range:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Category, region, and loan amount range are required'}),
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        cursor.execute("""
            INSERT INTO t_p26758318_mortgage_support_pro.quiz_results (
                session_id, category, region, loan_amount_range, recommended_program
            ) VALUES (%s, %s, %s, %s, %s)
            RETURNING id
        """, (session_id, category, region, loan_amount_range, recommended_program))
        
        result_id = cursor.fetchone()['id']
        conn.commit()
        
        # Отправляем уведомление в Telegram
        send_telegram_notification(category, region, loan_amount_range, recommended_program)
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': True,
                'result_id': result_id,
                'session_id': session_id,
                'message': 'Quiz result saved successfully'
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