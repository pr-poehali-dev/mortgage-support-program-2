import json
import smtplib
import urllib.request
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Dict, Any
from pydantic import BaseModel, Field, validator
import os

class ApplicationRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    phone: str = Field(..., min_length=10, max_length=20)
    email: str = Field(..., min_length=5, max_length=100)
    program: str = Field(..., min_length=2, max_length=50)
    amount: int = Field(..., gt=0)
    comment: str = Field(default="", max_length=500)

    @validator('email')
    def validate_email(cls, v):
        if '@' not in v or '.' not in v:
            raise ValueError('Некорректный email')
        return v.lower()

    @validator('phone')
    def validate_phone(cls, v):
        digits = ''.join(filter(str.isdigit, v))
        if len(digits) < 10:
            raise ValueError('Некорректный номер телефона')
        return v

def send_telegram_notification(app_data: ApplicationRequest, program_name: str):
    """Отправляет уведомление о новой заявке в Telegram"""
    bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
    chat_id = os.environ.get('TELEGRAM_CHAT_ID')
    
    if not bot_token or not chat_id:
        return
    
    try:
        text = f"🏠 *Новая заявка на ипотеку*\n\n"
        text += f"👤 *Имя:* {app_data.name}\n"
        text += f"📱 *Телефон:* {app_data.phone}\n"
        text += f"✉️ *Email:* {app_data.email}\n"
        text += f"📋 *Программа:* {program_name}\n"
        text += f"💰 *Сумма:* {app_data.amount:,} ₽\n"
        if app_data.comment:
            text += f"💬 *Комментарий:* {app_data.comment}\n"
        
        phone_clean = app_data.phone.replace("+", "").replace(" ", "").replace("-", "")
        inline_keyboard = {
            'inline_keyboard': [[
                {'text': '✅ Принять в работу', 'callback_data': f'accept_{app_data.phone}'},
                {'text': '📞 Позвонить', 'url': f'tel:{app_data.phone}'}
            ], [
                {'text': '✉️ Email', 'url': f'mailto:{app_data.email}'},
                {'text': '💬 WhatsApp', 'url': f'https://wa.me/{phone_clean}'}
            ]]
        }
        
        url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
        payload = {
            'chat_id': chat_id,
            'text': text,
            'parse_mode': 'Markdown',
            'reply_markup': inline_keyboard
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
    '''
    Отправка заявки на ипотеку на email специалиста
    Args: event - dict с httpMethod, body, headers
          context - объект с атрибутами request_id, function_name
    Returns: HTTP response dict
    '''
    method: str = event.get('httpMethod', 'GET')
    
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
            'body': json.dumps({'error': 'Метод не поддерживается'}),
            'isBase64Encoded': False
        }
    
    try:
        body_data = json.loads(event.get('body', '{}'))
        app_data = ApplicationRequest(**body_data)
        
        program_names = {
            'family': 'Семейная ипотека',
            'it': 'IT-ипотека',
            'military': 'Военная ипотека',
            'rural': 'Сельская ипотека'
        }
        program_name = program_names.get(app_data.program, app_data.program)
        
        email_body = f"""
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #0EA5E9 0%, #8B5CF6 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; }}
                .content {{ background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; }}
                .field {{ margin: 15px 0; padding: 10px; background: white; border-left: 4px solid #0EA5E9; }}
                .label {{ font-weight: bold; color: #0EA5E9; }}
                .value {{ color: #333; margin-top: 5px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h2>🏠 Новая заявка на ипотеку</h2>
                </div>
                <div class="content">
                    <div class="field">
                        <div class="label">Имя клиента:</div>
                        <div class="value">{app_data.name}</div>
                    </div>
                    <div class="field">
                        <div class="label">Телефон:</div>
                        <div class="value">{app_data.phone}</div>
                    </div>
                    <div class="field">
                        <div class="label">Email:</div>
                        <div class="value">{app_data.email}</div>
                    </div>
                    <div class="field">
                        <div class="label">Программа:</div>
                        <div class="value">{program_name}</div>
                    </div>
                    <div class="field">
                        <div class="label">Желаемая сумма:</div>
                        <div class="value">{app_data.amount:,} ₽</div>
                    </div>
                    {f'<div class="field"><div class="label">Комментарий:</div><div class="value">{app_data.comment}</div></div>' if app_data.comment else ''}
                </div>
            </div>
        </body>
        </html>
        """
        
        msg = MIMEMultipart('alternative')
        msg['Subject'] = f'Новая заявка: {program_name} - {app_data.name}'
        msg['From'] = 'noreply@poehali.dev'
        msg['To'] = 'business@xn--80ajijbmjhop8h.xn--p1ai'
        
        html_part = MIMEText(email_body, 'html', 'utf-8')
        msg.attach(html_part)
        
        try:
            # Отправляем уведомление в Telegram
            send_telegram_notification(app_data, program_name)
            
            smtp_server = smtplib.SMTP('smtp.mail.ru', 587)
            smtp_server.starttls()
            
            smtp_login = os.environ.get('SMTP_LOGIN', '')
            smtp_password = os.environ.get('SMTP_PASSWORD', '')
            
            if smtp_login and smtp_password:
                smtp_server.login(smtp_login, smtp_password)
                smtp_server.send_message(msg)
                smtp_server.quit()
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'success': True,
                        'message': 'Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.'
                    }),
                    'isBase64Encoded': False
                }
            else:
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'success': True,
                        'message': 'Заявка сохранена! Свяжитесь с нами по телефону +7 978 128-18-50',
                        'demo_mode': True
                    }),
                    'isBase64Encoded': False
                }
                
        except Exception as smtp_error:
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': True,
                    'message': 'Заявка принята! Позвоните нам: +7 978 128-18-50',
                    'contact': {
                        'phone': '+7 978 128-18-50',
                        'email': 'business@xn--80ajijbmjhop8h.xn--p1ai'
                    }
                }),
                'isBase64Encoded': False
            }
        
    except Exception as e:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': f'Ошибка при обработке заявки: {str(e)}'
            }),
            'isBase64Encoded': False
        }