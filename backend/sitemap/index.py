import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime

def handler(event: dict, context) -> dict:
    '''Генерация динамического sitemap.xml с объектами недвижимости'''
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': ''
        }

    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cur = conn.cursor(cursor_factory=RealDictCursor)

    try:
        cur.execute('''
            SELECT id, slug, updated_at 
            FROM t_p26758318_mortgage_support_pro.manual_properties 
            WHERE is_active = true
            ORDER BY updated_at DESC
        ''')
        properties = cur.fetchall()
        
        base_url = 'https://ипотекакрым.рф'
        today = datetime.now().strftime('%Y-%m-%d')
        
        static_pages = [
            {'url': '/', 'priority': '1.0', 'changefreq': 'daily', 'lastmod': today},
            {'url': '/catalog', 'priority': '0.9', 'changefreq': 'daily', 'lastmod': today},
            {'url': '/calculator', 'priority': '0.8', 'changefreq': 'weekly', 'lastmod': today},
            {'url': '/programs', 'priority': '0.8', 'changefreq': 'weekly', 'lastmod': today},
            {'url': '/online-services', 'priority': '0.7', 'changefreq': 'weekly', 'lastmod': today},
            {'url': '/register', 'priority': '0.7', 'changefreq': 'monthly', 'lastmod': today},
            {'url': '/add-property', 'priority': '0.6', 'changefreq': 'monthly', 'lastmod': today},
            {'url': '/contact', 'priority': '0.6', 'changefreq': 'monthly', 'lastmod': today},
            {'url': '/faq', 'priority': '0.5', 'changefreq': 'monthly', 'lastmod': today},
            {'url': '/blog', 'priority': '0.5', 'changefreq': 'weekly', 'lastmod': today},
            {'url': '/privacy-policy', 'priority': '0.3', 'changefreq': 'yearly', 'lastmod': today},
            {'url': '/terms-of-service', 'priority': '0.3', 'changefreq': 'yearly', 'lastmod': today},
        ]
        
        xml_parts = ['<?xml version="1.0" encoding="UTF-8"?>']
        xml_parts.append('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')
        
        for page in static_pages:
            xml_parts.append('  <url>')
            xml_parts.append(f'    <loc>{base_url}{page["url"]}</loc>')
            xml_parts.append(f'    <lastmod>{page["lastmod"]}</lastmod>')
            xml_parts.append(f'    <changefreq>{page["changefreq"]}</changefreq>')
            xml_parts.append(f'    <priority>{page["priority"]}</priority>')
            xml_parts.append('  </url>')
        
        for prop in properties:
            prop_url = f'/property/{prop["id"]}'
            lastmod = prop['updated_at'].strftime('%Y-%m-%d') if prop['updated_at'] else today
            
            xml_parts.append('  <url>')
            xml_parts.append(f'    <loc>{base_url}{prop_url}</loc>')
            xml_parts.append(f'    <lastmod>{lastmod}</lastmod>')
            xml_parts.append(f'    <changefreq>weekly</changefreq>')
            xml_parts.append(f'    <priority>0.8</priority>')
            xml_parts.append('  </url>')
        
        xml_parts.append('</urlset>')
        
        sitemap_xml = '\n'.join(xml_parts)
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/xml; charset=utf-8',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'public, max-age=3600'
            },
            'body': sitemap_xml,
            'isBase64Encoded': False
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'success': False, 'error': str(e)}, ensure_ascii=False),
            'isBase64Encoded': False
        }
    finally:
        cur.close()
        conn.close()
