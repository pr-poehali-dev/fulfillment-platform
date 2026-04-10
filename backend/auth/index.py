"""Аутентификация: регистрация, вход, подтверждение email, проверка сессии"""
import json
import os
import hashlib
import hmac
import secrets
import random
import string
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
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

def send_email(to: str, subject: str, html: str):
    user = os.environ.get('SMTP_EMAIL', '')
    password = os.environ.get('SMTP_PASSWORD', '')
    if not user or not password:
        return

    msg = MIMEMultipart('alternative')
    msg['Subject'] = subject
    msg['From'] = 'FulfillHub <noreply@fulfillhub.ru>'
    msg['To'] = to
    msg.attach(MIMEText(html, 'html', 'utf-8'))

    with smtplib.SMTP('mail.hosting.reg.ru', 587) as s:
        s.ehlo()
        s.starttls()
        s.login(user, password)
        s.sendmail(user, to, msg.as_string())

def verify_email_html(code: str, email: str) -> str:
    return f"""<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0f172a;font-family:'Helvetica Neue',Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;padding:40px 20px">
    <tr><td align="center">
      <table width="480" cellpadding="0" cellspacing="0" style="background:#1e293b;border-radius:16px;overflow:hidden">
        <tr>
          <td style="background:linear-gradient(135deg,#1e3a5f,#0f172a);padding:32px;text-align:center">
            <div style="display:inline-block;background:#f59e0b;border-radius:8px;padding:10px 14px;margin-bottom:16px">
              <span style="color:#0f172a;font-size:20px">📦</span>
            </div>
            <h1 style="color:#ffffff;font-size:24px;margin:0;font-weight:800">FulfillHub</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:32px">
            <h2 style="color:#ffffff;font-size:20px;margin:0 0 12px">Подтвердите ваш email</h2>
            <p style="color:#94a3b8;font-size:14px;line-height:1.6;margin:0 0 24px">
              Для завершения регистрации введите этот код в приложении:
            </p>
            <div style="background:#0f172a;border-radius:12px;padding:24px;text-align:center;margin-bottom:24px">
              <span style="color:#f59e0b;font-size:36px;font-weight:900;letter-spacing:12px;font-family:monospace">{code}</span>
            </div>
            <p style="color:#64748b;font-size:12px;margin:0">
              Код действителен 30 минут. Если вы не регистрировались на FulfillHub — просто проигнорируйте это письмо.
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:16px 32px;border-top:1px solid #334155;text-align:center">
            <p style="color:#475569;font-size:11px;margin:0">© 2026 FulfillHub · {email}</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>"""

def registration_confirm_html(email: str) -> str:
    return """<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0f172a;font-family:'Helvetica Neue',Arial,sans-serif">
  <table width="100%%" cellpadding="0" cellspacing="0" style="background:#0f172a;padding:40px 20px">
    <tr><td align="center">
      <table width="480" cellpadding="0" cellspacing="0" style="background:#1e293b;border-radius:16px;overflow:hidden">
        <tr>
          <td style="background:linear-gradient(135deg,#1e3a5f,#0f172a);padding:32px;text-align:center">
            <div style="display:inline-block;background:#f59e0b;border-radius:8px;padding:10px 14px;margin-bottom:16px">
              <span style="color:#0f172a;font-size:20px">📦</span>
            </div>
            <h1 style="color:#ffffff;font-size:24px;margin:0;font-weight:800">FulfillHub</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:32px">
            <h2 style="color:#ffffff;font-size:20px;margin:0 0 12px">Заявка принята!</h2>
            <p style="color:#94a3b8;font-size:15px;line-height:1.7;margin:0 0 20px">
              Спасибо за регистрацию на FulfillHub. Ваша заявка на размещение фулфилмента получена и передана на проверку.
            </p>
            <p style="color:#94a3b8;font-size:15px;line-height:1.7;margin:0 0 20px">
              Наша команда рассмотрит её в течение 1–2 рабочих дней и свяжется с вами по этому email.
            </p>
            <div style="background:#0f172a;border-radius:12px;padding:20px;margin-bottom:24px">
              <p style="color:#64748b;font-size:13px;margin:0 0 4px">Ваш аккаунт:</p>
              <p style="color:#f59e0b;font-size:15px;font-weight:600;margin:0">%(email)s</p>
            </div>
            <p style="color:#64748b;font-size:12px;margin:0">
              Войти в личный кабинет: <a href="https://fulfillhub.ru" style="color:#f59e0b;text-decoration:none">fulfillhub.ru</a>
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:16px 32px;border-top:1px solid #334155;text-align:center">
            <p style="color:#475569;font-size:11px;margin:0">© 2026 FulfillHub · %(email)s</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>""" % {'email': email}

def reset_password_html(code: str, email: str) -> str:
    return """<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0f172a;font-family:'Helvetica Neue',Arial,sans-serif">
  <table width="100%%" cellpadding="0" cellspacing="0" style="background:#0f172a;padding:40px 20px">
    <tr><td align="center">
      <table width="480" cellpadding="0" cellspacing="0" style="background:#1e293b;border-radius:16px;overflow:hidden">
        <tr>
          <td style="background:linear-gradient(135deg,#1e3a5f,#0f172a);padding:32px;text-align:center">
            <div style="display:inline-block;background:#f59e0b;border-radius:8px;padding:10px 14px;margin-bottom:16px">
              <span style="color:#0f172a;font-size:20px">🔑</span>
            </div>
            <h1 style="color:#ffffff;font-size:24px;margin:0;font-weight:800">FulfillHub</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:32px">
            <h2 style="color:#ffffff;font-size:20px;margin:0 0 12px">Восстановление пароля</h2>
            <p style="color:#94a3b8;font-size:14px;line-height:1.6;margin:0 0 24px">
              Введите этот код для сброса пароля:
            </p>
            <div style="background:#0f172a;border-radius:12px;padding:24px;text-align:center;margin-bottom:24px">
              <span style="color:#f59e0b;font-size:36px;font-weight:900;letter-spacing:12px;font-family:monospace">%(code)s</span>
            </div>
            <p style="color:#64748b;font-size:12px;margin:0">
              Код действителен 30 минут. Если вы не запрашивали сброс пароля — просто проигнорируйте это письмо.
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:16px 32px;border-top:1px solid #334155;text-align:center">
            <p style="color:#475569;font-size:11px;margin:0">© 2026 FulfillHub · %(email)s</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>""" % {'code': code, 'email': email}

def password_changed_html(email: str) -> str:
    return """<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0f172a;font-family:'Helvetica Neue',Arial,sans-serif">
  <table width="100%%" cellpadding="0" cellspacing="0" style="background:#0f172a;padding:40px 20px">
    <tr><td align="center">
      <table width="480" cellpadding="0" cellspacing="0" style="background:#1e293b;border-radius:16px;overflow:hidden">
        <tr>
          <td style="background:linear-gradient(135deg,#1e3a5f,#0f172a);padding:32px;text-align:center">
            <div style="display:inline-block;background:#f59e0b;border-radius:8px;padding:10px 14px;margin-bottom:16px">
              <span style="color:#0f172a;font-size:20px">🔒</span>
            </div>
            <h1 style="color:#ffffff;font-size:24px;margin:0;font-weight:800">FulfillHub</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:32px">
            <h2 style="color:#ffffff;font-size:20px;margin:0 0 12px">Пароль успешно изменён</h2>
            <p style="color:#94a3b8;font-size:14px;line-height:1.6;margin:0 0 20px">
              Пароль для вашего аккаунта был успешно изменён. Теперь используйте новый пароль для входа.
            </p>
            <div style="background:#0f172a;border-radius:12px;padding:20px;margin-bottom:24px">
              <p style="color:#64748b;font-size:12px;margin:0 0 4px">Аккаунт:</p>
              <p style="color:#f59e0b;font-size:15px;font-weight:600;margin:0;font-family:monospace">%(email)s</p>
            </div>
            <p style="color:#64748b;font-size:12px;margin:0 0 20px">
              Если вы не меняли пароль — немедленно обратитесь в поддержку.
            </p>
            <a href="https://fulfillhub.ru/auth" style="display:block;text-align:center;background:#f59e0b;color:#0f172a;font-weight:700;font-size:14px;padding:12px 24px;border-radius:10px;text-decoration:none">
              Войти в кабинет →
            </a>
          </td>
        </tr>
        <tr>
          <td style="padding:16px 32px;border-top:1px solid #334155;text-align:center">
            <p style="color:#475569;font-size:11px;margin:0">© 2026 FulfillHub · %(email)s</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>""" % {'email': email}

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
            INSERT INTO fulfillments (user_id, contact_email, contact_phone, status)
            VALUES (%d, '%s', '%s', 'draft')
        """ % (user_id, email.replace("'", "''"), phone.replace("'", "''")))

        cur.execute("""
            INSERT INTO owner_profiles (user_id, contact_email, contact_phone)
            VALUES (%d, '%s', '%s')
            ON CONFLICT (user_id) DO NOTHING
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
        try:
            send_email(email, 'Подтвердите email — FulfillHub', verify_email_html(code, email))
            send_email(email, 'Заявка принята — FulfillHub', registration_confirm_html(email))
        except Exception:
            pass
        return resp(201, {
            'token': token,
            'user': {'id': user_id, 'email': email, 'role': 'fulfillment', 'email_verified': False},
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
        user_id, email = user[0], user[1]

        code = gen_code()
        expires = (datetime.utcnow() + timedelta(minutes=30)).strftime('%Y-%m-%d %H:%M:%S')
        cur.execute("""
            INSERT INTO email_codes (user_id, code, purpose, expires_at)
            VALUES (%d, '%s', 'verify', '%s')
        """ % (user_id, code, expires))
        conn.commit()
        try:
            send_email(email, 'Подтвердите email — FulfillHub', verify_email_html(code, email))
        except Exception:
            pass
        return resp(200, {'ok': True})
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

        # Получаем owner_profile (создаём если нет)
        cur.execute("SELECT id, contact_name, contact_email, contact_phone, contact_tg, inn FROM owner_profiles WHERE user_id = %d" % user_id)
        op = cur.fetchone()
        if not op:
            cur.execute("INSERT INTO owner_profiles (user_id, contact_email) VALUES (%d, '%s') ON CONFLICT (user_id) DO NOTHING RETURNING id, contact_name, contact_email, contact_phone, contact_tg, inn" % (user_id, email.replace("'", "''")))
            op = cur.fetchone()
            conn.commit()

        owner_profile = None
        if op:
            owner_profile = {'id': op[0], 'contact_name': op[1], 'contact_email': op[2], 'contact_phone': op[3], 'contact_tg': op[4], 'inn': op[5]}

        # Первый фулфилмент (для обратной совместимости)
        cur.execute("SELECT id, company_name, status FROM fulfillments WHERE user_id = %d ORDER BY created_at ASC LIMIT 1" % user_id)
        ff = cur.fetchone()
        fulfillment = None
        if ff:
            fulfillment = {'id': ff[0], 'company_name': ff[1], 'status': ff[2]}

        return resp(200, {
            'user': {'id': user_id, 'email': email, 'role': role, 'email_verified': verified},
            'owner_profile': owner_profile,
            'fulfillment': fulfillment,
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
            INSERT INTO users (email, password_hash, phone, role, email_verified)
            VALUES ('%s', '%s', '%s', 'fulfillment', TRUE)
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

        cur.execute("""
            INSERT INTO owner_profiles (user_id, contact_name, contact_email, contact_phone, contact_tg, inn)
            VALUES (%d, '%s', '%s', '%s', '%s', '%s')
            ON CONFLICT (user_id) DO NOTHING
        """ % (user_id, name, email.replace("'", "''"), phone.replace("'", "''"), tg, inn))

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
            'user': {'id': user_id, 'email': email, 'role': 'fulfillment', 'email_verified': True},
        })
    except Exception as e:
        conn.rollback()
        return resp(500, {'error': str(e)})
    finally:
        cur.close()
        conn.close()

def handle_telegram_auth(body):
    tg_id     = body.get('id')
    tg_hash   = body.get('hash', '')
    auth_date = body.get('auth_date')

    if not tg_id or not tg_hash or not auth_date:
        return resp(400, {'error': 'Неверные данные от Telegram'})

    # Проверяем свежесть (не старше 10 минут)
    try:
        if abs(datetime.utcnow().timestamp() - int(auth_date)) > 600:
            return resp(400, {'error': 'Данные авторизации устарели, попробуйте снова'})
    except Exception:
        return resp(400, {'error': 'Неверный auth_date'})

    # Верифицируем подпись по алгоритму Telegram
    bot_token = os.environ.get('TELEGRAM_BOT_TOKEN', '')
    secret_key = hashlib.sha256(bot_token.encode()).digest()

    check_fields = {k: v for k, v in body.items() if k != 'hash'}
    data_check_string = '\n'.join(f'{k}={v}' for k, v in sorted(check_fields.items()))
    expected_hash = hmac.new(secret_key, data_check_string.encode(), hashlib.sha256).hexdigest()

    if not hmac.compare_digest(expected_hash, tg_hash):
        return resp(401, {'error': 'Подпись не прошла проверку'})

    # Находим или создаём пользователя по telegram_id
    tg_id_int    = int(tg_id)
    first_name   = str(body.get('first_name', '')).replace("'", "''")
    last_name    = str(body.get('last_name',  '')).replace("'", "''")
    username     = str(body.get('username',   '')).replace("'", "''")
    fake_email   = f"tg_{tg_id}@telegram.local"

    conn = get_db()
    cur  = conn.cursor()
    try:
        cur.execute("SELECT id, email, role, email_verified FROM users WHERE telegram_id = %d" % tg_id_int)
        row = cur.fetchone()

        if row:
            user_id, email, role, verified = row
        else:
            cur.execute("SELECT id FROM users WHERE email = '%s'" % fake_email.replace("'", "''"))
            existing = cur.fetchone()
            if existing:
                user_id = existing[0]
                cur.execute("UPDATE users SET telegram_id = %d WHERE id = %d" % (tg_id_int, user_id))
                cur.execute("SELECT email, role, email_verified FROM users WHERE id = %d" % user_id)
                r = cur.fetchone()
                email, role, verified = r[0], r[1], r[2]
            else:
                display_name = ('%s %s' % (first_name, last_name)).strip().replace("'", "''")
                cur.execute("""
                    INSERT INTO users (email, password_hash, phone, role, email_verified, telegram_id)
                    VALUES ('%s', '', '', 'fulfillment', TRUE, %d)
                    RETURNING id
                """ % (fake_email.replace("'", "''"), tg_id_int))
                user_id = cur.fetchone()[0]
                email   = fake_email
                role    = 'fulfillment'
                verified = True

                cur.execute("""
                    INSERT INTO fulfillments (user_id, contact_email, status)
                    VALUES (%d, '%s', 'draft')
                """ % (user_id, fake_email.replace("'", "''")))

                cur.execute("""
                    INSERT INTO owner_profiles (user_id, contact_name, contact_email, contact_tg)
                    VALUES (%d, '%s', '%s', '%s')
                    ON CONFLICT (user_id) DO NOTHING
                """ % (user_id, display_name, fake_email.replace("'", "''"), username))

        token        = gen_token()
        token_expires = (datetime.utcnow() + timedelta(days=30)).strftime('%Y-%m-%d %H:%M:%S')
        cur.execute("""
            INSERT INTO sessions (user_id, token, expires_at)
            VALUES (%d, '%s', '%s')
        """ % (user_id, token.replace("'", "''"), token_expires))

        conn.commit()
        return resp(200, {
            'token': token,
            'user':  {'id': user_id, 'email': email, 'role': role, 'email_verified': verified},
        })
    except Exception as e:
        conn.rollback()
        return resp(500, {'error': str(e)})
    finally:
        cur.close()
        conn.close()


def handle_link_email(body, token):
    """Привязка email и пароля к аккаунту, созданному через Telegram"""
    if not token:
        return resp(401, {'error': 'Не авторизован'})

    email    = body.get('email', '').strip().lower()
    password = body.get('password', '')

    if not email:
        return resp(400, {'error': 'Введите email'})
    if len(password) < 6:
        return resp(400, {'error': 'Пароль — минимум 6 символов'})

    conn = get_db()
    cur  = conn.cursor()
    try:
        user = get_user_by_token(cur, token)
        if not user:
            return resp(401, {'error': 'Сессия устарела, войдите снова'})
        user_id = user[0]

        # Нельзя привязать email, который уже занят другим пользователем
        cur.execute("SELECT id FROM users WHERE email = '%s' AND id != %d" % (email.replace("'", "''"), user_id))
        if cur.fetchone():
            return resp(409, {'error': 'Этот email уже используется другим аккаунтом'})

        # Проверяем, что у текущего пользователя ещё нет реального email (только tg_xxx@telegram.local)
        cur.execute("SELECT email, password_hash FROM users WHERE id = %d" % user_id)
        row = cur.fetchone()
        if not row:
            return resp(404, {'error': 'Пользователь не найден'})

        current_email, current_pw_hash = row[0], row[1]
        if current_pw_hash:  # уже есть пароль — обновляем email и пароль
            pass  # разрешаем обновление
        
        pw_hash = hash_password(password)
        cur.execute("""
            UPDATE users SET email = '%s', password_hash = '%s', email_verified = TRUE
            WHERE id = %d
        """ % (email.replace("'", "''"), pw_hash.replace("'", "''"), user_id))

        # Обновляем contact_email в профиле если там был фейковый
        if current_email.endswith('@telegram.local'):
            cur.execute("""
                UPDATE owner_profiles SET contact_email = '%s'
                WHERE user_id = %d AND (contact_email = '' OR contact_email LIKE '%%telegram.local')
            """ % (email.replace("'", "''"), user_id))
            cur.execute("""
                UPDATE fulfillments SET contact_email = '%s'
                WHERE user_id = %d AND (contact_email = '' OR contact_email LIKE '%%telegram.local')
            """ % (email.replace("'", "''"), user_id))

        conn.commit()
        return resp(200, {'ok': True, 'email': email})
    except Exception as e:
        conn.rollback()
        return resp(500, {'error': str(e)})
    finally:
        cur.close()
        conn.close()


def handle_forgot_password(body):
    email = body.get('email', '').strip().lower()
    if not email:
        return resp(400, {'error': 'Email обязателен'})

    conn = get_db()
    cur = conn.cursor()
    try:
        cur.execute("SELECT id FROM users WHERE email = '%s'" % email.replace("'", "''"))
        row = cur.fetchone()
        if not row:
            return resp(200, {'ok': True})
        user_id = row[0]

        code = gen_code()
        expires = (datetime.utcnow() + timedelta(minutes=30)).strftime('%Y-%m-%d %H:%M:%S')
        cur.execute("""
            INSERT INTO email_codes (user_id, code, purpose, expires_at)
            VALUES (%d, '%s', 'reset', '%s')
        """ % (user_id, code, expires))
        conn.commit()
        try:
            send_email(email, 'Восстановление пароля — FulfillHub', reset_password_html(code, email))
        except Exception:
            pass
        return resp(200, {'ok': True})
    finally:
        cur.close()
        conn.close()

def handle_reset_password(body):
    email = body.get('email', '').strip().lower()
    code = body.get('code', '').strip()
    new_password = body.get('new_password', '')

    if not email or not code or not new_password:
        return resp(400, {'error': 'Заполните все поля'})
    if len(new_password) < 6:
        return resp(400, {'error': 'Пароль — минимум 6 символов'})

    conn = get_db()
    cur = conn.cursor()
    try:
        cur.execute("SELECT id FROM users WHERE email = '%s'" % email.replace("'", "''"))
        row = cur.fetchone()
        if not row:
            return resp(400, {'error': 'Пользователь не найден'})
        user_id = row[0]

        cur.execute("""
            SELECT id FROM email_codes
            WHERE user_id = %d AND code = '%s' AND purpose = 'reset' AND used = FALSE AND expires_at > NOW()
            ORDER BY created_at DESC LIMIT 1
        """ % (user_id, code.replace("'", "''")))
        ec = cur.fetchone()
        if not ec:
            return resp(400, {'error': 'Неверный или просроченный код'})

        pw_hash = hash_password(new_password)
        cur.execute("UPDATE users SET password_hash = '%s', email_verified = TRUE, updated_at = NOW() WHERE id = %d" % (pw_hash.replace("'", "''"), user_id))
        cur.execute("UPDATE email_codes SET used = TRUE WHERE id = %d" % ec[0])

        token = gen_token()
        token_expires = (datetime.utcnow() + timedelta(days=30)).strftime('%Y-%m-%d %H:%M:%S')
        cur.execute("""
            INSERT INTO sessions (user_id, token, expires_at)
            VALUES (%d, '%s', '%s')
        """ % (user_id, token.replace("'", "''"), token_expires))

        cur.execute("SELECT role, email_verified FROM users WHERE id = %d" % user_id)
        u = cur.fetchone()
        conn.commit()
        return resp(200, {
            'ok': True,
            'token': token,
            'user': {'id': user_id, 'email': email, 'role': u[0], 'email_verified': u[1]},
        })
    except Exception as e:
        conn.rollback()
        return resp(500, {'error': str(e)})
    finally:
        cur.close()
        conn.close()

def handle_support_request(body):
    """Обращение в поддержку — письмо на support@fulfillhub.ru"""
    name = body.get('name', '').strip()
    email = body.get('email', '').strip()
    message = body.get('message', '').strip()
    if not name or not email or not message:
        return resp(400, {'error': 'Заполните все поля'})

    html = """<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:'Helvetica Neue',Arial,sans-serif">
  <table width="100%%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:32px 20px">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0">
        <tr>
          <td style="background:#0f172a;padding:20px 28px">
            <span style="color:#f59e0b;font-size:18px;font-weight:800">FulfillHub</span>
            <span style="color:#64748b;font-size:13px;margin-left:12px">Обращение в поддержку</span>
          </td>
        </tr>
        <tr>
          <td style="padding:28px">
            <table width="100%%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:0 0 16px">
                  <span style="font-size:11px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.05em">Имя</span><br>
                  <span style="font-size:15px;color:#0f172a;font-weight:600">%(name)s</span>
                </td>
              </tr>
              <tr>
                <td style="padding:0 0 16px">
                  <span style="font-size:11px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.05em">Email</span><br>
                  <a href="mailto:%(email)s" style="font-size:15px;color:#2563eb;font-weight:600">%(email)s</a>
                </td>
              </tr>
              <tr>
                <td style="padding:0 0 8px">
                  <span style="font-size:11px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.05em">Сообщение</span>
                </td>
              </tr>
              <tr>
                <td style="background:#f8fafc;border-radius:8px;padding:16px;font-size:14px;color:#334155;line-height:1.6;border:1px solid #e2e8f0">
                  %(message)s
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:16px 28px;border-top:1px solid #e2e8f0;text-align:center">
            <span style="color:#94a3b8;font-size:11px">© 2026 FulfillHub</span>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>""" % {'name': name, 'email': email, 'message': message.replace('\n', '<br>')}

    try:
        send_email('support@fulfillhub.ru', 'Обращение в поддержку от %s' % name, html)
    except Exception as e:
        return resp(500, {'error': 'Не удалось отправить сообщение. Попробуйте позже.'})

    return resp(200, {'ok': True})

def handle_change_password(body, token):
    """Смена пароля авторизованным пользователем"""
    if not token:
        return resp(401, {'error': 'Не авторизован'})

    current_password = body.get('current_password', '')
    new_password = body.get('new_password', '')

    if not current_password or not new_password:
        return resp(400, {'error': 'Заполните все поля'})
    if len(new_password) < 6:
        return resp(400, {'error': 'Новый пароль — минимум 6 символов'})
    if current_password == new_password:
        return resp(400, {'error': 'Новый пароль должен отличаться от текущего'})

    conn = get_db()
    cur = conn.cursor()
    try:
        user = get_user_by_token(cur, token)
        if not user:
            return resp(401, {'error': 'Не авторизован'})
        user_id, email = user[0], user[1]

        cur.execute("SELECT password_hash FROM users WHERE id = %d" % user_id)
        row = cur.fetchone()
        if not row or not row[0]:
            return resp(400, {'error': 'Невозможно сменить пароль для этого аккаунта'})

        if not check_password(current_password, row[0]):
            return resp(400, {'error': 'Текущий пароль указан неверно'})

        new_hash = hash_password(new_password)
        cur.execute("UPDATE users SET password_hash = '%s', updated_at = NOW() WHERE id = %d" % (new_hash.replace("'", "''"), user_id))
        conn.commit()

        try:
            send_email(email, 'Пароль успешно изменён — FulfillHub', password_changed_html(email))
        except Exception:
            pass

        return resp(200, {'ok': True})
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
        if path == 'telegram':
            return handle_telegram_auth(body)
        if path == 'link-email':
            return handle_link_email(body, token)
        if path == 'forgot-password':
            return handle_forgot_password(body)
        if path == 'reset-password':
            return handle_reset_password(body)
        if path == 'change-password':
            return handle_change_password(body, token)
        if path == 'support':
            return handle_support_request(body)

    if method == 'GET':
        if path == 'me':
            return handle_me(token)

    return resp(404, {'error': 'Неизвестный маршрут'})