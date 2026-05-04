"""Определение города пользователя по IP-адресу через ip-api.com"""
import json
import urllib.request


CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}

# Маппинг ответа ip-api.com → наши группы городов
CITY_MAP = {
    # Москва и область
    "moscow": "Москва",
    "москва": "Москва",
    "podolsk": "Москва",
    "lyubertsy": "Москва",
    "krasnogorsk": "Москва",
    "khimki": "Москва",
    "mytishchi": "Москва",
    "korolev": "Москва",
    "balashikha": "Москва",
    "odintsovo": "Москва",
    "domodedovo": "Москва",
    "vidnoye": "Москва",
    "reutov": "Москва",
    "zhukovsky": "Москва",
    "elektrostal": "Москва",
    "moscow oblast": "Москва",
    "moskovskaya oblast": "Москва",
    # Санкт-Петербург и область
    "saint petersburg": "Санкт-Петербург",
    "st. petersburg": "Санкт-Петербург",
    "spb": "Санкт-Петербург",
    "санкт-петербург": "Санкт-Петербург",
    "leningrad oblast": "Санкт-Петербург",
    "leningradskaya oblast": "Санкт-Петербург",
    "gatchina": "Санкт-Петербург",
    "vsevolozhsk": "Санкт-Петербург",
    "kolpino": "Санкт-Петербург",
}

DEFAULT_CITY = "Москва"


def detect_city(ip: str) -> str:
    """Запрашивает ip-api.com с сервера (нет CORS), возвращает группу города."""
    try:
        url = f"http://ip-api.com/json/{ip}?fields=status,city,regionName&lang=en"
        req = urllib.request.Request(url, headers={"User-Agent": "fulfillhub/1.0"})
        with urllib.request.urlopen(req, timeout=3) as resp:
            data = json.loads(resp.read())

        if data.get("status") != "success":
            return DEFAULT_CITY

        city = (data.get("city") or "").lower().strip()
        region = (data.get("regionName") or "").lower().strip()

        for key, group in CITY_MAP.items():
            if key in city or key in region:
                return group

        return DEFAULT_CITY
    except Exception:
        return DEFAULT_CITY


def handler(event: dict, context) -> dict:
    """Определяет город пользователя по IP-адресу."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    ip = (
        event.get("headers", {}).get("x-forwarded-for", "")
        or event.get("requestContext", {}).get("identity", {}).get("sourceIp", "")
        or ""
    )
    # x-forwarded-for может содержать несколько IP через запятую — берём первый
    ip = ip.split(",")[0].strip()

    city = detect_city(ip) if ip else DEFAULT_CITY

    return {
        "statusCode": 200,
        "headers": {**CORS, "Content-Type": "application/json"},
        "body": json.dumps({"city": city, "ip": ip}),
    }
