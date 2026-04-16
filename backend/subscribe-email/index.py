import json
import os
import smtplib
import psycopg2
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

SMTP_LOGIN = 'noreply@fulfillhub.ru'
ADMIN_EMAIL = 'hello@fulfillhub.ru'

def _send_email(to: str, subject: str, html: str, reply_to: str = ''):
    password = os.environ.get('SMTP_PASSWORD', '')
    if not password:
        print('SMTP: password not set')
        return False
    msg = MIMEMultipart('alternative')
    msg['Subject'] = subject
    msg['From'] = 'FulfillHub <%s>' % SMTP_LOGIN
    msg['To'] = to
    if reply_to:
        msg['Reply-To'] = reply_to
    msg.attach(MIMEText(html, 'html', 'utf-8'))
    try:
        with smtplib.SMTP('mail.hosting.reg.ru', 587, timeout=15) as s:
            s.ehlo()
            s.starttls()
            s.login(SMTP_LOGIN, password)
            s.sendmail(SMTP_LOGIN, [to], msg.as_string())
        return True
    except Exception as e:
        print('SMTP error: %s' % str(e))
        return False

def handler(event: dict, context) -> dict:
    """Сохраняет email подписчика в таблицу subscriber_emails и отправляет уведомление администратору."""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Max-Age': '86400'}, 'body': ''}

    body = json.loads(event.get('body') or '{}')
    email = (body.get('email') or '').strip().lower()
    name = (body.get('name') or '').strip()
    source = (body.get('source') or 'site').strip()

    if not email or '@' not in email:
        return {'statusCode': 400, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'error': 'Некорректный email'})}

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO t_p18520385_fulfillment_platform.subscriber_emails (email, name) VALUES (%s, %s) ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name",
        (email, name or None)
    )
    conn.commit()
    cur.close()
    conn.close()

    name_display = name if name else email
    source_label = 'Страница /sales' if source == 'sales' else source

    html = """
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #f9fafb; padding: 24px; border-radius: 12px;">
      <div style="background: #0d1547; border-radius: 10px; padding: 20px 24px; margin-bottom: 20px;">
        <span style="color: #d4a017; font-weight: 900; font-size: 18px;">FulfillHub</span>
        <span style="color: rgba(255,255,255,0.4); font-size: 13px; margin-left: 10px;">новая заявка</span>
      </div>
      <div style="background: white; border-radius: 10px; padding: 20px 24px; border: 1px solid #e5e7eb;">
        <p style="margin: 0 0 6px; color: #6b7280; font-size: 13px;">Имя</p>
        <p style="margin: 0 0 16px; color: #111827; font-size: 15px; font-weight: 600;">%s</p>
        <p style="margin: 0 0 6px; color: #6b7280; font-size: 13px;">Email</p>
        <p style="margin: 0 0 16px; color: #111827; font-size: 15px;">%s</p>
        <p style="margin: 0 0 6px; color: #6b7280; font-size: 13px;">Источник</p>
        <p style="margin: 0; color: #111827; font-size: 15px;">%s</p>
      </div>
      <p style="margin: 16px 0 0; color: #9ca3af; font-size: 12px; text-align: center;">
        Посмотреть всех подписчиков: <a href="https://fulfillhub.ru/moderation" style="color: #d4a017;">fulfillhub.ru/moderation</a>
      </p>
    </div>
    """ % (name_display, email, source_label)

    _send_email(
        to=ADMIN_EMAIL,
        subject='Новая заявка с %s — %s' % (source_label, name_display),
        html=html,
        reply_to=email
    )

    return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'ok': True})}
