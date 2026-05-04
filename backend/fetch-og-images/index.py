"""Пакетная загрузка OG-изображений для фулфилментов у которых есть website_url, но нет og_image и фото."""
import json
import os
import re
import socket
import ipaddress
import urllib.request
import urllib.parse
import psycopg2

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Authorization",
}


def get_db():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def _is_safe_public_url(url: str) -> bool:
    try:
        parsed = urllib.parse.urlparse(url)
        if parsed.scheme not in ("http", "https"):
            return False
        host = parsed.hostname
        if not host:
            return False
        if host.lower() in ("localhost", "metadata.google.internal", "metadata"):
            return False
        infos = socket.getaddrinfo(host, None)
        for info in infos:
            ip = ipaddress.ip_address(info[4][0])
            if ip.is_private or ip.is_loopback or ip.is_link_local or ip.is_multicast or ip.is_reserved:
                return False
        return True
    except Exception:
        return False


def fetch_og_image(url: str) -> str:
    if not url:
        return ""
    try:
        if not url.startswith(("http://", "https://")):
            url = "https://" + url
        if not _is_safe_public_url(url):
            return ""
        req = urllib.request.Request(
            url,
            headers={
                "User-Agent": "Mozilla/5.0 (compatible; FulfillHubBot/1.0)",
                "Accept": "text/html,application/xhtml+xml",
            },
        )
        with urllib.request.urlopen(req, timeout=6) as r:
            raw = r.read(300_000)
            ctype = r.headers.get("Content-Type", "")
            charset = "utf-8"
            if "charset=" in ctype:
                charset = ctype.split("charset=")[-1].split(";")[0].strip() or "utf-8"
            try:
                html = raw.decode(charset, errors="ignore")
            except Exception:
                html = raw.decode("utf-8", errors="ignore")

        patterns = [
            r'<meta[^>]+property=["\']og:image["\'][^>]+content=["\']([^"\']+)["\']',
            r'<meta[^>]+content=["\']([^"\']+)["\'][^>]+property=["\']og:image["\']',
            r'<meta[^>]+name=["\']twitter:image["\'][^>]+content=["\']([^"\']+)["\']',
            r'<meta[^>]+content=["\']([^"\']+)["\'][^>]+name=["\']twitter:image["\']',
        ]
        for pattern in patterns:
            m = re.search(pattern, html, re.IGNORECASE)
            if m:
                img_url = m.group(1).strip()
                if img_url.startswith("//"):
                    img_url = "https:" + img_url
                elif img_url.startswith("/"):
                    parsed = urllib.parse.urlparse(url)
                    img_url = f"{parsed.scheme}://{parsed.netloc}{img_url}"
                return img_url
        return ""
    except Exception:
        return ""


def handler(event: dict, context) -> dict:
    """Находит все approved фулфилменты без og_image и без фото, скачивает OG-картинку с сайта и сохраняет."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    # Только POST с токеном или GET для диагностики
    method = event.get("httpMethod", "GET")

    db = get_db()
    cur = db.cursor()

    # Выбираем фулфилменты без og_image и без фото, у которых есть website_url
    cur.execute("""
        SELECT id, company_name, website_url
        FROM fulfillments
        WHERE status IN ('approved', 'active')
          AND website_url IS NOT NULL AND website_url != ''
          AND (og_image IS NULL OR og_image = '')
          AND (photos IS NULL OR photos = '{}')
        ORDER BY id
        LIMIT 50
    """)
    rows = cur.fetchall()

    results = []
    updated = 0

    for (fid, name, url) in rows:
        og = fetch_og_image(url)
        if og:
            cur.execute(
                "UPDATE fulfillments SET og_image = %s WHERE id = %s",
                (og, fid)
            )
            updated += 1
            results.append({"id": fid, "name": name, "og_image": og, "status": "ok"})
        else:
            results.append({"id": fid, "name": name, "og_image": "", "status": "not_found"})

    db.commit()
    cur.close()
    db.close()

    return {
        "statusCode": 200,
        "headers": {**CORS, "Content-Type": "application/json"},
        "body": json.dumps({
            "processed": len(rows),
            "updated": updated,
            "results": results,
        }, ensure_ascii=False),
    }
