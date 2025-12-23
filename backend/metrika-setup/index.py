import json
import os
import urllib.request
import urllib.error
from typing import Dict, Any, List

METRIKA_ID = 105974763

GOALS = [
    {
        "name": "application_sent",
        "type": "action",
        "conditions": [{"type": "exact", "url": ""}],
        "is_retargeting": 0
    },
    {
        "name": "phone_click", 
        "type": "action",
        "conditions": [{"type": "exact", "url": ""}],
        "is_retargeting": 0
    },
    {
        "name": "telegram_click",
        "type": "action", 
        "conditions": [{"type": "exact", "url": ""}],
        "is_retargeting": 0
    },
    {
        "name": "calculator_used",
        "type": "action",
        "conditions": [{"type": "exact", "url": ""}],
        "is_retargeting": 0
    },
    {
        "name": "quiz_completed",
        "type": "action",
        "conditions": [{"type": "exact", "url": ""}],
        "is_retargeting": 0
    },
    {
        "name": "tab_changed",
        "type": "action",
        "conditions": [{"type": "exact", "url": ""}],
        "is_retargeting": 0
    },
    {
        "name": "excel_download",
        "type": "action",
        "conditions": [{"type": "exact", "url": ""}],
        "is_retargeting": 0
    },
    {
        "name": "email_report",
        "type": "action",
        "conditions": [{"type": "exact", "url": ""}],
        "is_retargeting": 0
    }
]

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Автоматически создает цели в Яндекс.Метрике через API
    для отслеживания конверсий и событий на сайте
    '''
    method: str = event.get('httpMethod', 'GET')
    
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
    
    if method == 'GET':
        token = os.environ.get('YANDEX_METRIKA_TOKEN', '')
        
        if not token:
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'configured': False,
                    'message': 'Добавьте YANDEX_METRIKA_TOKEN в секреты проекта',
                    'goals': GOALS,
                    'counter_id': METRIKA_ID
                }),
                'isBase64Encoded': False
            }
        
        try:
            req = urllib.request.Request(
                f'https://api-metrika.yandex.net/management/v1/counter/{METRIKA_ID}/goals',
                headers={'Authorization': f'OAuth {token}'}
            )
            
            with urllib.request.urlopen(req, timeout=10) as response:
                data = json.loads(response.read().decode('utf-8'))
                existing_goals = data.get('goals', [])
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'configured': True,
                        'counter_id': METRIKA_ID,
                        'existing_goals': len(existing_goals),
                        'goals': existing_goals
                    }),
                    'isBase64Encoded': False
                }
                
        except urllib.error.HTTPError as e:
            return {
                'statusCode': e.code,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'error': f'Metrika API error: {e.code}',
                    'message': 'Проверьте токен и права доступа'
                }),
                'isBase64Encoded': False
            }
    
    if method == 'POST':
        token = os.environ.get('YANDEX_METRIKA_TOKEN', '')
        
        if not token:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': False,
                    'error': 'YANDEX_METRIKA_TOKEN не настроен'
                }),
                'isBase64Encoded': False
            }
        
        created = []
        errors = []
        
        for goal in GOALS:
            try:
                goal_data = {
                    "goal": {
                        "name": goal["name"],
                        "type": "action",
                        "is_retargeting": 0
                    }
                }
                
                req = urllib.request.Request(
                    f'https://api-metrika.yandex.net/management/v1/counter/{METRIKA_ID}/goals',
                    data=json.dumps(goal_data).encode('utf-8'),
                    headers={
                        'Authorization': f'OAuth {token}',
                        'Content-Type': 'application/json'
                    },
                    method='POST'
                )
                
                with urllib.request.urlopen(req, timeout=10) as response:
                    result = json.loads(response.read().decode('utf-8'))
                    created.append({
                        'name': goal["name"],
                        'id': result.get('goal', {}).get('id')
                    })
                    
            except urllib.error.HTTPError as e:
                error_data = e.read().decode('utf-8')
                if 'already exists' in error_data or e.code == 400:
                    created.append({
                        'name': goal["name"],
                        'status': 'already_exists'
                    })
                else:
                    errors.append({
                        'name': goal["name"],
                        'error': str(e)
                    })
            except Exception as e:
                errors.append({
                    'name': goal["name"],
                    'error': str(e)
                })
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': len(created) > 0,
                'created': created,
                'errors': errors,
                'total_goals': len(GOALS),
                'counter_id': METRIKA_ID
            }),
            'isBase64Encoded': False
        }
    
    return {
        'statusCode': 405,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': 'Метод не поддерживается'}),
        'isBase64Encoded': False
    }
