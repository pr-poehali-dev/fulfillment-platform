"""Аутентификация: регистрация, вход, подтверждение email, проверка сессии"""
import json
import os
import hashlib
import secrets
import random
import string
from datetime import datetime, timedelta
import psycopg2

CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Auth-Token',
    'Access-Control-Max-Age': '86400',
}

def get_db():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def resp(status, body):
    return {'statusCode': status, 'headers': {**CORS_HEADERS, 'Content-Type': 'application/json'}, 'body': json.dumps(body, default=str)}

def hash_password(pw):
    salt = secrets.token_hex(16)
    h = hashlib.pbkdf2_hmac('sha256', pw.encode(), salt.encode(), 100000).hex()
    return f"{salt}:{h}"

def check_password(pw, stored):
    salt, h = stored.split(':')
    return hashlib.pbkdf2_hmac('sha256', pw.encode(), salt.encode(), 100000).hex() == h

def gen_token():
    return secrets.token_urlsafe(48)

def gen_code():
    return ''.join(random.choices(string.digits, k=6))

def get_user_by_token(cur, token):
    cur.execute("SELECT u.id, u.email, u.role, u.email_verified FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token = '%s' AND s.expires_at > NOW()" % token.replace("'", "''"))
    return cur.fetchone()

def handle_register(body):
    email = body.get('email', '').strip().lower()
    password = body.get('password', '')
    phone = body.get('phone', '').strip()
    if not email or not password:
        return resp(400, {'error': 'Email и пароль обязательны'})
    if len(password) < 6:
        return resp(400, {'error': 'Пароль минимум 6 символов'})

    conn = get_db()
    cur = conn.cursor()
    try:
        cur.execute("SELECT id FROM users WHERE email = '%s'" % email.replace("'", "''"))
        if cur.fetchone():
            return resp(409, {'error': 'Пользователь с таким email уже существует'})

        pw_hash = hash_password(password)
        cur.execute("""
            INSERT INTO users (email, password_hash, phone, role)
            VALUES ('%s', '%s', '%s', 'fulfillment')
            RETURNING id
        """ % (email.replace("'", "''"), pw_hash.replace("'", "''"), phone.replace("'", "''")))
        user_id = cur.fetchone()[0]

        cur.execute("""
            INSERT INTO fulfillments (user_id, contact_email, contact_phone)
            VALUES (%d, '%s', '%s')
        """ % (user_id, email.replace("'", "''"), phone.replace("'", "''")))

        code = gen_code()
        expires = (datetime.utcnow() + timedelta(minutes=30)).strftime('%Y-%m-%d %H:%M:%S')
        cur.execute("""
            INSERT INTO email_codes (user_id, code, purpose, expires_at)
            VALUES (%d, '%s', 'verify', '%s')
        """ % (user_id, code, expires))

        token = gen_token()
        token_expires = (datetime.utcnow() + timedelta(days=30)).strftime('%Y-%m-%d %H:%M:%S')
        cur.execute("""
            INSERT INTO sessions (user_id, token, expires_at)
            VALUES (%d, '%s', '%s')
        """ % (user_id, token.replace("'", "''"), token_expires))

        conn.commit()
        return resp(201, {
            'token': token,
            'user': {'id': user_id, 'email': email, 'role': 'fulfillment', 'email_verified': False},
            'email_code_hint': code
        })
    except Exception as e:
        conn.rollback()
        return resp(500, {'error': str(e)})
    finally:
        cur.close()
        conn.close()

def handle_login(body):
    email = body.get('email', '').strip().lower()
    password = body.get('password', '')
    if not email or not password:
        return resp(400, {'error': 'Email и пароль обязательны'})

    conn = get_db()
    cur = conn.cursor()
    try:
        cur.execute("SELECT id, password_hash, role, email_verified FROM users WHERE email = '%s'" % email.replace("'", "''"))
        row = cur.fetchone()
        if not row:
            return resp(401, {'error': 'Неверный email или пароль'})
        user_id, pw_hash, role, verified = row
        if not pw_hash or not check_password(password, pw_hash):
            return resp(401, {'error': 'Неверный email или пароль'})

        token = gen_token()
        token_expires = (datetime.utcnow() + timedelta(days=30)).strftime('%Y-%m-%d %H:%M:%S')
        cur.execute("""
            INSERT INTO sessions (user_id, token, expires_at)
            VALUES (%d, '%s', '%s')
        """ % (user_id, token.replace("'", "''"), token_expires))
        conn.commit()

        return resp(200, {
            'token': token,
            'user': {'id': user_id, 'email': email, 'role': role, 'email_verified': verified}
        })
    finally:
        cur.close()
        conn.close()

def handle_verify_email(body, token):
    code = body.get('code', '').strip()
    if not code:
        return resp(400, {'error': 'Код обязателен'})

    conn = get_db()
    cur = conn.cursor()
    try:
        user = get_user_by_token(cur, token)
        if not user:
            return resp(401, {'error': 'Не авторизован'})
        user_id = user[0]

        cur.execute("""
            SELECT id FROM email_codes
            WHERE user_id = %d AND code = '%s' AND purpose = 'verify' AND used = FALSE AND expires_at > NOW()
            ORDER BY created_at DESC LIMIT 1
        """ % (user_id, code.replace("'", "''")))
        ec = cur.fetchone()
        if not ec:
            return resp(400, {'error': 'Неверный или просроченный код'})

        cur.execute("UPDATE email_codes SET used = TRUE WHERE id = %d" % ec[0])
        cur.execute("UPDATE users SET email_verified = TRUE, updated_at = NOW() WHERE id = %d" % user_id)
        conn.commit()
        return resp(200, {'ok': True, 'message': 'Email подтверждён'})
    finally:
        cur.close()
        conn.close()

def handle_resend_code(token):
    conn = get_db()
    cur = conn.cursor()
    try:
        user = get_user_by_token(cur, token)
        if not user:
            return resp(401, {'error': 'Не авторизован'})
        user_id = user[0]

        code = gen_code()
        expires = (datetime.utcnow() + timedelta(minutes=30)).strftime('%Y-%m-%d %H:%M:%S')
        cur.execute("""
            INSERT INTO email_codes (user_id, code, purpose, expires_at)
            VALUES (%d, '%s', 'verify', '%s')
        """ % (user_id, code, expires))
        conn.commit()
        return resp(200, {'ok': True, 'email_code_hint': code})
    finally:
        cur.close()
        conn.close()

def handle_me(token):
    conn = get_db()
    cur = conn.cursor()
    try:
        user = get_user_by_token(cur, token)
        if not user:
            return resp(401, {'error': 'Не авторизован'})
        user_id, email, role, verified = user

        cur.execute("SELECT id, company_name, status FROM fulfillments WHERE user_id = %d" % user_id)
        ff = cur.fetchone()
        fulfillment = None
        if ff:
            fulfillment = {'id': ff[0], 'company_name': ff[1], 'status': ff[2]}

        return resp(200, {
            'user': {'id': user_id, 'email': email, 'role': role, 'email_verified': verified},
            'fulfillment': fulfillment
        })
    finally:
        cur.close()
        conn.close()

def handle_register_from_form(body):
    email = body.get('contactEmail', '').strip().lower()
    phone = body.get('contactPhone', '').strip()
    if not email:
        return resp(400, {'error': 'Email обязателен'})

    conn = get_db()
    cur = conn.cursor()
    try:
        cur.execute("SELECT id FROM users WHERE email = '%s'" % email.replace("'", "''"))
        existing = cur.fetchone()
        if existing:
            return resp(409, {'error': 'Пользователь с таким email уже зарегистрирован. Войдите в систему.', 'exists': True})

        temp_pw = secrets.token_urlsafe(12)
        pw_hash = hash_password(temp_pw)

        cur.execute("""
            INSERT INTO users (email, password_hash, phone, role)
            VALUES ('%s', '%s', '%s', 'fulfillment')
            RETURNING id
        """ % (email.replace("'", "''"), pw_hash.replace("'", "''"), phone.replace("'", "''")))
        user_id = cur.fetchone()[0]

        company = body.get('companyName', '').replace("'", "''")
        inn = body.get('inn', '').replace("'", "''")
        city = body.get('city', '').replace("'", "''")
        area = int(body.get('warehouseArea', 0) or 0)
        year = int(body.get('foundedYear', 0) or 0)
        desc = body.get('description', '').replace("'", "''")
        name = body.get('contactName', '').replace("'", "''")
        tg = body.get('contactTg', '').replace("'", "''")

        schemes_arr = body.get('schemes', [])
        features_arr = body.get('features', [])
        packaging_arr = body.get('packaging', [])
        mp_arr = body.get('marketplaces', [])

        def to_pg_arr(arr):
            if not arr:
                return "'{}'"
            escaped = ','.join('"' + str(x).replace('"', '\\"') + '"' for x in arr)
            return "'{%s}'" % escaped

        sp = body.get('storagePrice', '').replace("'", "''")
        ap = body.get('assemblyPrice', '').replace("'", "''")
        dp = body.get('deliveryPrice', '').replace("'", "''")
        mv = body.get('minVolume', '').replace("'", "''")
        ht = 'TRUE' if body.get('hasTrial') else 'FALSE'

        cur.execute("""
            INSERT INTO fulfillments (user_id, company_name, inn, city, warehouse_area, founded_year,
                description, contact_name, contact_email, contact_phone, contact_tg,
                work_schemes, features, packaging_types, marketplaces,
                storage_price, assembly_price, delivery_price, min_volume, has_trial, status)
            VALUES (%d, '%s', '%s', '%s', %d, %d, '%s', '%s', '%s', '%s', '%s',
                %s, %s, %s, %s, '%s', '%s', '%s', '%s', %s, 'pending')
        """ % (user_id, company, inn, city, area, year, desc, name, email.replace("'", "''"), phone.replace("'", "''"), tg,
               to_pg_arr(schemes_arr), to_pg_arr(features_arr), to_pg_arr(packaging_arr), to_pg_arr(mp_arr),
               sp, ap, dp, mv, ht))

        token = gen_token()
        token_expires = (datetime.utcnow() + timedelta(days=30)).strftime('%Y-%m-%d %H:%M:%S')
        cur.execute("""
            INSERT INTO sessions (user_id, token, expires_at)
            VALUES (%d, '%s', '%s')
        """ % (user_id, token.replace("'", "''"), token_expires))

        code = gen_code()
        code_expires = (datetime.utcnow() + timedelta(minutes=30)).strftime('%Y-%m-%d %H:%M:%S')
        cur.execute("""
            INSERT INTO email_codes (user_id, code, purpose, expires_at)
            VALUES (%d, '%s', 'verify', '%s')
        """ % (user_id, code, code_expires))

        conn.commit()
        return resp(201, {
            'token': token,
            'temp_password': temp_pw,
            'user': {'id': user_id, 'email': email, 'role': 'fulfillment', 'email_verified': False},
            'email_code_hint': code
        })
    except Exception as e:
        conn.rollback()
        return resp(500, {'error': str(e)})
    finally:
        cur.close()
        conn.close()

def handler(event, context):
    """Аутентификация: регистрация, вход, подтверждение email, сессии"""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': ''}

    method = event.get('httpMethod', 'GET')
    path = (event.get('queryStringParameters') or {}).get('action', '')
    body = {}
    if event.get('body'):
        try:
            body = json.loads(event['body'])
        except:
            pass

    token = ''
    headers = event.get('headers') or {}
    auth = headers.get('X-Authorization') or headers.get('x-authorization') or headers.get('Authorization') or headers.get('authorization') or ''
    if auth.startswith('Bearer '):
        token = auth[7:]

    if method == 'POST':
        if path == 'register':
            return handle_register(body)
        if path == 'login':
            return handle_login(body)
        if path == 'verify-email':
            return handle_verify_email(body, token)
        if path == 'resend-code':
            return handle_resend_code(token)
        if path == 'register-from-form':
            return handle_register_from_form(body)

    if method == 'GET':
        if path == 'me':
            return handle_me(token)

    return resp(404, {'error': 'Неизвестный маршрут'})
