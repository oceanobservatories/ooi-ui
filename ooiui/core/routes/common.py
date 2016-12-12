from ooiui.core.app import app
from flask import request, render_template, Response, jsonify, session, make_response, redirect, url_for
from werkzeug.exceptions import Unauthorized
from ooiui.core.routes.decorators import login_required, get_login, scope_required
import requests
import json
from uuid import uuid4
import sys, os, time, difflib
import yaml
import json, smtplib, string
from itsdangerous import TimestampSigner, URLSafeSerializer

def generate_csrf_token():
    if '_csrf_token' not in session:
        session['_csrf_token'] = uuid4().hex
    return session['_csrf_token']

app.jinja_env.globals['csrf_token'] = generate_csrf_token


# TODO: Remove this route
@app.route('/get_config', methods=['GET'])
def read_config():
    basedir = 'ooiui/config'
    config_file = os.path.join(basedir, 'config.yml')
    with open(config_file) as f:
        c = yaml.load(f)
    del c['COMMON']['SECRET_KEY']
    del c['COMMON']['UI_API_KEY']
    del c['COMMON']['CACHE_TYPE']
    del c['COMMON']['DEBUG']
    del c['COMMON']['GOOGLE_ANALYTICS']
    del c['DEVELOPMENT']['SECRET_KEY']
    del c['DEVELOPMENT']['UI_API_KEY']
    del c['DEVELOPMENT']['CACHE_TYPE']
    del c['DEVELOPMENT']['DEBUG']
    del c['DEVELOPMENT']['GOOGLE_ANALYTICS']
    return jsonify(c)

@app.route('/signup')
def user_signup():
    return render_template('common/signup.html', tracking=app.config['GOOGLE_ANALYTICS'])

@app.route('/user/edit/<int:id>')
@login_required()
def user_edit(id):
    token = get_login()
    response = requests.get(app.config['SERVICES_URL'] + '/current_user', auth=(token, ''))
    user = json.loads(response.text)
    if (user['id'] == id) or ('user_admin' in user['scopes']):
        return render_template('common/userEdit.html', tracking=app.config['GOOGLE_ANALYTICS'])
    else:
        return render_template('common/help.html', tracking=app.config['GOOGLE_ANALYTICS'])

@app.route('/users/')
@login_required()
def users():
    return render_template('common/users.html', tracking=app.config['GOOGLE_ANALYTICS'])

@app.route('/troubleTicket')
def create_ticket():
    return render_template('common/troubleTicket.html', tracking=app.config['GOOGLE_ANALYTICS'])

@app.route('/login')
def user_login():
    return render_template('common/loginDemo.html', tracking=app.config['GOOGLE_ANALYTICS'])

@app.route('/password-reset/<string:token>', methods=['GET'])
def password_reset(token):
    stamper = TimestampSigner(app.config['SECRET_KEY'], salt=app.config['SECURITY_PASSWORD_SALT'])
    signer = URLSafeSerializer(app.config['SECRET_KEY'], salt=app.config['SECURITY_PASSWORD_SALT'])

    if token is not None:
        try:
            unstamped = stamper.unsign(token, max_age=30000)
            return render_template('common/passwordReset.html', reset_email=signer.loads(unstamped), reset_token=token)
        except Exception, ex:
            return jsonify(error="Password reset link invalid, send another reset email."), 401
    else:
        return jsonify(error="")


@app.route('/password-reset-request', methods=['POST'])
def password_reset_request():
    the_data = request.data
    email = json.loads(the_data)['email']
    stamper = TimestampSigner(app.config['SECRET_KEY'], salt=app.config['SECURITY_PASSWORD_SALT'])
    signer = URLSafeSerializer(app.config['SECRET_KEY'], salt=app.config['SECURITY_PASSWORD_SALT'])
    signature_token = signer.dumps(email)
    token = stamper.sign(signature_token)
    try:
        reset_url = app.config["SERVER_DNS"] + "/password-reset/" + token
        body=string.join(("From: " + app.config["SMTP_SENDER"],
                          "Subject: OOI Password Reset Request",
                         "You recently requested a password reset. Click the link below to proceed.",
                         " ",
                         " ",
                         "Please visit %s to reset your password." % reset_url),"\r\n")
        send_ses(app.config['SMTP_SENDER'],
             'OOI Password Reset Request',
             body,
             email)
        # send_reset_password_email(email, token)
        # return render_template('common/home.html', tracking=app.config['GOOGLE_ANALYTICS'])
        return jsonify(error="Sending password succeeded."), 201
    except Exception as ex:
        return jsonify(error="Sending password reset email failed."), 401


@app.route('/help')
def help_page():
    return render_template('common/help.html', tracking=app.config['GOOGLE_ANALYTICS'])

@app.route('/pioneer-array')
def pioneer_array():
    return render_template('landing/pioneerArray.html', tracking=app.config['GOOGLE_ANALYTICS'])

@app.route('/endurance-array')
def endurance_array():
    return render_template('landing/enduranceArray.html', tracking=app.config['GOOGLE_ANALYTICS'])

@app.route('/cabled-array')
def cabled_array():
    return render_template('landing/cabledArray.html', tracking=app.config['GOOGLE_ANALYTICS'])

@app.route('/station-papa')
def station_papa():
    return render_template('landing/stationPapa.html', tracking=app.config['GOOGLE_ANALYTICS'])

@app.route('/irminger-sea')
def irminger_sea():
    return render_template('landing/irmingerSea.html', tracking=app.config['GOOGLE_ANALYTICS'])

@app.route('/argentine-basin')
def argentine_basin():
    return render_template('landing/argentineBasin.html', tracking=app.config['GOOGLE_ANALYTICS'])

@app.route('/southern-ocean')
def southern_ocean():
    return render_template('landing/southernOcean.html', tracking=app.config['GOOGLE_ANALYTICS'])

@app.route('/infrastructure')
def infrastructure():
    return render_template('common/infrastructure.html', tracking=app.config['GOOGLE_ANALYTICS'])

@app.route('/NewEvent')
@login_required()
def new_event():
    return render_template('common/newEvent.html', tracking=app.config['GOOGLE_ANALYTICS'])

@app.route('/basic.html')
def basic():
    return render_template('common/basic.html', tracking=app.config['GOOGLE_ANALYTICS'])

@app.route('/svgplot.html')
def svg_timeseries_plot():
    return render_template('common/svgplot.html', tracking=app.config['GOOGLE_ANALYTICS'])

@app.route('/depthplot.html')
def svg_depthprofile_plot():
    return render_template('common/depthplot.html', tracking=app.config['GOOGLE_ANALYTICS'])

@app.route('/chartDemo.html')
def chart_demo():
    return render_template('common/chartDemo.html', tracking=app.config['GOOGLE_ANALYTICS'])

@app.route('/plotsDemo.html')
def plots_demo():
    return render_template('common/plotsDemo.html', tracking=app.config['GOOGLE_ANALYTICS'])

@app.route('/FAQ.html')
def FAQ():
    return render_template('common/FAQ.html', tracking=app.config['GOOGLE_ANALYTICS'])

@app.route('/glossary.html')
def glossary():
    return render_template('common/glossary.html', tracking=app.config['GOOGLE_ANALYTICS'])

@app.route('/')
def home():
    return render_template('common/home.html', tracking=app.config['GOOGLE_ANALYTICS'])

@app.route('/station')
def station():
    return render_template('common/station.html', tracking=app.config['GOOGLE_ANALYTICS'])

@app.route('/platform')
def platform():
    return render_template('common/platform.html', tracking=app.config['GOOGLE_ANALYTICS'])

@app.route('/platformnav')
def platformN():
    return render_template('common/platformStatus.html', tracking=app.config['GOOGLE_ANALYTICS'])

@app.route('/data_catalog')
def data_catalog():
    return render_template('common/data_catalog.html', tracking=app.config['GOOGLE_ANALYTICS'])

@app.route('/status')
def statusUI():
    return render_template('common/status.html', tracking=app.config['GOOGLE_ANALYTICS'])


@app.route('/statusnav')
def statusN():
    return render_template('common/statusN.html', tracking=app.config['GOOGLE_ANALYTICS'])


@app.route('/api/organization', methods=['GET'])
def get_organization():
    response = requests.get(app.config['SERVICES_URL'] + '/organization', params=request.args)
    return response.text, response.status_code

@app.route('/api/organization/<int:id>', methods=['GET'])
def get_organization_by_id(id):
    response = requests.get(app.config['SERVICES_URL'] + '/organization/%s' % id, params=request.args)
    return response.text, response.status_code

@app.route('/api/user', methods=['GET'])
def get_users():
    token = get_login()
    response = requests.get(app.config['SERVICES_URL'] + '/user', auth=(token, ''))
    return response.text, response.status_code


@app.route('/api/current_user', methods=['GET'])
def get_current_user():
    token = get_login()
    response = requests.get(app.config['SERVICES_URL'] + '/current_user', auth=(token, ''))
    return response.text, response.status_code

@app.route('/api/user/<int:id>', methods=['GET'])
def get_user_by_id(id):
    token = get_login()
    response = requests.get(app.config['SERVICES_URL'] + '/user/%s' % id, auth=(token, ''))
    return response.text, response.status_code

@app.route('/api/user/<int:id>', methods=['PUT'])
def put_user(id):
    token = get_login()
    response = requests.put(app.config['SERVICES_URL'] + '/user/%s' % id, auth=(token, ''), data=request.data)
    return response.text, response.status_code


@app.route('/api/user', methods=['POST'])
@app.route('/api/user/', methods=['POST'])
def submit_user():
    '''
    Acts as a pass-thru proxy to to the services
    '''
    csrf_token = session.pop('_csrf_token', None)
    data = json.loads(request.data)
    if not csrf_token or csrf_token != data['_csrf_token']:
        return jsonify(error="CSRF Error"), 401
    api_key = app.config['UI_API_KEY']
    response = requests.post(app.config['SERVICES_URL'] + '/user', headers={'X-Csrf-Token' : api_key}, data=request.data)
    return response.text, response.status_code

@app.route('/api/user_scope', methods=['GET'])
def get_user_scopes():
    token = get_login()
    response = requests.get(app.config['SERVICES_URL'] + '/user_scopes', auth=(token, ''))
    return response.text, response.status_code

@app.route('/user_roles')
def user_roles():
    resp = requests.get(app.config['SERVICES_URL'] + '/user_roles')
    return resp.text, resp.status_code

@app.route('/api/ticket', methods=['GET'])
def get_ticket():
    token = get_login()
    response = requests.get(app.config['SERVICES_URL'] + '/redmine/ticket', auth=(token, ''))
    return response.text, response.status_code

@app.route('/api/ticket', methods=['POST'])
def submit_ticket():
    '''
    Acts as a pass-thru proxy to to the services
    '''
    token = get_login()
    response = requests.post(app.config['SERVICES_URL'] + '/redmine/ticket', auth=(token, ''), data=request.data)
    return response.text, response.status_code

@app.route('/api/ticket/users', methods=['GET'])
def get_ticket_users():
    '''
    Acts as a pass-thru proxy to to the services to get users
    '''
    token = get_login()
    response = requests.get(app.config['SERVICES_URL'] + '/redmine/users', auth=(token, ''), params=request.args)
    return response.text, response.status_code

@app.route('/ticket_roles')
def ticket_roles():
    token = get_login()
    resp = requests.get(app.config['SERVICES_URL'] + '/ticket_roles', auth=(token, ''))
    return resp.text, resp.status_code

@login_required()
@app.route('/api/subscription', methods=['POST'])
def subscription_post():
    headers = {'Content-Type': 'application/json'}
    token = get_login()
    response = requests.post(app.config['SERVICES_URL']+'/uframe/subscription', data=request.data, headers=headers, auth=(token, ''))
    return response.text, response.status_code

@login_required()
@app.route('/api/subscription', methods=['GET'])
def subscription_get():
    token = get_login()
    if 'email' not in request.args:
        return jsonify(error="email address not set"), 401
    try:
        if token:
            email = request.args['email']

            response = requests.get(app.config['SERVICES_URL']+'/uframe/subscription', params=request.args)
            data = response.json()

            ret_data = []
            for d in data:
                if d['email'] == email:
                    ret_data.append(d)

            return jsonify(data=ret_data)
        else:
            return jsonify(error="user not logged in"), 401
    except Exception, e:
        return jsonify(error="email address not set"), 401


@login_required()
@app.route('/api/subscription/<int:id>', methods=['DELETE'])
def subscription_delete(id):
    token = get_login()
    response = requests.delete(app.config['SERVICES_URL']+'/uframe/subscription/'+str(id), params=request.args, auth=(token, ''))
    return response.text, response.status_code

@app.route('/api/login', methods=['POST'])
def login():
    local_context = json.loads(request.data)
    username = local_context['login']
    password = local_context['password']
    response = requests.get(app.config['SERVICES_URL'] + '/token', auth=(username, password))
    return response.text, response.status_code


@app.route('/api/cilogon', methods=['GET'])
def ci_logon():
    response = requests.get(app.config['SERVICES_URL'] + '/authorize/cilogon')
    return redirect(str(response.url))


@app.route('/callback/cilogon', methods=['GET'])
def ci_logon_callback():
    # begin 2 step oauth
    try:
        # first, get the uuid and email
        ci_callback_res = requests.get(app.config['SERVICES_URL'] + '/callback/cilogon', params=request.args)
        json_response = json.loads(ci_callback_res.text)

        # use the response to simulate a login, and get a token back.
        login_res = requests.get(app.config['SERVICES_URL'] + '/token', auth=(json_response['username'], json_response['uuid']))
        json_login_res = json.loads(login_res.text)

        # reload the home page and pass the token.
        return redirect(url_for('.new_index', token=json_login_res['token'], expiration=json_login_res['expiration']))
    except ValueError:
        return redirect(url_for('.new_index'))


@app.route('/api/watch', methods=['GET'])
def get_watch():
    response = requests.get(app.config['SERVICES_URL'] + '/watch', params=request.args)
    return response.text, response.status_code

@app.route('/api/watch', methods=['POST'])
def post_watch():
    token = get_login()
    response = requests.post(app.config['SERVICES_URL'] + '/watch', auth=(token, ''), data=request.data)
    return response.text, response.status_code

@app.route('/api/watch/user', methods=['GET'])
def get_watch_user():
    token = get_login()
    response = requests.get(app.config['SERVICES_URL'] + '/watch/user/', auth=(token, ''), params=request.args)
    return response.text, response.status_code

@app.route('/api/watch/<int:id>', methods=['GET'])
def get_watch_by_id(id):
    response = requests.get(app.config['SERVICES_URL'] + '/watch/%s' % id)
    return response.text, response.status_code

@app.route('/api/watch/<int:id>', methods=['PUT'])
def put_watch(id):
    token = get_login()
    response = requests.put(app.config['SERVICES_URL'] + '/watch/%s' % id, auth=(token, ''), data=request.data)
    return response.text, response.status_code

@app.route('/api/watch/open', methods=['GET'])
def get_watch_open():
    token = get_login()
    resp = requests.get(app.config['SERVICES_URL'] + '/watch/open', auth=(token, ''), params=request.args)
    return resp.text, resp.status_code

@app.route('/api/operator_event', methods=['GET'])
def get_operator_event():
    response = requests.get(app.config['SERVICES_URL'] + '/operator_event', params=request.args)
    return response.text, response.status_code

@app.route('/api/operator_event', methods=['POST'])
def post_event():
    token = get_login()
    response = requests.post(app.config['SERVICES_URL'] + '/operator_event', auth=(token, ''), data=request.data)
    return response.text, response.status_code

@app.route('/api/operator_event_type', methods=['GET'])
def get_operator_event_type():
    response = requests.get(app.config['SERVICES_URL'] + '/operator_event_type', params=request.args)
    return response.text, response.status_code

@app.route('/api/log_entry', methods=['GET'])
def get_log_entries():
    response = requests.get(app.config['SERVICES_URL'] + '/log_entry', params=request.args)
    return response.text, response.status_code

@app.route('/api/log_entry', methods=['POST'])
def post_log_entry():
    token = get_login()
    response = requests.post(app.config['SERVICES_URL'] + '/log_entry', auth=(token, ''), data=request.data)
    return response.text, response.status_code

@app.route('/api/log_entry/<int:id>', methods=['GET'])
def get_log_entry(id):
    response = requests.get(app.config['SERVICES_URL'] + '/log_entry/%s' % id, params=request.args)
    return response.text, response.status_code

@app.route('/api/log_entry/<int:id>', methods=['PUT'])
def put_log_entry(id):
    token = get_login()
    response = requests.put(app.config['SERVICES_URL'] + '/log_entry/%s' % id, auth=(token, ''), data=request.data)
    return response.text, response.status_code

@app.route('/api/log_entry/<int:id>', methods=['DELETE'])
def delete_log_entry(id):
    token = get_login()
    response = requests.delete(app.config['SERVICES_URL'] + '/log_entry/%s' % id, auth=(token, ''))
    return response.text, response.status_code

@app.route('/api/log_entry_comment', methods=['GET'])
def get_log_entry_comments():
    response = requests.get(app.config['SERVICES_URL'] + '/log_entry_comment', params=request.args)
    return response.text, response.status_code

@app.route('/api/log_entry_comment', methods=['POST'])
def post_log_entry_comment():
    token = get_login()
    response = requests.post(app.config['SERVICES_URL'] + '/log_entry_comment', auth=(token, ''), data=request.data)
    return response.text, response.status_code

@app.route('/api/log_entry_comment/<int:id>', methods=['GET'])
def get_log_entry_comment(id):
    response = requests.get(app.config['SERVICES_URL'] + '/log_entry_comment/%s' % id, params=request.args)
    return response.text, response.status_code

@app.route('/api/log_entry_comment/<int:id>', methods=['PUT'])
def put_log_entry_comment(id):
    token = get_login()
    response = requests.put(app.config['SERVICES_URL'] + '/log_entry_comment/%s' % id, auth=(token, ''), data=request.data)
    return response.text, response.status_code

@app.route('/api/log_entry_comment/<int:id>', methods=['DELETE'])
def delete_log_entry_comment(id):
    token = get_login()
    response = requests.delete(app.config['SERVICES_URL'] + '/log_entry_comment/%s' % id, auth=(token, ''))
    return response.text, response.status_code

@app.route('/api/uframe/get_toc', methods=['GET'])
def get_toc_list():
    response = requests.get(app.config['SERVICES_URL'] + '/uframe/get_toc')
    return response.text, response.status_code

@app.route('/api/uframe/get_cam_image/<string:image_id>.png', methods=['GET'])
def get_cam_image(image_id):
    token = get_login()
    r = requests.get(app.config['SERVICES_URL'] + '/uframe/get_cam_image/'+image_id+'.png', auth=(token, ''), data=request.args)
    #make pass through
    response = make_response(r.content)
    response.headers['Content-Type'] = 'image/png'
    return response

@app.route('/api/uframe/cam_images', methods=['GET'])
def get_cam_images():
    token = get_login()
    response = requests.get(app.config['SERVICES_URL'] + '/uframe/get_cam_images', auth=(token, ''), data=request.args)
    return response.text, response.status_code

@app.route('/api/uframe/glider_tracks', methods=['GET'])
def get_glider_track():
    token = get_login()
    response = requests.get(app.config['SERVICES_URL'] + '/uframe/get_glider_tracks', auth=(token, ''), data=request.args)
    return response.text, response.status_code

@app.route('/api/alfresco/documents', methods=['GET'])
def get_alfresco_documents():
    token = get_login()
    response = requests.get(app.config['SERVICES_URL'] + '/alfresco/documents', auth=(token, ''), params=request.args)
    return response.text, response.status_code

@app.route('/CGSNConfig')
def CGSNConfig():
    return render_template('common/CGSNConfig.html', tracking=app.config['GOOGLE_ANALYTICS'])

@app.route('/config_file', methods=['GET'])
def get_config():
    with open('ooiui/static/txt/config_file.txt', 'r') as f:
        response = make_response(f.read())
        if not request.args.get("dl"): response.headers["Content-Type"] = "text;"
        else: response.headers["Content-Disposition"] = "attachment; filename=config.txt"
    return response
@app.route('/config_file', methods=['POST'])
def post_config():
    res = request.form["txt"]
    before = open('ooiui/static/txt/config_file.txt').readlines()
    with open('ooiui/static/txt/config_file.txt', 'w') as f:
        f.write(res)
    after = open('ooiui/static/txt/config_file.txt').readlines()
    diff=''
    for line in difflib.unified_diff(before, after, 'before', 'after', ):diff+=line
    #diff = difflib.unified_diff(before, after, 'before', 'after', )
    response = make_response(diff)
    response.headers["Content-Type"] = "text;"
    return response
@app.route('/notsupported')
def not_supported():
    return render_template('/common/notsupported.html', tracking=app.config['GOOGLE_ANALYTICS'])

@app.route('/api/countries', methods=['GET'])
def get_countries():
    response = requests.get(app.config['SERVICES_URL']+'/countries')
    #data = response.json()
    return response.text, response.status_code

@app.route('/api/states/<string:country_code>', methods=['GET'])
def get_states(country_code):
    response = requests.get(app.config['SERVICES_URL']+'/states/'+country_code, params=request.args)
    #data = response.json()
    return response.text, response.status_code

@app.route('/sysadmin')
@scope_required('sys_admin')
def sys_admin_template():
    return render_template('admin/sysAdmin.html', tracking=app.config['GOOGLE_ANALYTICS'])

@app.route('/dataadmin')
@scope_required('data_manager')
def data_admin_template():
    return render_template('admin/dataAdmin.html', tracking=app.config['GOOGLE_ANALYTICS'])

@app.route('/api/disabled_streams', methods=['GET', 'POST'])
@app.route('/api/disabled_streams/<int:id>', methods=['DELETE'])
@scope_required('data_manager')
def disabled_streams(id=None):
    token = get_login()
    END_POINT = '/uframe/disabled_streams'
    if request.method == 'GET':
        response = requests.get(app.config['SERVICES_URL'] + END_POINT, 
                                auth=(token, ''), params=request.args)
        return response.text, response.status_code

    elif request.method == 'POST':
        response = requests.post(app.config['SERVICES_URL'] + END_POINT, 
                                auth=(token, ''), data=request.data)
        return response.text, response.status_code

    elif request.method == 'DELETE':
        response = requests.delete(app.config['SERVICES_URL'] + END_POINT + '/' + str(id), 
                                auth=(token, ''))
        return response.text, response.status_code


@app.route('/api/cache_keys', methods=['GET'])
@app.route('/api/cache_keys/<string:key>', methods=['DELETE'])
@scope_required('sys_admin')
def cache_keys(key=None):
    token = get_login()
    if request.method == 'GET':
        response = requests.get(app.config['SERVICES_URL'] + '/cache_keys', 
                                auth=(token, ''), params=request.args)
        return response.text, response.status_code

    elif request.method == 'DELETE':
        response = requests.delete(app.config['SERVICES_URL'] + '/cache_keys/'+key, 
                                 auth=(token, ''))
        return response.text, response.status_code


@app.route('/api/user/xpassword', methods=['POST'])
def user_pw_reset():
    token = get_login()
    the_data = request.data
    response = requests.put(app.config['SERVICES_URL']+'/user/xpassword',
                            auth=(token, ''), data=the_data, headers=headers())
    return response.text, response.status_code


def _post_headers():
    """ urlencoded values for uframe POST.
    """
    return {"Content-Type": "application/x-www-form-urlencoded"}


def headers():
    """ Headers for uframe PUT and POST. """
    return {"Content-Type": "application/json"}

# SMTP email sender
def send_ses(fromaddr, subject, body, recipient):

    fromaddr = fromaddr
    toaddrs  = recipient

    #Change according to your settings
    smtp_server = app.config['SMTP_SERVER']
    smtp_username = app.config['SMTP_USERNAME']
    smtp_password = app.config['SMTP_PASSWORD']
    smtp_port = app.config['SMTP_PORT']
    smtp_do_tls = app.config['SMTP_DO_TLS']
    smtp_auth = app.config['SMTP_AUTH']

    try:
        server = smtplib.SMTP(
            host=smtp_server,
            port=smtp_port,
            timeout=10
        )
        server.set_debuglevel(10)
        if smtp_do_tls:
            server.starttls()
        server.ehlo()
        if smtp_auth:
            server.login(smtp_username, smtp_password)
        server.sendmail(fromaddr, toaddrs, body)
        return server.quit()
    except Exception as ex:
        return ex.message
