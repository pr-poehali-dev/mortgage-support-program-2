"""
Отправка заявки на услугу в Telegram

Получает данные заявки и отправляет в Telegram бот.
"""

import json
import os
import requests


def get_cors_headers() -> dict:
    return {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }


def handler(event: dict, context) -> dict:
    """Обработка заявки на услугу и отправка в Telegram"""
    
    method = event.get("httpMethod", "POST")

    if method == "OPTIONS":
        return {
            "statusCode": 200,
            "headers": get_cors_headers(),
            "body": ""
        }

    try:
        body = event.get("body", "{}")
        if isinstance(body, str):
            data = json.loads(body) if body else {}
        else:
            data = body

        name = data.get("name", "")
        phone = data.get("phone", "")
        service = data.get("service", "Не указано")

        if not name or not phone:
            return {
                "statusCode": 400,
                "headers": {**get_cors_headers(), "Content-Type": "application/json"},
                "body": json.dumps({"error": "Укажите имя и телефон"}, ensure_ascii=False)
            }

        bot_token = os.environ.get("TELEGRAM_BOT_TOKEN", "")
        chat_id = os.environ.get("TELEGRAM_CHAT_ID", "")

        if not bot_token or not chat_id:
            return {
                "statusCode": 500,
                "headers": {**get_cors_headers(), "Content-Type": "application/json"},
                "body": json.dumps({"error": "Telegram не настроен"}, ensure_ascii=False)
            }

        message = f"""
🏠 Новая заявка на услугу

👤 ФИО: {name}
📱 Телефон: {phone}
🔧 Услуга: {service}
"""

        telegram_url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
        response = requests.post(
            telegram_url,
            json={"chat_id": chat_id, "text": message.strip()},
            timeout=10
        )

        if response.status_code != 200:
            return {
                "statusCode": 500,
                "headers": {**get_cors_headers(), "Content-Type": "application/json"},
                "body": json.dumps({"error": "Не удалось отправить в Telegram"}, ensure_ascii=False)
            }

        return {
            "statusCode": 200,
            "headers": {**get_cors_headers(), "Content-Type": "application/json"},
            "body": json.dumps({"success": True, "message": "Заявка отправлена"}, ensure_ascii=False)
        }

    except json.JSONDecodeError:
        return {
            "statusCode": 400,
            "headers": {**get_cors_headers(), "Content-Type": "application/json"},
            "body": json.dumps({"error": "Неверный формат данных"}, ensure_ascii=False)
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "headers": {**get_cors_headers(), "Content-Type": "application/json"},
            "body": json.dumps({"error": str(e)}, ensure_ascii=False)
        }
