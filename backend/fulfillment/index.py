"""CRUD профиля фулфилмента, загрузка фото, модерация, запросы КП"""
import json
import os
import base64
import uuid
import psycopg2
import boto3

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

def handle_get_profile(token):
    conn = get_db()
    cur = conn.cursor()
    try:
        user = get_user_by_token(cur, token)
        if not user:
            return resp(401, {'error': 'Не авторизован'})
        user_id = user[0]

        cur.execute("""
            SELECT id, company_name, inn, city, warehouse_area, founded_year, description,
                detailed_description, logo, photos, contact_name, contact_email, contact_phone, contact_tg,
                work_schemes, features, packaging_types, marketplaces,
                storage_price, assembly_price, delivery_price, storage_rate, assembly_rate, delivery_rate,
                min_volume, has_trial, team_size, working_hours, certificates, services,
                badge, badge_color, rating, reviews_count, status, moderation_comment, specializations
            FROM fulfillments WHERE user_id = %d
        """ % user_id)
        row = cur.fetchone()
        if not row:
            return resp(404, {'error': 'Профиль не найден'})

        cols = ['id', 'company_name', 'inn', 'city', 'warehouse_area', 'founded_year', 'description',
                'detailed_description', 'logo', 'photos', 'contact_name', 'contact_email', 'contact_phone', 'contact_tg',
                'work_schemes', 'features', 'packaging_types', 'marketplaces',
                'storage_price', 'assembly_price', 'delivery_price', 'storage_rate', 'assembly_rate', 'delivery_rate',
                'min_volume', 'has_trial', 'team_size', 'working_hours', 'certificates', 'services',
                'badge', 'badge_color', 'rating', 'reviews_count', 'status', 'moderation_comment', 'specializations']
        profile = {}
        for i, c in enumerate(cols):
            v = row[i]
            if c in ('storage_rate', 'assembly_rate', 'delivery_rate', 'rating'):
                v = float(v) if v else 0
            profile[c] = v

        return resp(200, {'profile': profile})
    finally:
        cur.close()
        conn.close()

def handle_update_profile(body, token):
    conn = get_db()
    cur = conn.cursor()
    try:
        user = get_user_by_token(cur, token)
        if not user:
            return resp(401, {'error': 'Не авторизован'})
        user_id = user[0]

        allowed = ['company_name', 'inn', 'city', 'warehouse_area', 'founded_year', 'description',
                    'detailed_description', 'logo', 'contact_name', 'contact_email', 'contact_phone', 'contact_tg',
                    'storage_price', 'assembly_price', 'delivery_price', 'storage_rate', 'assembly_rate', 'delivery_rate',
                    'min_volume', 'has_trial', 'team_size', 'working_hours']
        array_fields = ['work_schemes', 'features', 'packaging_types', 'marketplaces', 'certificates', 'photos', 'specializations']
        json_fields = ['services']

        updates = []
        for k in allowed:
            if k in body:
                v = body[k]
                if isinstance(v, bool):
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
        cur.execute("UPDATE fulfillments SET %s WHERE user_id = %d" % (', '.join(updates), user_id))
        conn.commit()
        return resp(200, {'ok': True})
    except Exception as e:
        conn.rollback()
        return resp(500, {'error': str(e)})
    finally:
        cur.close()
        conn.close()

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

def handle_list_approved():
    conn = get_db()
    cur = conn.cursor()
    try:
        cur.execute("""
            SELECT id, company_name, city, warehouse_area, founded_year, description,
                detailed_description, logo, photos, contact_name,
                work_schemes, features, packaging_types, marketplaces,
                storage_price, assembly_price, delivery_price, storage_rate, assembly_rate, delivery_rate,
                min_volume, team_size, working_hours, certificates, services,
                badge, badge_color, rating, reviews_count, specializations
            FROM fulfillments WHERE status = 'approved'
            ORDER BY rating DESC, reviews_count DESC
        """)
        rows = cur.fetchall()
        cols = ['id', 'company_name', 'city', 'warehouse_area', 'founded_year', 'description',
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
        if ff[2] != 'approved':
            return resp(403, {'error': 'Фулфилмент недоступен'})
        lead_price = float(ff[1] or 0)

        company = body.get('company', '').replace("'", "''")
        msg = body.get('message', '').replace("'", "''")
        sku = int(body.get('sku_count', 0) or 0)
        orders = int(body.get('orders_count', 0) or 0)

        cur.execute("""
            INSERT INTO quote_requests (fulfillment_id, sender_name, sender_company, sender_email, sender_phone, sku_count, orders_count, message, lead_price)
            VALUES (%d, '%s', '%s', '%s', '%s', %d, %d, '%s', %s)
            RETURNING id
        """ % (int(fulfillment_id), name.replace("'", "''"), company, email.replace("'", "''"), phone.replace("'", "''"), sku, orders, msg, lead_price))
        qid = cur.fetchone()[0]

        cur.execute("""
            UPDATE fulfillments
            SET total_leads = COALESCE(total_leads, 0) + 1,
                balance = COALESCE(balance, 0) - %s
            WHERE id = %d
        """ % (lead_price, int(fulfillment_id)))

        conn.commit()
        return resp(201, {'ok': True, 'id': qid, 'lead_price': lead_price})
    except Exception as e:
        conn.rollback()
        return resp(500, {'error': str(e)})
    finally:
        cur.close()
        conn.close()

def handle_submit_for_moderation(token):
    conn = get_db()
    cur = conn.cursor()
    try:
        user = get_user_by_token(cur, token)
        if not user:
            return resp(401, {'error': 'Не авторизован'})
        user_id = user[0]

        cur.execute("""
            SELECT company_name, city, description, contact_email, contact_phone
            FROM fulfillments WHERE user_id = %d
        """ % user_id)
        row = cur.fetchone()
        if not row:
            return resp(404, {'error': 'Профиль не найден'})
        if not row[0] or not row[1] or not row[2] or not row[3] or not row[4]:
            return resp(400, {'error': 'Заполните обязательные поля: название, город, описание, email, телефон'})

        cur.execute("UPDATE fulfillments SET status = 'pending', updated_at = NOW() WHERE user_id = %d" % user_id)
        conn.commit()
        return resp(200, {'ok': True, 'status': 'pending'})
    except Exception as e:
        conn.rollback()
        return resp(500, {'error': str(e)})
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

        cur.execute("SELECT id FROM fulfillments WHERE user_id = %d" % user_id)
        ff = cur.fetchone()
        if not ff:
            return resp(404, {'error': 'Профиль не найден'})

        cur.execute("""
            SELECT id, sender_name, sender_company, sender_email, sender_phone,
                sku_count, orders_count, message, status, created_at
            FROM quote_requests WHERE fulfillment_id = %d
            ORDER BY created_at DESC
        """ % ff[0])
        rows = cur.fetchall()
        cols = ['id', 'sender_name', 'sender_company', 'sender_email', 'sender_phone',
                'sku_count', 'orders_count', 'message', 'status', 'created_at']
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
            UPDATE quote_requests SET status = '%s'
            WHERE id = %d AND fulfillment_id IN (SELECT id FROM fulfillments WHERE user_id = %d)
        """ % (new_status, int(qid), user_id))
        conn.commit()
        return resp(200, {'ok': True})
    finally:
        cur.close()
        conn.close()

# --- ADMIN / MODERATION ---
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
        price = float(body.get('lead_price', 0) or 0)
        if not fid or price < 0:
            return resp(400, {'error': 'fulfillment_id и lead_price обязательны'})
        cur.execute("UPDATE fulfillments SET lead_price = %s WHERE id = %d" % (price, int(fid)))
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
        cur.execute("""
            UPDATE quote_requests SET payment_status = 'paid' WHERE id = %d
            RETURNING fulfillment_id, lead_price
        """ % int(qid))
        row = cur.fetchone()
        if row:
            cur.execute("UPDATE fulfillments SET balance = COALESCE(balance, 0) + %s WHERE id = %d" % (float(row[1] or 0), int(row[0])))
        conn.commit()
        return resp(200, {'ok': True})
    finally:
        cur.close()
        conn.close()

def handler(event, context):
    """CRUD профиля фулфилмента, загрузка фото, модерация, запросы КП"""
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
        if action == 'profile':
            return handle_get_profile(token)
        if action == 'approved':
            return handle_list_approved()
        if action == 'my-quotes':
            return handle_my_quotes(token)
        if action == 'admin-list':
            return handle_admin_list(token, params)
        if action == 'admin-quotes':
            return handle_admin_all_quotes(token)

    if method == 'POST':
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