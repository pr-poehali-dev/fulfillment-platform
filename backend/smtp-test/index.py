"""Диагностика SMTP — подробная проверка отправки на внешний email"""
import json
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def handler(event, context):
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': ''}

    body = {}
    if event.get('body'):
        try:
            body = json.loads(event['body'])
        except:
            pass

    to = body.get('to', 'support@fulfillhub.ru')
    login = 'noreply@fulfillhub.ru'
    password = os.environ.get('SMTP_PASSWORD', '')
    result = {'to': to, 'login': login, 'steps': []}

    try:
        s = smtplib.SMTP('mail.hosting.reg.ru', 587, timeout=15)
        s.set_debuglevel(0)
        result['steps'].append('connected')

        ehlo_resp = s.ehlo()
        result['ehlo'] = str(ehlo_resp)
        result['steps'].append('ehlo')

        tls_resp = s.starttls()
        result['starttls'] = str(tls_resp)
        result['steps'].append('starttls')

        s.ehlo()

        login_resp = s.login(login, password)
        result['login_resp'] = str(login_resp)
        result['steps'].append('login_ok')

        msg = MIMEMultipart('alternative')
        msg['Subject'] = 'FulfillHub SMTP Test to External'
        msg['From'] = 'FulfillHub <%s>' % login
        msg['To'] = to
        msg.attach(MIMEText('<h2>SMTP Test</h2><p>If you see this, SMTP delivery to external emails works.</p>', 'html', 'utf-8'))

        send_resp = s.sendmail(login, [to], msg.as_string())
        result['sendmail_resp'] = str(send_resp) if send_resp else 'empty_dict_ok'
        result['steps'].append('sent')

        quit_resp = s.quit()
        result['quit'] = str(quit_resp)
        result['steps'].append('quit')
        result['success'] = True
    except smtplib.SMTPRecipientsRefused as e:
        result['error'] = 'SMTPRecipientsRefused: %s' % str(e)
    except smtplib.SMTPSenderRefused as e:
        result['error'] = 'SMTPSenderRefused: %s' % str(e)
    except smtplib.SMTPDataError as e:
        result['error'] = 'SMTPDataError: %s' % str(e)
    except smtplib.SMTPException as e:
        result['error'] = 'SMTPException: %s' % str(e)
    except Exception as e:
        result['error'] = '%s: %s' % (type(e).__name__, str(e))

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
        'body': json.dumps(result, ensure_ascii=False)
    }
