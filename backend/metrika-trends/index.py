import json
import os
import urllib.request
import urllib.error
from typing import Dict, Any, List
from datetime import datetime, timedelta

METRIKA_ID = 105974763

GOALS_CONFIG = {
    'application_sent': {'name': 'Заявка отправлена', 'color': '#3b82f6'},
    'phone_click': {'name': 'Клик на телефон', 'color': '#10b981'},
    'telegram_click': {'name': 'Клик в Telegram', 'color': '#8b5cf6'},
    'calculator_used': {'name': 'Использован калькулятор', 'color': '#f59e0b'},
    'quiz_completed': {'name': 'Тест пройден', 'color': '#06b6d4'},
    'tab_changed': {'name': 'Переключение программ', 'color': '#ec4899'},
    'excel_download': {'name': 'Скачан Excel', 'color': '#14b8a6'},
    'email_report': {'name': 'Отправлен email', 'color': '#f97316'},
}

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Получает динамику достижения целей Яндекс.Метрики по дням
    для построения трендовых графиков
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
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
                    'message': 'Требуется токен YANDEX_METRIKA_TOKEN'
                }),
                'isBase64Encoded': False
            }
        
        params = event.get('queryStringParameters', {})
        days = int(params.get('days', '7'))
        
        date2 = datetime.now().strftime('%Y-%m-%d')
        date1 = (datetime.now() - timedelta(days=days)).strftime('%Y-%m-%d')
        
        try:
            goals_url = f'https://api-metrika.yandex.net/management/v1/counter/{METRIKA_ID}/goals'
            goals_req = urllib.request.Request(
                goals_url,
                headers={'Authorization': f'OAuth {token}'}
            )
            
            with urllib.request.urlopen(goals_req, timeout=10) as response:
                goals_data = json.loads(response.read().decode('utf-8'))
                goals_list = goals_data.get('goals', [])
            
            goals_map = {goal['name']: goal['id'] for goal in goals_list}
            
            trends_data = []
            
            for goal_name, goal_config in GOALS_CONFIG.items():
                goal_id = goals_map.get(goal_name)
                
                if not goal_id:
                    continue
                
                try:
                    stats_url = (
                        f'https://api-metrika.yandex.net/stat/v1/data'
                        f'?id={METRIKA_ID}'
                        f'&metrics=ym:s:goal{goal_id}reaches'
                        f'&dimensions=ym:s:date'
                        f'&date1={date1}'
                        f'&date2={date2}'
                        f'&limit=100'
                    )
                    
                    stats_req = urllib.request.Request(
                        stats_url,
                        headers={'Authorization': f'OAuth {token}'}
                    )
                    
                    with urllib.request.urlopen(stats_req, timeout=10) as response:
                        stats_data = json.loads(response.read().decode('utf-8'))
                        
                        daily_data = []
                        for item in stats_data.get('data', []):
                            date_str = item['dimensions'][0]['name']
                            count = int(item['metrics'][0]) if item['metrics'] else 0
                            daily_data.append({
                                'date': date_str,
                                'count': count
                            })
                        
                        trends_data.append({
                            'goal': goal_name,
                            'name': goal_config['name'],
                            'color': goal_config['color'],
                            'data': daily_data,
                            'total': sum(d['count'] for d in daily_data)
                        })
                
                except Exception as e:
                    print(f'Error fetching trend for {goal_name}: {e}')
                    continue
            
            all_dates = set()
            for trend in trends_data:
                for item in trend['data']:
                    all_dates.add(item['date'])
            
            sorted_dates = sorted(list(all_dates))
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Cache-Control': 'no-cache'
                },
                'body': json.dumps({
                    'configured': True,
                    'period_days': days,
                    'date_from': date1,
                    'date_to': date2,
                    'dates': sorted_dates,
                    'goals': trends_data
                }),
                'isBase64Encoded': False
            }
            
        except urllib.error.HTTPError as e:
            error_body = e.read().decode('utf-8')
            return {
                'statusCode': e.code,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'configured': False,
                    'error': f'API error: {e.code}',
                    'details': error_body
                }),
                'isBase64Encoded': False
            }
        except Exception as e:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'configured': False,
                    'error': str(e)
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
