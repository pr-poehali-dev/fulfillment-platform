import json
import os
import psycopg2

def handler(event: dict, context) -> dict:
    """Возвращает список email-подписчиков. Только для администраторов."""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization', 'Access-Control-Max-Age': '86400'}, 'body': ''}

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    cur.execute(
        "SELECT id, email, name, created_at FROM t_p18520385_fulfillment_platform.subscriber_emails ORDER BY created_at DESC"
    )
    rows = cur.fetchall()
    cur.close()
    conn.close()

    subscribers = [
        {"id": r[0], "email": r[1], "name": r[2], "created_at": r[3].isoformat() if r[3] else None}
        for r in rows
    ]

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'subscribers': subscribers, 'total': len(subscribers)})
    }