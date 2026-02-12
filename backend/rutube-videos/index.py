import json
import urllib.request
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Получает видео с канала Rutube (последнее или все)
    Args: event - dict с httpMethod, queryStringParameters
          context - объект с атрибутами request_id, function_name
    Returns: HTTP response dict с видео
    '''
    method: str = event.get('httpMethod', 'GET')
    
    # Handle CORS OPTIONS request
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method == 'GET':
        channel_id = '49706639'
        params = event.get('queryStringParameters', {}) or {}
        page_size = params.get('page_size', '20')
        
        api_url = f'https://rutube.ru/api/video/person/{channel_id}/?page=1&page_size={page_size}'
        
        try:
            req = urllib.request.Request(
                api_url,
                headers={'User-Agent': 'Mozilla/5.0'}
            )
            
            with urllib.request.urlopen(req, timeout=10) as response:
                data = json.loads(response.read().decode('utf-8'))
                
                if data.get('results') and len(data['results']) > 0:
                    # If page_size=1, return single video, otherwise return all
                    if page_size == '1':
                        latest_video = data['results'][0]
                        video_id = latest_video.get('id')
                        video_title = latest_video.get('title', 'Видео об ипотеке')
                        
                        return {
                            'statusCode': 200,
                            'headers': {
                                'Content-Type': 'application/json',
                                'Access-Control-Allow-Origin': '*'
                            },
                            'body': json.dumps({
                                'video_id': video_id,
                                'title': video_title,
                                'embed_url': f'https://rutube.ru/play/embed/{video_id}'
                            }),
                            'isBase64Encoded': False
                        }
                    else:
                        videos = []
                        for video in data['results']:
                            videos.append({
                                'video_id': video.get('id'),
                                'title': video.get('title', 'Видео'),
                                'description': video.get('description', ''),
                                'thumbnail': video.get('thumbnail_url', ''),
                                'duration': video.get('duration', 0),
                                'created': video.get('created_ts', ''),
                                'embed_url': f'https://rutube.ru/play/embed/{video.get("id")}',
                                'views': video.get('hits', 0)
                            })
                        
                        return {
                            'statusCode': 200,
                            'headers': {
                                'Content-Type': 'application/json',
                                'Access-Control-Allow-Origin': '*'
                            },
                            'body': json.dumps({
                                'videos': videos,
                                'total': len(videos)
                            }),
                            'isBase64Encoded': False
                        }
                else:
                    return {
                        'statusCode': 404,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'body': json.dumps({'error': 'No videos found'}),
                        'isBase64Encoded': False
                    }
                    
        except Exception as e:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': str(e)}),
                'isBase64Encoded': False
            }
    
    return {
        'statusCode': 405,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }