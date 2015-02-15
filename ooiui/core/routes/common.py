from ooiui.core.app import app
from flask import request, render_template, Response, jsonify, session
from werkzeug.exceptions import Unauthorized
import requests
import json
import urllib
from uuid import uuid4

def get_login():
    token = request.cookies.get('ooiusertoken')
    if not token:
        return None
    token = urllib.unquote(token).decode('utf8')
    return token

def generate_csrf_token():
    if '_csrf_token' not in session:
        session['_csrf_token'] = uuid4().hex
    return session['_csrf_token']

app.jinja_env.globals['csrf_token'] = generate_csrf_token

@app.route('/signup')
def user_signup():
    return render_template('common/signup.html')

@app.route('/user/edit/<int:id>')
def user_edit(id):
    return render_template('common/userEdit.html')

@app.route('/users/')
def users():
    return render_template('common/users.html')

@app.route('/troubleTicket')
def create_ticket():
    return render_template('common/troubleTicket.html')

@app.route('/login')
def user_login():
    return render_template('common/loginDemo.html')

@app.route('/NewEvent')
def new_event():
    return render_template('common/newEvent.html')

@app.route('/basic.html')
def basic():
    return render_template('common/basic.html')

@app.route('/svgplot.html')
def svgplot():
    return render_template('common/svgplot.html')

@app.route('/chartDemo.html')
def chart_demo():
    return render_template('common/chartDemo.html')

@app.route('/plotsDemo.html')
def plots_demo():
    return render_template('common/plotsDemo.html')

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
    response = requests.get(SERVICES_URL + '/ticket', auth=(token, ''))
    return response.text, response.status_code

@app.route('/api/ticket', methods=['POST'])
def submit_ticket():
    '''
    Acts as a pass-thru proxy to to the services
    '''
    token = get_login()
    response = requests.post(SERVICES_URL + '/ticket', auth=(token, ''), data=request.data)
    return response.text, response.status_code

@app.route('/ticket_roles')
def ticket_roles():
    token = get_login()
    resp = requests.get(SERVICES_URL + '/ticket_roles', auth=(token,''))
    return resp.text, resp.status_code

@app.route('/api/login', methods=['POST'])
def login():
    local_context = json.loads(request.data)
    username = local_context['login']
    password = local_context['password']
    response = requests.get(app.config['SERVICES_URL'] + '/token', auth=(username, password))
    return response.text, response.status_code

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
    resp = requests.get(app.config['SERVICES_URL'] + '/watch/open', auth=(token,''), params=request.args)
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
