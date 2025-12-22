"""
Backend функция для парсинга RSS-лент новостей об ипотеке
Собирает новости из нескольких источников и возвращает объединённый список
"""
import json
import os
from typing import Dict, Any, List
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime
import html

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    Парсит RSS-ленты новостей об ипотеке из разных источников
    Args: event - dict с httpMethod
          context - объект с request_id и другими атрибутами
    Returns: HTTP response с массивом новостей
    """
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
        articles: List[Dict[str, str]] = []
        
        # RSS источники с новостями об ипотеке
        rss_feeds = [
            {
                'url': 'https://cbr.ru/rss/RssNews',
                'source': 'ЦБ РФ',
                'keywords': ['ипотек', 'кредит', 'ставк', 'жиль']
            },
            {
                'url': 'https://www.interfax.ru/rss.asp',
                'source': 'Интерфакс',
                'keywords': ['ипотек', 'недвижим', 'жиль', 'кредит']
            },
            {
                'url': 'https://ria.ru/export/rss2/archive/index.xml',
                'source': 'РИА Новости',
                'keywords': ['ипотек', 'недвижим', 'жиль']
            },
            {
                'url': 'https://www.rbc.ru/v10/rss/news/30/full.rss',
                'source': 'РБК',
                'keywords': ['ипотек', 'недвижим', 'жиль', 'кредит', 'ставк']
            },
            {
                'url': 'https://www.banki.ru/xml/news.rss',
                'source': 'Banki.ru',
                'keywords': ['ипотек', 'кредит', 'жиль', 'недвижим', 'ставк']
            },
            {
                'url': 'https://www.kommersant.ru/RSS/main.xml',
                'source': 'Коммерсантъ',
                'keywords': ['ипотек', 'недвижим', 'жиль', 'кредит']
            },
            {
                'url': 'https://tass.ru/rss/v2.xml',
                'source': 'ТАСС',
                'keywords': ['ипотек', 'недвижим', 'жиль']
            },
            {
                'url': 'https://lenta.ru/rss/news',
                'source': 'Lenta.ru',
                'keywords': ['ипотек', 'недвижим', 'жиль', 'кредит']
            }
        ]
        
        for feed_config in rss_feeds:
            try:
                articles.extend(parse_rss_feed(
                    feed_config['url'],
                    feed_config['source'],
                    feed_config['keywords']
                ))
            except Exception as e:
                print(f"Error parsing {feed_config['source']}: {str(e)}")
                continue
        
        # Если не удалось получить новости, возвращаем моковые данные
        if not articles:
            articles = get_mock_articles()
        
        # Сортируем по дате (новые сначала)
        articles.sort(key=lambda x: x.get('pubDate', ''), reverse=True)
        
        # Ограничиваем до 12 новостей
        articles = articles[:12]
        
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                'Cache-Control': 'public, max-age=3600'
            },
            'body': json.dumps({
                'articles': articles,
                'count': len(articles),
                'updated': datetime.now().isoformat()
            }, ensure_ascii=False),
            'isBase64Encoded': False
        }
    
    return {
        'statusCode': 405,
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        },
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }

def parse_rss_feed(url: str, source: str, keywords: List[str]) -> List[Dict[str, str]]:
    """
    Парсит RSS-ленту и фильтрует новости по ключевым словам
    """
    articles = []
    
    try:
        req = urllib.request.Request(
            url,
            headers={'User-Agent': 'Mozilla/5.0'}
        )
        
        with urllib.request.urlopen(req, timeout=10) as response:
            xml_data = response.read()
        
        root = ET.fromstring(xml_data)
        
        # Поддержка разных форматов RSS
        items = root.findall('.//item') or root.findall('.//{http://www.w3.org/2005/Atom}entry')
        
        for item in items[:20]:  # Берём первые 20 из фида
            try:
                # Извлекаем данные (RSS 2.0)
                title_elem = item.find('title')
                link_elem = item.find('link')
                desc_elem = item.find('description') or item.find('{http://purl.org/rss/1.0/modules/content/}encoded')
                date_elem = item.find('pubDate') or item.find('{http://www.w3.org/2005/Atom}published')
                
                if title_elem is None:
                    continue
                
                title = clean_text(title_elem.text or '')
                link = clean_text(link_elem.text or '') if link_elem is not None else url
                description = clean_text(desc_elem.text or '') if desc_elem is not None else ''
                pub_date = clean_text(date_elem.text or '') if date_elem is not None else datetime.now().isoformat()
                
                # Фильтруем по ключевым словам
                text_to_check = (title + ' ' + description).lower()
                if any(keyword.lower() in text_to_check for keyword in keywords):
                    # Ограничиваем длину описания
                    if len(description) > 200:
                        description = description[:200] + '...'
                    
                    articles.append({
                        'title': title[:150],
                        'link': link,
                        'description': description,
                        'pubDate': normalize_date(pub_date),
                        'source': source
                    })
            except Exception as e:
                print(f"Error parsing item: {str(e)}")
                continue
    
    except Exception as e:
        print(f"Error fetching RSS from {url}: {str(e)}")
    
    return articles

def clean_text(text: str) -> str:
    """
    Очищает текст от HTML-тегов и лишних пробелов
    """
    if not text:
        return ''
    
    # Декодируем HTML entities
    text = html.unescape(text)
    
    # Убираем HTML теги (простой вариант)
    import re
    text = re.sub(r'<[^>]+>', '', text)
    
    # Убираем множественные пробелы
    text = re.sub(r'\s+', ' ', text)
    
    return text.strip()

def normalize_date(date_str: str) -> str:
    """
    Нормализует дату в ISO формат
    """
    if not date_str:
        return datetime.now().isoformat()
    
    try:
        # Пробуем разные форматы дат
        formats = [
            '%a, %d %b %Y %H:%M:%S %z',  # RSS 2.0
            '%a, %d %b %Y %H:%M:%S GMT',
            '%Y-%m-%dT%H:%M:%S%z',  # ISO format
            '%Y-%m-%dT%H:%M:%S',
        ]
        
        for fmt in formats:
            try:
                dt = datetime.strptime(date_str.strip(), fmt)
                return dt.isoformat()
            except ValueError:
                continue
        
        # Если не получилось распарсить - возвращаем текущее время
        return datetime.now().isoformat()
    except Exception:
        return datetime.now().isoformat()

def get_mock_articles() -> List[Dict[str, str]]:
    """
    Возвращает моковые данные на случай, если RSS не доступен
    """
    return [
        {
            'title': 'ЦБ РФ снизил ключевую ставку: что это значит для ипотечных заёмщиков',
            'link': 'https://www.cbr.ru/',
            'description': 'Центральный банк России принял решение о снижении ключевой ставки. Эксперты прогнозируют снижение ставок по ипотеке на 0.5-1% в ближайшие месяцы.',
            'pubDate': datetime.now().isoformat(),
            'source': 'ЦБ РФ'
        },
        {
            'title': 'Семейная ипотека: изменения с 2025 года',
            'link': 'https://дом.рф/',
            'description': 'С 1 января 2025 года вступили в силу новые условия программы семейной ипотеки. Максимальная сумма кредита увеличена до 12 млн рублей.',
            'pubDate': datetime.now().isoformat(),
            'source': 'ДОМ.РФ'
        },
        {
            'title': 'IT-ипотека: кто может получить льготный кредит',
            'link': 'https://дом.рф/',
            'description': 'Программа IT-ипотеки стала доступна большему числу специалистов. Расширен список компаний-работодателей, участвующих в программе.',
            'pubDate': datetime.now().isoformat(),
            'source': 'Минцифры РФ'
        },
        {
            'title': 'Сельская ипотека 2025: новые возможности для жителей регионов',
            'link': 'https://минсельхоз.рф/',
            'description': 'Минсельхоз расширил географию программы сельской ипотеки. Теперь под программу попадают новые населённые пункты Крыма.',
            'pubDate': datetime.now().isoformat(),
            'source': 'Минсельхоз РФ'
        },
        {
            'title': 'Военная ипотека: увеличен размер накоплений',
            'link': 'https://rosvoenipoteka.ru/',
            'description': 'С 2025 года размер ежегодных накоплений по программе военной ипотеки увеличен на 15%. Это позволит военнослужащим приобретать более дорогое жильё.',
            'pubDate': datetime.now().isoformat(),
            'source': 'Росвоенипотека'
        },
        {
            'title': 'Банки снижают ставки по базовой ипотеке',
            'link': 'https://www.banki.ru/',
            'description': 'Крупнейшие банки России начали снижать ставки по базовой ипотеке. Средняя ставка на рынке сейчас составляет 16.5% годовых.',
            'pubDate': datetime.now().isoformat(),
            'source': 'Banki.ru'
        }
    ]