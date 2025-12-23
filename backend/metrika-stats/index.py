import json
import os
import urllib.request
import urllib.error
from typing import Dict, Any, List
from datetime import datetime, timedelta

METRIKA_ID = 105974763

GOALS_CONFIG = {
    'application_sent': {'name': 'Заявка отправлена', 'icon': 'Send'},
    'phone_click': {'name': 'Клик на телефон', 'icon': 'Phone'},
    'telegram_click': {'name': 'Клик в Telegram', 'icon': 'MessageCircle'},
    'calculator_used': {'name': 'Использован калькулятор', 'icon': 'Calculator'},
    'quiz_completed': {'name': 'Тест пройден', 'icon': 'CheckCircle'},
    'tab_changed': {'name': 'Переключение программ', 'icon': 'FolderOpen'},
    'excel_download': {'name': 'Скачан Excel', 'icon': 'Download'},
    'email_report': {'name': 'Отправлен email', 'icon': 'Mail'},
}

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Получает статистику достижения целей из Яндекс.Метрики в реальном времени
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
                    'message': 'Требуется токен YANDEX_METRIKA_TOKEN',
                    'goals': []
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
            
            stats_results = []
            
            for goal_name, goal_config in GOALS_CONFIG.items():
                goal_id = goals_map.get(goal_name)
                
                if not goal_id:
                    stats_results.append({
                        'goal': goal_name,
                        'name': goal_config['name'],
                        'icon': goal_config['icon'],
                        'count': 0,
                        'configured': False
                    })
                    continue
                
                try:
                    stats_url = (
                        f'https://api-metrika.yandex.net/stat/v1/data'
                        f'?id={METRIKA_ID}'
                        f'&metrics=ym:s:goal{goal_id}reaches'
                        f'&date1={date1}'
                        f'&date2={date2}'
                    )
                    
                    stats_req = urllib.request.Request(
                        stats_url,
                        headers={'Authorization': f'OAuth {token}'}
                    )
                    
                    with urllib.request.urlopen(stats_req, timeout=10) as response:
                        stats_data = json.loads(response.read().decode('utf-8'))
                        
                        count = 0
                        totals = stats_data.get('totals', [])
                        if totals and len(totals) > 0:
                            count = int(totals[0])
                        
                        stats_results.append({
                            'goal': goal_name,
                            'name': goal_config['name'],
                            'icon': goal_config['icon'],
                            'count': count,
                            'configured': True
                        })
                
                except Exception as e:
                    stats_results.append({
                        'goal': goal_name,
                        'name': goal_config['name'],
                        'icon': goal_config['icon'],
                        'count': 0,
                        'configured': True,
                        'error': str(e)
                    })
            
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
                    'goals': stats_results,
                    'total_goals': len(stats_results),
                    'active_goals': sum(1 for g in stats_results if g['configured'])
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