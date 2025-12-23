import json
from typing import Dict, Any
from datetime import datetime

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Генерирует XML карту сайта (sitemap.xml) для поисковых систем
    с автоматическим обновлением дат и приоритетов страниц
    '''
    method: str = event.get('httpMethod', 'GET')
    
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
        params = event.get('queryStringParameters', {})
        host = params.get('host', 'localhost')
        protocol = params.get('protocol', 'https')
        
        base_url = f'{protocol}://{host}'
        current_date = datetime.now().strftime('%Y-%m-%d')
        
        pages = [
            {
                'loc': f'{base_url}/',
                'lastmod': current_date,
                'changefreq': 'daily',
                'priority': '1.0'
            },
            {
                'loc': f'{base_url}/admin',
                'lastmod': current_date,
                'changefreq': 'weekly',
                'priority': '0.5'
            },
        ]
        
        sitemap_xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
        sitemap_xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        
        for page in pages:
            sitemap_xml += '  <url>\n'
            sitemap_xml += f'    <loc>{page["loc"]}</loc>\n'
            sitemap_xml += f'    <lastmod>{page["lastmod"]}</lastmod>\n'
            sitemap_xml += f'    <changefreq>{page["changefreq"]}</changefreq>\n'
            sitemap_xml += f'    <priority>{page["priority"]}</priority>\n'
            sitemap_xml += '  </url>\n'
        
        sitemap_xml += '</urlset>'
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/xml',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'public, max-age=3600'
            },
            'body': sitemap_xml,
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
