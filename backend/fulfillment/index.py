"""CRUD профиля владельца фулфилмента, управление несколькими фулфилментами, фото, модерация, КП"""
import json
import os
import base64
import uuid
import urllib.request
import urllib.parse
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import psycopg2
import boto3

CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Auth-Token, X-Authorization',
    'Access-Control-Max-Age': '86400',
}

def get_db():
    return psycopg2.connect(os.environ['DATABASE_URL'])

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

def seller_welcome_html(email: str, password: str, name: str) -> str:
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
            <h2 style="color:#ffffff;font-size:20px;margin:0 0 8px">Добро пожаловать, %(name)s!</h2>
            <p style="color:#94a3b8;font-size:14px;line-height:1.6;margin:0 0 24px">
              Вы отправили запрос коммерческого предложения на FulfillHub. Для вас автоматически создан личный кабинет — в нём вы сможете отслеживать статусы своих заявок.
            </p>
            <div style="background:#0f172a;border-radius:12px;padding:20px;margin-bottom:20px">
              <p style="color:#64748b;font-size:12px;margin:0 0 12px;text-transform:uppercase;letter-spacing:0.05em">Данные для входа</p>
              <div style="margin-bottom:10px">
                <p style="color:#64748b;font-size:12px;margin:0 0 2px">Логин (email):</p>
                <p style="color:#f59e0b;font-size:15px;font-weight:600;margin:0;font-family:monospace">%(email)s</p>
              </div>
              <div>
                <p style="color:#64748b;font-size:12px;margin:0 0 2px">Временный пароль:</p>
                <p style="color:#f59e0b;font-size:15px;font-weight:600;margin:0;font-family:monospace">%(password)s</p>
              </div>
            </div>
            <p style="color:#94a3b8;font-size:13px;margin:0 0 20px">
              Рекомендуем сменить пароль после первого входа.
            </p>
            <a href="https://fulfillhub.ru/auth" style="display:block;text-align:center;background:#f59e0b;color:#0f172a;font-weight:700;font-size:14px;padding:12px 24px;border-radius:10px;text-decoration:none">
              Войти в личный кабинет →
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
</html>""" % {'email': email, 'password': password, 'name': name or email}

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
              Спасибо за регистрацию на платформе FulfillHub. Ваша заявка на размещение фулфилмента получена и передана на проверку.
            </p>
            <p style="color:#94a3b8;font-size:15px;line-height:1.7;margin:0 0 20px">
              Наша команда рассмотрит её в течение 1-2 рабочих дней и свяжется с вами по этому email.
            </p>
            <div style="background:#0f172a;border-radius:12px;padding:20px;margin-bottom:24px">
              <p style="color:#64748b;font-size:13px;margin:0 0 4px">Ваш аккаунт:</p>
              <p style="color:#f59e0b;font-size:15px;font-weight:600;margin:0">%s</p>
            </div>
            <p style="color:#64748b;font-size:12px;margin:0">
              Войти в личный кабинет можно на <a href="https://fulfillhub.ru" style="color:#f59e0b;text-decoration:none">fulfillhub.ru</a>
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:16px 32px;border-top:1px solid #334155;text-align:center">
            <p style="color:#475569;font-size:11px;margin:0">© 2026 FulfillHub · %s</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>""" % (email, email)

def resp(status, body):
    return {'statusCode': status, 'headers': {**CORS_HEADERS, 'Content-Type': 'application/json'}, 'body': json.dumps(body, default=str)}

def get_user_by_token(cur, token):
    cur.execute("SELECT u.id, u.email, u.role, u.email_verified FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token = '%s' AND s.expires_at > NOW()" % token.replace("'", "''"))
    return cur.fetchone()

def get_s3():
    return boto3.client('s3',
        endpoint_url='https://bucket.poehali.dev',
        aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'])

def cdn_url(key):
    return "https://cdn.poehali.dev/projects/%s/bucket/%s" % (os.environ['AWS_ACCESS_KEY_ID'], key)

# ─── OWNER PROFILE ───────────────────────────────────────────────────────────

def handle_get_owner_profile(token):
    conn = get_db()
    cur = conn.cursor()
    try:
        user = get_user_by_token(cur, token)
        if not user:
            return resp(401, {'error': 'Не авторизован'})
        user_id = user[0]

        cur.execute("""
            SELECT id, contact_name, contact_email, contact_phone, contact_tg, inn, created_at
            FROM owner_profiles WHERE user_id = %d
        """ % user_id)
        row = cur.fetchone()
        if not row:
            return resp(200, {'profile': None})

        profile = {
            'id': row[0],
            'contact_name': row[1],
            'contact_email': row[2],
            'contact_phone': row[3],
            'contact_tg': row[4],
            'inn': row[5],
            'created_at': str(row[6]),
        }
        return resp(200, {'profile': profile})
    finally:
        cur.close()
        conn.close()

def handle_update_owner_profile(body, token):
    conn = get_db()
    cur = conn.cursor()
    try:
        user = get_user_by_token(cur, token)
        if not user:
            return resp(401, {'error': 'Не авторизован'})
        user_id = user[0]

        fields = ['contact_name', 'contact_email', 'contact_phone', 'contact_tg', 'inn']
        vals = {}
        for f in fields:
            if f in body:
                vals[f] = str(body[f]).replace("'", "''")

        cur.execute("SELECT id FROM owner_profiles WHERE user_id = %d" % user_id)
        existing = cur.fetchone()

        if existing:
            if vals:
                sets = ', '.join("%s = '%s'" % (k, v) for k, v in vals.items())
                cur.execute("UPDATE owner_profiles SET %s, updated_at = NOW() WHERE user_id = %d" % (sets, user_id))
        else:
            cols = list(vals.keys()) + ['user_id']
            vs = ["'%s'" % vals[k] for k in list(vals.keys())] + [str(user_id)]
            cur.execute("INSERT INTO owner_profiles (%s) VALUES (%s)" % (', '.join(cols), ', '.join(vs)))

        conn.commit()

        cur.execute("SELECT id, contact_name, contact_email, contact_phone, contact_tg, inn, created_at FROM owner_profiles WHERE user_id = %d" % user_id)
        row = cur.fetchone()
        profile = {
            'id': row[0], 'contact_name': row[1], 'contact_email': row[2],
            'contact_phone': row[3], 'contact_tg': row[4], 'inn': row[5], 'created_at': str(row[6]),
        }
        return resp(200, {'ok': True, 'profile': profile})
    except Exception as e:
        conn.rollback()
        return resp(500, {'error': str(e)})
    finally:
        cur.close()
        conn.close()

# ─── MULTI-FULFILLMENT ───────────────────────────────────────────────────────

FULFILLMENT_COLS = [
    'id', 'company_name', 'inn', 'city', 'address', 'warehouse_area', 'founded_year', 'description',
    'detailed_description', 'logo', 'photos', 'work_schemes', 'features', 'packaging_types',
    'marketplaces', 'storage_price', 'assembly_price', 'delivery_price',
    'storage_rate', 'assembly_rate', 'delivery_rate',
    'min_volume', 'has_trial', 'team_size', 'working_hours', 'certificates', 'services',
    'badge', 'badge_color', 'rating', 'reviews_count', 'status', 'moderation_comment',
    'specializations', 'created_at', 'updated_at',
]

def row_to_fulfillment(row):
    item = {}
    for i, c in enumerate(FULFILLMENT_COLS):
        v = row[i]
        if c in ('storage_rate', 'assembly_rate', 'delivery_rate', 'rating'):
            v = float(v) if v else 0
        item[c] = v
    return item

def handle_list_my_fulfillments(token):
    conn = get_db()
    cur = conn.cursor()
    try:
        user = get_user_by_token(cur, token)
        if not user:
            return resp(401, {'error': 'Не авторизован'})
        user_id = user[0]

        cur.execute("""
            SELECT %s FROM fulfillments WHERE user_id = %d ORDER BY created_at ASC
        """ % (', '.join(FULFILLMENT_COLS), user_id))
        rows = cur.fetchall()
        return resp(200, {'fulfillments': [row_to_fulfillment(r) for r in rows]})
    finally:
        cur.close()
        conn.close()

def handle_get_fulfillment(token, fid):
    conn = get_db()
    cur = conn.cursor()
    try:
        user = get_user_by_token(cur, token)
        if not user:
            return resp(401, {'error': 'Не авторизован'})
        user_id = user[0]

        cur.execute("""
            SELECT %s FROM fulfillments WHERE id = %d AND user_id = %d
        """ % (', '.join(FULFILLMENT_COLS), int(fid), user_id))
        row = cur.fetchone()
        if not row:
            return resp(404, {'error': 'Фулфилмент не найден'})
        return resp(200, {'fulfillment': row_to_fulfillment(row)})
    finally:
        cur.close()
        conn.close()

def handle_create_fulfillment(body, token):
    conn = get_db()
    cur = conn.cursor()
    try:
        user = get_user_by_token(cur, token)
        if not user:
            return resp(401, {'error': 'Не авторизован'})
        user_id = user[0]

        name = str(body.get('company_name', 'Новый фулфилмент')).replace("'", "''")
        cur.execute("""
            INSERT INTO fulfillments (user_id, company_name, status)
            VALUES (%d, '%s', 'draft')
            RETURNING id
        """ % (user_id, name))
        new_id = cur.fetchone()[0]

        # Связываем с owner_profile
        cur.execute("SELECT id FROM owner_profiles WHERE user_id = %d" % user_id)
        op = cur.fetchone()
        if op:
            cur.execute("UPDATE fulfillments SET owner_profile_id = %d WHERE id = %d" % (op[0], new_id))

        conn.commit()
        return resp(201, {'ok': True, 'id': new_id})
    except Exception as e:
        conn.rollback()
        return resp(500, {'error': str(e)})
    finally:
        cur.close()
        conn.close()

def handle_update_fulfillment(body, token):
    conn = get_db()
    cur = conn.cursor()
    try:
        user = get_user_by_token(cur, token)
        if not user:
            return resp(401, {'error': 'Не авторизован'})
        user_id = user[0]

        fid = body.get('id')
        if not fid:
            return resp(400, {'error': 'id обязателен'})

        cur.execute("SELECT id, status FROM fulfillments WHERE id = %d AND user_id = %d" % (int(fid), user_id))
        existing = cur.fetchone()
        if not existing:
            return resp(404, {'error': 'Фулфилмент не найден'})

        allowed = ['company_name', 'city', 'address', 'warehouse_area', 'founded_year', 'description',
                    'detailed_description', 'logo',
                    'storage_price', 'assembly_price', 'delivery_price', 'storage_rate', 'assembly_rate', 'delivery_rate',
                    'min_volume', 'has_trial', 'team_size', 'working_hours']
        array_fields = ['work_schemes', 'features', 'packaging_types', 'marketplaces', 'certificates', 'photos', 'specializations']
        json_fields = ['services']

        numeric_fields = {'warehouse_area', 'founded_year', 'storage_price', 'assembly_price',
                          'delivery_price', 'storage_rate', 'assembly_rate', 'delivery_rate',
                          'min_volume', 'team_size'}

        updates = []
        for k in allowed:
            if k in body:
                v = body[k]
                if v is None:
                    if k in numeric_fields:
                        updates.append("%s = NULL" % k)
                    # для строковых None просто пропускаем
                elif isinstance(v, bool):
                    updates.append("%s = %s" % (k, 'TRUE' if v else 'FALSE'))
                elif isinstance(v, (int, float)):
                    updates.append("%s = %s" % (k, v))
                else:
                    updates.append("%s = '%s'" % (k, str(v).replace("'", "''")))

        for k in array_fields:
            if k in body:
                arr = body[k]
                if not arr:
                    updates.append("%s = '{}'" % k)
                else:
                    escaped = ','.join('"' + str(x).replace('"', '\\"') + '"' for x in arr)
                    updates.append("%s = '{%s}'" % (k, escaped))

        for k in json_fields:
            if k in body:
                updates.append("%s = '%s'" % (k, json.dumps(body[k]).replace("'", "''")))

        if not updates:
            return resp(400, {'error': 'Нечего обновлять'})

        updates.append("updated_at = NOW()")
        cur.execute("UPDATE fulfillments SET %s WHERE id = %d AND user_id = %d" % (', '.join(updates), int(fid), user_id))
        conn.commit()
        return resp(200, {'ok': True})
    except Exception as e:
        conn.rollback()
        return resp(500, {'error': str(e)})
    finally:
        cur.close()
        conn.close()

def handle_submit_fulfillment_for_moderation(body, token):
    conn = get_db()
    cur = conn.cursor()
    try:
        user = get_user_by_token(cur, token)
        if not user:
            return resp(401, {'error': 'Не авторизован'})
        user_id = user[0]

        fid = body.get('id')
        if not fid:
            return resp(400, {'error': 'id обязателен'})

        cur.execute("""
            SELECT company_name, city, description
            FROM fulfillments WHERE id = %d AND user_id = %d
        """ % (int(fid), user_id))
        row = cur.fetchone()
        if not row:
            return resp(404, {'error': 'Фулфилмент не найден'})
        if not row[0] or not row[1] or not row[2]:
            return resp(400, {'error': 'Заполните: название, город, описание'})

        cur.execute("UPDATE fulfillments SET status = 'pending', moderation_comment = '', updated_at = NOW() WHERE id = %d AND user_id = %d" % (int(fid), user_id))
        conn.commit()
        return resp(200, {'ok': True, 'status': 'pending'})
    except Exception as e:
        conn.rollback()
        return resp(500, {'error': str(e)})
    finally:
        cur.close()
        conn.close()

def handle_close_fulfillment(body, token):
    conn = get_db()
    cur = conn.cursor()
    try:
        user = get_user_by_token(cur, token)
        if not user:
            return resp(401, {'error': 'Не авторизован'})
        user_id = user[0]

        fid = body.get('id')
        if not fid:
            return resp(400, {'error': 'id обязателен'})

        cur.execute("UPDATE fulfillments SET status = 'closed', updated_at = NOW() WHERE id = %d AND user_id = %d" % (int(fid), user_id))
        conn.commit()
        return resp(200, {'ok': True})
    except Exception as e:
        conn.rollback()
        return resp(500, {'error': str(e)})
    finally:
        cur.close()
        conn.close()

# ─── LEGACY: single profile (обратная совместимость) ─────────────────────────

def handle_get_profile(token):
    conn = get_db()
    cur = conn.cursor()
    try:
        user = get_user_by_token(cur, token)
        if not user:
            return resp(401, {'error': 'Не авторизован'})
        user_id = user[0]

        cur.execute("""
            SELECT %s FROM fulfillments WHERE user_id = %d ORDER BY created_at ASC LIMIT 1
        """ % (', '.join(FULFILLMENT_COLS), user_id))
        row = cur.fetchone()
        if not row:
            return resp(404, {'error': 'Профиль не найден'})

        return resp(200, {'profile': row_to_fulfillment(row)})
    finally:
        cur.close()
        conn.close()

def handle_update_profile(body, token):
    """Обратная совместимость — обновляет первый фулфилмент пользователя"""
    conn = get_db()
    cur = conn.cursor()
    try:
        user = get_user_by_token(cur, token)
        if not user:
            return resp(401, {'error': 'Не авторизован'})
        user_id = user[0]

        cur.execute("SELECT id FROM fulfillments WHERE user_id = %d ORDER BY created_at ASC LIMIT 1" % user_id)
        row = cur.fetchone()
        if not row:
            cur.execute("INSERT INTO fulfillments (user_id, company_name, status) VALUES (%d, '', 'draft') RETURNING id" % user_id)
            fid = cur.fetchone()[0]
        else:
            fid = row[0]

        body['id'] = fid
        conn.commit()
        return handle_update_fulfillment(body, token)
    except Exception as e:
        conn.rollback()
        return resp(500, {'error': str(e)})
    finally:
        cur.close()
        conn.close()

def handle_submit_for_moderation(token):
    """Обратная совместимость"""
    conn = get_db()
    cur = conn.cursor()
    try:
        user = get_user_by_token(cur, token)
        if not user:
            return resp(401, {'error': 'Не авторизован'})
        user_id = user[0]

        cur.execute("SELECT id FROM fulfillments WHERE user_id = %d ORDER BY created_at ASC LIMIT 1" % user_id)
        row = cur.fetchone()
        if not row:
            return resp(404, {'error': 'Профиль не найден'})

        return handle_submit_fulfillment_for_moderation({'id': row[0]}, token)
    except Exception as e:
        return resp(500, {'error': str(e)})
    finally:
        cur.close()
        conn.close()

# ─── PHOTOS ──────────────────────────────────────────────────────────────────

def handle_upload_photo(body, token):
    conn = get_db()
    cur = conn.cursor()
    try:
        user = get_user_by_token(cur, token)
        if not user:
            return resp(401, {'error': 'Не авторизован'})
        user_id = user[0]

        data_b64 = body.get('data', '')
        content_type = body.get('content_type', 'image/jpeg')
        if not data_b64:
            return resp(400, {'error': 'Нет данных'})

        img_data = base64.b64decode(data_b64)
        ext = 'jpg' if 'jpeg' in content_type or 'jpg' in content_type else 'png'
        key = "fulfillment/%d/%s.%s" % (user_id, uuid.uuid4().hex[:12], ext)

        s3 = get_s3()
        s3.put_object(Bucket='files', Key=key, Body=img_data, ContentType=content_type)
        url = cdn_url(key)

        return resp(200, {'url': url})
    except Exception as e:
        return resp(500, {'error': str(e)})
    finally:
        cur.close()
        conn.close()

# ─── PUBLIC ──────────────────────────────────────────────────────────────────

def handle_list_approved():
    conn = get_db()
    cur = conn.cursor()
    try:
        cur.execute("""
            SELECT id, company_name, city, address, warehouse_area, founded_year, description,
                detailed_description, logo, photos, contact_name,
                work_schemes, features, packaging_types, marketplaces,
                storage_price, assembly_price, delivery_price, storage_rate, assembly_rate, delivery_rate,
                min_volume, team_size, working_hours, certificates, services,
                badge, badge_color, rating, reviews_count, specializations
            FROM fulfillments WHERE status IN ('approved', 'active')
            ORDER BY rating DESC, reviews_count DESC
        """)
        rows = cur.fetchall()
        cols = ['id', 'company_name', 'city', 'address', 'warehouse_area', 'founded_year', 'description',
                'detailed_description', 'logo', 'photos', 'contact_name',
                'work_schemes', 'features', 'packaging_types', 'marketplaces',
                'storage_price', 'assembly_price', 'delivery_price', 'storage_rate', 'assembly_rate', 'delivery_rate',
                'min_volume', 'team_size', 'working_hours', 'certificates', 'services',
                'badge', 'badge_color', 'rating', 'reviews_count', 'specializations']
        result = []
        for row in rows:
            item = {}
            for i, c in enumerate(cols):
                v = row[i]
                if c in ('storage_rate', 'assembly_rate', 'delivery_rate', 'rating'):
                    v = float(v) if v else 0
                item[c] = v
            result.append(item)
        return resp(200, {'fulfillments': result})
    finally:
        cur.close()
        conn.close()

def handle_list_demo(params: dict):
    token = params.get('token', '')
    expected = os.environ.get('DEMO_ACCESS_TOKEN', '')
    if not expected or token != expected:
        return resp(403, {'error': 'Доступ запрещён'})
    conn = get_db()
    cur = conn.cursor()
    try:
        cur.execute("""
            SELECT id, company_name, city, address, warehouse_area, founded_year, description,
                detailed_description, logo, photos, contact_name,
                work_schemes, features, packaging_types, marketplaces,
                storage_price, assembly_price, delivery_price, storage_rate, assembly_rate, delivery_rate,
                min_volume, team_size, working_hours, certificates, services,
                badge, badge_color, rating, reviews_count, specializations
            FROM fulfillments WHERE status = 'demo'
            ORDER BY rating DESC, reviews_count DESC
        """)
        rows = cur.fetchall()
        cols = ['id', 'company_name', 'city', 'address', 'warehouse_area', 'founded_year', 'description',
                'detailed_description', 'logo', 'photos', 'contact_name',
                'work_schemes', 'features', 'packaging_types', 'marketplaces',
                'storage_price', 'assembly_price', 'delivery_price', 'storage_rate', 'assembly_rate', 'delivery_rate',
                'min_volume', 'team_size', 'working_hours', 'certificates', 'services',
                'badge', 'badge_color', 'rating', 'reviews_count', 'specializations']
        result = []
        for row in rows:
            item = {}
            for i, c in enumerate(cols):
                v = row[i]
                if c in ('storage_rate', 'assembly_rate', 'delivery_rate', 'rating'):
                    v = float(v) if v else 0
                item[c] = v
            result.append(item)
        return resp(200, {'fulfillments': result})
    finally:
        cur.close()
        conn.close()

# ─── QUOTES ──────────────────────────────────────────────────────────────────

def ensure_seller(cur, name, email, phone, company):
    """Находит или создаёт пользователя-селлера. Возвращает (user_id, temp_pw|None). Raises ValueError при конфликте ролей."""
    import secrets, hashlib
    email_esc = email.replace("'", "''")
    cur.execute("SELECT id, role FROM users WHERE email = '%s'" % email_esc)
    row = cur.fetchone()
    temp_pw = None
    if row:
        user_id, role = row
        if role == 'fulfillment':
            raise ValueError('Этот email зарегистрирован как аккаунт фулфилмента. Используйте другой email для запроса КП.')
    else:
        temp_pw = secrets.token_urlsafe(10)
        salt = secrets.token_hex(16)
        h = hashlib.pbkdf2_hmac('sha256', temp_pw.encode(), salt.encode(), 100000).hex()
        pw_hash = "%s:%s" % (salt, h)
        cur.execute("""
            INSERT INTO users (email, password_hash, role, email_verified)
            VALUES ('%s', '%s', 'seller', TRUE)
            RETURNING id
        """ % (email_esc, pw_hash.replace("'", "''")))
        user_id = cur.fetchone()[0]

    name_esc = name.replace("'", "''")
    company_esc = company.replace("'", "''")
    phone_esc = phone.replace("'", "''")
    cur.execute("""
        INSERT INTO sellers (user_id, name, company, phone)
        VALUES (%d, '%s', '%s', '%s')
        ON CONFLICT (user_id) DO UPDATE SET name = EXCLUDED.name, company = EXCLUDED.company, phone = EXCLUDED.phone, updated_at = NOW()
    """ % (user_id, name_esc, company_esc, phone_esc))
    return user_id, temp_pw

def handle_send_quote(body):
    fulfillment_id = body.get('fulfillment_id')
    name = body.get('name', '').strip()
    email = body.get('email', '').strip()
    phone = body.get('phone', '').strip()
    if not fulfillment_id or not name or not email or not phone:
        return resp(400, {'error': 'Обязательные поля: fulfillment_id, name, email, phone'})

    conn = get_db()
    cur = conn.cursor()
    try:
        cur.execute("SELECT id, lead_price, status FROM fulfillments WHERE id = %d" % int(fulfillment_id))
        ff = cur.fetchone()
        if not ff:
            return resp(404, {'error': 'Фулфилмент не найден'})
        if ff[2] not in ('approved', 'active'):
            return resp(403, {'error': 'Фулфилмент недоступен'})
        lead_price = float(ff[1] or 0)

        company = body.get('company', '').replace("'", "''")
        msg = body.get('message', '').replace("'", "''")
        sku = int(body.get('sku_count', 0) or 0)
        orders = int(body.get('orders_count', 0) or 0)

        # Авторегистрация / поиск селлера
        seller_user_id, temp_pw = ensure_seller(cur, name, email, phone, body.get('company', ''))

        cur.execute("""
            INSERT INTO quote_requests (fulfillment_id, seller_id, sender_name, sender_company, sender_email, sender_phone, sku_count, orders_count, message, lead_price)
            VALUES (%d, %d, '%s', '%s', '%s', '%s', %d, %d, '%s', %s)
            RETURNING id
        """ % (int(fulfillment_id), seller_user_id, name.replace("'", "''"), company, email.replace("'", "''"), phone.replace("'", "''"), sku, orders, msg, lead_price))
        qid = cur.fetchone()[0]

        cur.execute("""
            UPDATE fulfillments
            SET total_leads = COALESCE(total_leads, 0) + 1,
                balance = COALESCE(balance, 0) - %s
            WHERE id = %d
        """ % (lead_price, int(fulfillment_id)))

        conn.commit()

        if temp_pw:
            try:
                send_email(email, 'Добро пожаловать на FulfillHub!', seller_welcome_html(email, temp_pw, name))
            except Exception:
                pass

        return resp(201, {'ok': True, 'id': qid, 'lead_price': lead_price})
    except ValueError as e:
        conn.rollback()
        return resp(400, {'error': str(e)})
    except Exception as e:
        conn.rollback()
        return resp(500, {'error': str(e)})
    finally:
        cur.close()
        conn.close()


def handle_view_quote(body, token):
    """Фулфилмент отмечает заявку как просмотренную"""
    conn = get_db()
    cur = conn.cursor()
    try:
        user = get_user_by_token(cur, token)
        if not user:
            return resp(401, {'error': 'Не авторизован'})
        user_id = user[0]
        qid = body.get('quote_id')
        if not qid:
            return resp(400, {'error': 'quote_id обязателен'})

        cur.execute("""
            UPDATE quote_requests SET viewed_by_fulfillment = TRUE
            WHERE id = %d AND fulfillment_id IN (SELECT id FROM fulfillments WHERE user_id = %d)
        """ % (int(qid), user_id))
        conn.commit()
        return resp(200, {'ok': True})
    finally:
        cur.close()
        conn.close()


def handle_seller_quotes(token):
    """Заявки КП для кабинета селлера"""
    conn = get_db()
    cur = conn.cursor()
    try:
        user = get_user_by_token(cur, token)
        if not user:
            return resp(401, {'error': 'Не авторизован'})
        user_id = user[0]

        cur.execute("""
            SELECT q.id, q.fulfillment_id, f.company_name as fulfillment_name,
                q.status, q.viewed_by_fulfillment,
                q.sku_count, q.orders_count, q.message, q.created_at,
                q.sender_name, q.sender_email, q.sender_phone, q.sender_company
            FROM quote_requests q
            JOIN fulfillments f ON f.id = q.fulfillment_id
            WHERE q.seller_id = %d
            ORDER BY q.created_at DESC
        """ % user_id)
        rows = cur.fetchall()
        cols = ['id', 'fulfillment_id', 'fulfillment_name', 'status', 'viewed_by_fulfillment',
                'sku_count', 'orders_count', 'message', 'created_at',
                'sender_name', 'sender_email', 'sender_phone', 'sender_company']

        result = []
        for r in rows:
            item = dict(zip(cols, r))
            # Статус для селлера: new/viewed/answered
            if item['status'] == 'answered':
                item['seller_status'] = 'answered'
            elif item['viewed_by_fulfillment']:
                item['seller_status'] = 'viewed'
            else:
                item['seller_status'] = 'new'
            result.append(item)

        return resp(200, {'quotes': result})
    finally:
        cur.close()
        conn.close()

def handle_my_quotes(token):
    conn = get_db()
    cur = conn.cursor()
    try:
        user = get_user_by_token(cur, token)
        if not user:
            return resp(401, {'error': 'Не авторизован'})
        user_id = user[0]

        cur.execute("""
            SELECT q.id, q.sender_name, q.sender_company, q.sender_email, q.sender_phone,
                q.sku_count, q.orders_count, q.message, q.status, q.created_at,
                f.company_name as fulfillment_name, f.id as fulfillment_id,
                q.viewed_by_fulfillment
            FROM quote_requests q
            JOIN fulfillments f ON f.id = q.fulfillment_id
            WHERE f.user_id = %d
            ORDER BY q.created_at DESC
        """ % user_id)
        rows = cur.fetchall()
        cols = ['id', 'sender_name', 'sender_company', 'sender_email', 'sender_phone',
                'sku_count', 'orders_count', 'message', 'status', 'created_at', 'fulfillment_name', 'fulfillment_id',
                'viewed_by_fulfillment']
        return resp(200, {'quotes': [dict(zip(cols, r)) for r in rows]})
    finally:
        cur.close()
        conn.close()

def handle_update_quote_status(body, token):
    conn = get_db()
    cur = conn.cursor()
    try:
        user = get_user_by_token(cur, token)
        if not user:
            return resp(401, {'error': 'Не авторизован'})
        user_id = user[0]
        qid = body.get('quote_id')
        new_status = body.get('status', '')
        if not qid or new_status not in ('new', 'in_progress', 'answered', 'closed'):
            return resp(400, {'error': 'quote_id и status обязательны'})

        cur.execute("""
            UPDATE quote_requests SET status = '%s', viewed_by_fulfillment = TRUE
            WHERE id = %d AND fulfillment_id IN (SELECT id FROM fulfillments WHERE user_id = %d)
        """ % (new_status, int(qid), user_id))
        conn.commit()
        return resp(200, {'ok': True})
    finally:
        cur.close()
        conn.close()

# ─── ADMIN ───────────────────────────────────────────────────────────────────

def handle_admin_list(token, params):
    conn = get_db()
    cur = conn.cursor()
    try:
        user = get_user_by_token(cur, token)
        if not user or user[2] != 'admin':
            return resp(403, {'error': 'Доступ запрещён'})

        status_filter = params.get('status', '') if params else ''
        where = ""
        if status_filter:
            where = "WHERE f.status = '%s'" % status_filter.replace("'", "''")

        cur.execute("""
            SELECT f.id, f.company_name, f.city, f.contact_email, f.contact_phone, f.status, f.created_at,
                   u.email, u.email_verified, f.lead_price, f.total_leads, f.balance
            FROM fulfillments f JOIN users u ON u.id = f.user_id
            %s ORDER BY f.created_at DESC
        """ % where)
        rows = cur.fetchall()
        cols = ['id', 'company_name', 'city', 'contact_email', 'contact_phone', 'status', 'created_at', 'user_email', 'email_verified', 'lead_price', 'total_leads', 'balance']
        result = []
        for r in rows:
            item = dict(zip(cols, r))
            for k in ('lead_price', 'balance'):
                item[k] = float(item[k] or 0)
            result.append(item)
        return resp(200, {'fulfillments': result})
    finally:
        cur.close()
        conn.close()

def handle_admin_moderate(body, token):
    conn = get_db()
    cur = conn.cursor()
    try:
        user = get_user_by_token(cur, token)
        if not user or user[2] != 'admin':
            return resp(403, {'error': 'Доступ запрещён'})

        fid = body.get('fulfillment_id')
        new_status = body.get('status')
        comment = body.get('comment', '').replace("'", "''")
        if not fid or new_status not in ('approved', 'rejected', 'pending'):
            return resp(400, {'error': 'fulfillment_id и status обязательны'})

        cur.execute("""
            UPDATE fulfillments SET status = '%s', moderation_comment = '%s', updated_at = NOW()
            WHERE id = %d
        """ % (new_status, comment, int(fid)))
        conn.commit()
        return resp(200, {'ok': True})
    finally:
        cur.close()
        conn.close()

def handle_admin_all_quotes(token):
    conn = get_db()
    cur = conn.cursor()
    try:
        user = get_user_by_token(cur, token)
        if not user or user[2] != 'admin':
            return resp(403, {'error': 'Доступ запрещён'})

        cur.execute("""
            SELECT q.id, q.sender_name, q.sender_company, q.sender_email, q.sender_phone,
                q.sku_count, q.orders_count, q.message, q.status, q.created_at,
                f.company_name as fulfillment_name, q.lead_price, q.payment_status
            FROM quote_requests q
            JOIN fulfillments f ON f.id = q.fulfillment_id
            ORDER BY q.created_at DESC
        """)
        rows = cur.fetchall()
        cols = ['id', 'sender_name', 'sender_company', 'sender_email', 'sender_phone',
                'sku_count', 'orders_count', 'message', 'status', 'created_at', 'fulfillment_name', 'lead_price', 'payment_status']
        result = []
        total_revenue = 0
        unpaid_revenue = 0
        for r in rows:
            item = dict(zip(cols, r))
            item['lead_price'] = float(item['lead_price'] or 0)
            total_revenue += item['lead_price']
            if item['payment_status'] == 'unpaid':
                unpaid_revenue += item['lead_price']
            result.append(item)
        return resp(200, {
            'quotes': result,
            'stats': {
                'total_leads': len(result),
                'total_revenue': total_revenue,
                'unpaid_revenue': unpaid_revenue,
                'paid_revenue': total_revenue - unpaid_revenue,
            }
        })
    finally:
        cur.close()
        conn.close()

def handle_admin_set_lead_price(body, token):
    conn = get_db()
    cur = conn.cursor()
    try:
        user = get_user_by_token(cur, token)
        if not user or user[2] != 'admin':
            return resp(403, {'error': 'Доступ запрещён'})

        fid = body.get('fulfillment_id')
        price = body.get('lead_price')
        if not fid or price is None:
            return resp(400, {'error': 'fulfillment_id и lead_price обязательны'})

        cur.execute("UPDATE fulfillments SET lead_price = %s WHERE id = %d" % (float(price), int(fid)))
        conn.commit()
        return resp(200, {'ok': True})
    finally:
        cur.close()
        conn.close()

def handle_admin_mark_paid(body, token):
    conn = get_db()
    cur = conn.cursor()
    try:
        user = get_user_by_token(cur, token)
        if not user or user[2] != 'admin':
            return resp(403, {'error': 'Доступ запрещён'})

        qid = body.get('quote_id')
        if not qid:
            return resp(400, {'error': 'quote_id обязателен'})

        cur.execute("SELECT fulfillment_id, lead_price FROM quote_requests WHERE id = %d AND payment_status = 'unpaid'" % int(qid))
        row = cur.fetchone()
        if row:
            cur.execute("UPDATE fulfillments SET balance = COALESCE(balance, 0) + %s WHERE id = %d" % (float(row[1] or 0), int(row[0])))
        cur.execute("UPDATE quote_requests SET payment_status = 'paid' WHERE id = %d" % int(qid))
        conn.commit()
        return resp(200, {'ok': True})
    finally:
        cur.close()
        conn.close()

# ─── GEOCODE ─────────────────────────────────────────────────────────────────

def handle_geocode(params):
    """Геокодирование адреса через HTTP Geocoder Яндекса (серверный вызов)"""
    address = (params.get('address', '') if params else '').strip()
    if not address:
        return resp(400, {'error': 'address обязателен'})

    api_key = os.environ.get('YANDEX_MAPS_API_KEY', '')
    if not api_key:
        return resp(500, {'error': 'YANDEX_MAPS_API_KEY не настроен'})

    encoded = urllib.parse.quote(address)
    url = "https://geocode-maps.yandex.ru/1.x/?apikey=%s&format=json&geocode=%s" % (api_key, encoded)

    try:
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req, timeout=5) as r:
            data = json.loads(r.read().decode())

        members = data.get('response', {}).get('GeoObjectCollection', {}).get('featureMember', [])
        if not members:
            return resp(200, {'found': False, 'coords': None})

        pos = members[0]['GeoObject']['Point']['pos']
        lon, lat = pos.split(' ')
        return resp(200, {'found': True, 'coords': [float(lat), float(lon)]})
    except Exception as e:
        return resp(500, {'error': 'Geocode error: %s' % str(e)})


# ─── ROUTER ──────────────────────────────────────────────────────────────────

def handler(event, context):
    """CRUD профиля владельца, управление несколькими фулфилментами, фото, модерация, КП"""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': ''}

    method = event.get('httpMethod', 'GET')
    params = event.get('queryStringParameters') or {}
    action = params.get('action', '')
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

    if method == 'GET':
        if action == 'owner-profile':
            return handle_get_owner_profile(token)
        if action == 'my-fulfillments':
            return handle_list_my_fulfillments(token)
        if action == 'get-fulfillment':
            fid = params.get('id', '0')
            return handle_get_fulfillment(token, fid)
        if action == 'seller-quotes':
            return handle_seller_quotes(token)
        # legacy
        if action == 'profile':
            return handle_get_profile(token)
        if action == 'approved':
            return handle_list_approved()
        if action == 'demo':
            return handle_list_demo(params)
        if action == 'geocode':
            return handle_geocode(params)
        if action == 'my-quotes':
            return handle_my_quotes(token)
        if action == 'admin-list':
            return handle_admin_list(token, params)
        if action == 'admin-quotes':
            return handle_admin_all_quotes(token)

    if method == 'POST':
        if action == 'update-owner-profile':
            return handle_update_owner_profile(body, token)
        if action == 'create-fulfillment':
            return handle_create_fulfillment(body, token)
        if action == 'update-fulfillment':
            return handle_update_fulfillment(body, token)
        if action == 'submit-fulfillment':
            return handle_submit_fulfillment_for_moderation(body, token)
        if action == 'close-fulfillment':
            return handle_close_fulfillment(body, token)
        if action == 'view-quote':
            return handle_view_quote(body, token)
        # legacy
        if action == 'update-profile':
            return handle_update_profile(body, token)
        if action == 'upload-photo':
            return handle_upload_photo(body, token)
        if action == 'submit-for-moderation':
            return handle_submit_for_moderation(token)
        if action == 'send-quote':
            return handle_send_quote(body)
        if action == 'update-quote-status':
            return handle_update_quote_status(body, token)
        if action == 'admin-moderate':
            return handle_admin_moderate(body, token)
        if action == 'admin-set-lead-price':
            return handle_admin_set_lead_price(body, token)
        if action == 'admin-mark-paid':
            return handle_admin_mark_paid(body, token)

    return resp(404, {'error': 'Неизвестный маршрут'})