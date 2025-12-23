import json
import os
import psycopg2
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Отправка email-рассылки подписчикам о новых статьях
    Args: event - dict с httpMethod, body (article_id, article_title, article_url)
          context - object с request_id
    Returns: HTTP response dict
    '''
    method: str = event.get('httpMethod', 'POST')
    
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
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    try:
        body_data = json.loads(event.get('body', '{}'))
        article_id = body_data.get('article_id')
        article_title = body_data.get('article_title', '')
        article_excerpt = body_data.get('article_excerpt', '')
        
        if not article_id or not article_title:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'article_id и article_title обязательны'}),
                'isBase64Encoded': False
            }
        
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor()
        
        cur.execute(
            "SELECT email, name FROM newsletter_subscribers WHERE is_active = TRUE"
        )
        subscribers = cur.fetchall()
        
        if not subscribers:
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'success': True,
                    'sent_count': 0,
                    'message': 'Нет активных подписчиков'
                }),
                'isBase64Encoded': False
            }
        
        smtp_host = os.environ.get('SMTP_HOST')
        smtp_port = int(os.environ.get('SMTP_PORT', 587))
        smtp_user = os.environ.get('SMTP_USER')
        smtp_password = os.environ.get('SMTP_PASSWORD')
        
        if not all([smtp_host, smtp_user, smtp_password]):
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'SMTP настройки не заданы'}),
                'isBase64Encoded': False
            }
        
        site_url = 'https://ипотекакрым.рф'
        
        sent_count = 0
        failed_count = 0
        
        server = smtplib.SMTP(smtp_host, smtp_port)
        server.starttls()
        server.login(smtp_user, smtp_password)
        
        for subscriber_email, subscriber_name in subscribers:
            try:
                msg = MIMEMultipart('alternative')
                msg['Subject'] = f'Новая статья: {article_title}'
                msg['From'] = smtp_user
                msg['To'] = subscriber_email
                
                html_body = f"""
                <html>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                        <h2 style="color: #9333ea;">Новая статья в блоге Ипотека РФ</h2>
                        <h3 style="color: #1f2937;">{article_title}</h3>
                        <p style="color: #6b7280;">{article_excerpt}</p>
                        <a href="{site_url}" 
                           style="display: inline-block; background: linear-gradient(to right, #9333ea, #c026d3); 
                                  color: white; padding: 12px 24px; text-decoration: none; 
                                  border-radius: 8px; margin: 20px 0;">
                            Читать статью
                        </a>
                        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                        <p style="color: #9ca3af; font-size: 12px;">
                            Вы получили это письмо, потому что подписались на новости блога на сайте {site_url}
                        </p>
                    </div>
                </body>
                </html>
                """
                
                part = MIMEText(html_body, 'html')
                msg.attach(part)
                
                server.send_message(msg)
                sent_count += 1
                
            except Exception as e:
                failed_count += 1
                print(f"Failed to send to {subscriber_email}: {str(e)}")
        
        server.quit()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'success': True,
                'sent_count': sent_count,
                'failed_count': failed_count,
                'message': f'Рассылка отправлена {sent_count} подписчикам'
            }),
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
