import json
import os
import urllib.request
import urllib.error
from typing import Dict, Any, List
from datetime import datetime

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Отправляет уведомления поисковым системам через протокол IndexNow
    о новых или обновленных страницах сайта для ускорения индексации
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Api-Key',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method == 'POST':
        body_str = event.get('body', '{}')
        if not body_str or body_str.strip() == '':
            body_str = '{}'
        
        body_data = json.loads(body_str)
        urls: List[str] = body_data.get('urls', [])
        host: str = body_data.get('host', '')
        key: str = body_data.get('key', '')
        
        if not urls or not host or not key:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': False,
                    'error': 'Требуются параметры: urls (массив), host, key'
                }),
                'isBase64Encoded': False
            }
        
        results = []
        
        engines = [
            {'name': 'Yandex', 'url': 'https://yandex.com/indexnow'},
            {'name': 'Bing', 'url': 'https://www.bing.com/indexnow'}
        ]
        
        for engine in engines:
            payload = {
                'host': host,
                'key': key,
                'keyLocation': f'https://{host}/{key}.txt',
                'urlList': urls
            }
            
            try:
                req = urllib.request.Request(
                    engine['url'],
                    data=json.dumps(payload).encode('utf-8'),
                    headers={
                        'Content-Type': 'application/json; charset=utf-8'
                    }
                )
                
                with urllib.request.urlopen(req, timeout=10) as response:
                    status_code = response.getcode()
                    
                    results.append({
                        'engine': engine['name'],
                        'status': 'success' if status_code == 200 else 'partial',
                        'statusCode': status_code,
                        'urls_count': len(urls)
                    })
                    
            except urllib.error.HTTPError as e:
                results.append({
                    'engine': engine['name'],
                    'status': 'error',
                    'statusCode': e.code,
                    'error': str(e)
                })
            except Exception as e:
                results.append({
                    'engine': engine['name'],
                    'status': 'error',
                    'error': str(e)
                })
        
        success_count = sum(1 for r in results if r['status'] == 'success')
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': success_count > 0,
                'results': results,
                'timestamp': datetime.now().isoformat(),
                'urls_submitted': len(urls)
            }),
            'isBase64Encoded': False
        }
    
    if method == 'GET':
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'service': 'IndexNow API',
                'version': '1.0',
                'description': 'Уведомляет поисковые системы о новых страницах',
                'usage': {
                    'method': 'POST',
                    'body': {
                        'urls': ['https://example.com/page1', 'https://example.com/page2'],
                        'host': 'example.com',
                        'key': 'your-indexnow-key'
                    }
                },
                'supported_engines': ['Yandex', 'Bing', 'Seznam', 'Naver']
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