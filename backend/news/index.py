import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime
from decimal import Decimal

SCHEMA = 't_p26758318_mortgage_support_pro'

def convert_to_serializable(obj):
    if isinstance(obj, Decimal):
        return float(obj)
    elif isinstance(obj, datetime):
        return obj.isoformat()
    elif isinstance(obj, dict):
        return {k: convert_to_serializable(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [convert_to_serializable(i) for i in obj]
    return obj

def slugify(text: str) -> str:
    cyrillic_to_latin = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e',
        'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
        'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
        'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
        'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
    }
    result = text.lower().strip()
    result = ''.join(cyrillic_to_latin.get(c, c) for c in result)
    result = ''.join(c if c.isalnum() else '-' for c in result)
    result = '-'.join(filter(None, result.split('-')))
    return result[:200]

def respond(status, body):
    return {
        'statusCode': status,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps(body, ensure_ascii=False),
        'isBase64Encoded': False
    }

def handler(event: dict, context) -> dict:
    '''API для управления новостями недвижимости Севастополя'''
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': ''
        }

    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cur = conn.cursor(cursor_factory=RealDictCursor)

    try:
        if method == 'GET':
            params = event.get('queryStringParameters', {}) or {}
            news_id = params.get('id')
            slug = params.get('slug')
            show_all = params.get('show_all')
            limit = params.get('limit', '50')
            category = params.get('category')

            if news_id or slug:
                if slug:
                    cur.execute(f'SELECT * FROM {SCHEMA}.news WHERE slug = %s', (slug,))
                else:
                    cur.execute(f'SELECT * FROM {SCHEMA}.news WHERE id = %s', (int(news_id),))
                item = cur.fetchone()

                if not item:
                    return respond(404, {'success': False, 'error': 'Новость не найдена'})

                cur.execute(f'UPDATE {SCHEMA}.news SET views_count = views_count + 1 WHERE id = %s', (item['id'],))
                conn.commit()

                return respond(200, {'success': True, 'news': convert_to_serializable(dict(item))})
            else:
                if show_all == 'true':
                    cur.execute(f'SELECT * FROM {SCHEMA}.news ORDER BY is_pinned DESC, created_at DESC LIMIT %s', (int(limit),))
                else:
                    where = f'WHERE is_published = true'
                    if category:
                        cur.execute(f'SELECT * FROM {SCHEMA}.news {where} AND category = %s ORDER BY is_pinned DESC, created_at DESC LIMIT %s', (category, int(limit)))
                    else:
                        cur.execute(f'SELECT * FROM {SCHEMA}.news {where} ORDER BY is_pinned DESC, created_at DESC LIMIT %s', (int(limit),))
                rows = [convert_to_serializable(dict(r)) for r in cur.fetchall()]
                return respond(200, {'success': True, 'news': rows, 'total': len(rows)})

        elif method == 'POST':
            data = json.loads(event.get('body', '{}'))
            title = data.get('title', '').strip()
            if not title:
                return respond(400, {'success': False, 'error': 'Заголовок обязателен'})

            slug = slugify(title)
            cur.execute(f'SELECT id FROM {SCHEMA}.news WHERE slug = %s', (slug,))
            if cur.fetchone():
                slug = slug + '-' + datetime.now().strftime('%Y%m%d%H%M%S')

            photos = data.get('photos', [])
            photo_url = data.get('photo_url') or (photos[0] if photos else None)

            cur.execute(f'''
                INSERT INTO {SCHEMA}.news (title, slug, summary, content, photo_url, photos, source, source_url, category, is_published, is_pinned)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id, slug
            ''', (
                title,
                slug,
                data.get('summary', ''),
                data.get('content', ''),
                photo_url,
                photos,
                data.get('source', ''),
                data.get('source_url', ''),
                data.get('category', 'general'),
                data.get('is_published', True),
                data.get('is_pinned', False)
            ))
            row = cur.fetchone()
            conn.commit()
            return respond(201, {'success': True, 'id': row['id'], 'slug': row['slug']})

        elif method == 'PUT':
            data = json.loads(event.get('body', '{}'))
            news_id = data.get('id')
            if not news_id:
                return respond(400, {'success': False, 'error': 'ID обязателен'})

            fields = []
            values = []
            for key in ['title', 'summary', 'content', 'photo_url', 'source', 'source_url', 'category', 'is_published', 'is_pinned']:
                if key in data:
                    fields.append(f'{key} = %s')
                    values.append(data[key])

            if 'photos' in data:
                fields.append('photos = %s')
                values.append(data['photos'])

            if 'title' in data:
                new_slug = slugify(data['title'])
                cur.execute(f'SELECT id FROM {SCHEMA}.news WHERE slug = %s AND id != %s', (new_slug, news_id))
                if cur.fetchone():
                    new_slug = new_slug + '-' + str(news_id)
                fields.append('slug = %s')
                values.append(new_slug)

            fields.append('updated_at = NOW()')
            values.append(news_id)

            cur.execute(f'UPDATE {SCHEMA}.news SET {", ".join(fields)} WHERE id = %s', values)
            conn.commit()
            return respond(200, {'success': True})

        elif method == 'DELETE':
            params = event.get('queryStringParameters', {}) or {}
            news_id = params.get('id')
            if not news_id:
                return respond(400, {'success': False, 'error': 'ID обязателен'})

            cur.execute(f'DELETE FROM {SCHEMA}.news WHERE id = %s', (int(news_id),))
            conn.commit()
            return respond(200, {'success': True})

        return respond(405, {'success': False, 'error': 'Method not allowed'})
    finally:
        cur.close()
        conn.close()
