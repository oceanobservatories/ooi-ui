from ooiui.core.app import app
from flask import request, render_template, Response, jsonify
from ooiui.config import SERVICES_URL
from werkzeug.exceptions import Unauthorized
import requests
import json
import urllib

def get_login():
    token = request.cookies.get('ooiusertoken')
    if not token:
        response = Response(status=401, mimetype='application/json', response=jsonify(error='Invalid Token'))
        raise Unauthorized(description="Invalid token", response=response)
    token = urllib.unquote(token).decode('utf8')
    return token

@app.route('/signup')
def user_signup():
    return render_template('common/signup.html')

@app.route('/login')
def user_login():
    return render_template('common/loginDemo.html')

@app.route('/basic.html')
def basic():
    return render_template('common/basic.html')

@app.route('/chartDemo.html')
def chart_demo():
    return render_template('common/chartDemo.html')

@app.route('/plotsDemo.html')
def plots_demo():
    return render_template('common/plotsDemo.html')

@app.route('/api/organization', methods=['GET'])
def get_organization():
    response = requests.get(SERVICES_URL + '/organization', params=request.args)
    return response.text, response.status_code

@app.route('/api/organization/<int:id>', methods=['GET'])
def get_organization_by_id(id):
    response = requests.get(SERVICES_URL + '/organization/%s' % id, params=request.args)
    return response.text, response.status_code

@app.route('/api/user', methods=['GET'])
def get_user():
    token = get_login()
    response = requests.get(SERVICES_URL + '/user', auth=(token, ''))
    return response.text, response.status_code

@app.route('/api/user', methods=['POST'])
@app.route('/api/user/', methods=['POST'])
def submit_user():
    '''
    Acts as a pass-thru proxy to to the services
    '''
    token = get_login()
    response = requests.post(SERVICES_URL + '/user', auth=(token, ''), data=request.data)
    return response.text, response.status_code

@app.route('/user_roles')
def user_roles():
    token = get_login()
    resp = requests.get(SERVICES_URL + '/user_roles', auth=(token,''))
    return resp.text, resp.status_code

@app.route('/api/login', methods=['POST'])
def login():
    local_context = json.loads(request.data)
    username = local_context['login']
    password = local_context['password']
    response = requests.get(SERVICES_URL + '/token', auth=(username, password))
    return response.text, response.status_code

#>>---->opLog<----<<##
# @app.route('/opLog.html')
# def op_log():
#     return render_template('common/opLog.html')

@app.route('/api/watch', methods=['GET'])
def get_watch():
    response = requests.get(SERVICES_URL + '/watch', params=request.args)
    return response.text, response.status_code

@app.route('/apt/watch', methods=['POST'])
def post_watch():
    token = get_login()
    response = requests.post(SERVICES_URL + '/watch', auth=(token, ''), data=request.data)
    return response.text, response.status_code

@app.route('/api/watch/user', methods=['GET'])
def get_watch_user():
    token = get_login()
    response = requests.get(SERVICES_URL + '/watch/user/', auth=(token, ''), params=request.args)
    return response.text, response.status_code

@app.route('/api/watch/<int:id>', methods=['GET'])
def get_watch_by_id(id):
    response = requests.get(SERVICES_URL + '/watch/%s' % id)
    return response.text, response.status_code

@app.route('/api/watch/<int:id>', methods=['PUT'])
def put_watch(id):
    token = get_login()
    response = requests.put(SERVICES_URL + '/watch/%s' % id, auth=(token, ''), data=request.data)
    return response.text, response.status_code

@app.route('/api/watch/open', methods=['GET'])
def get_watch_open():
    token = get_login()
    resp = requests.get(SERVICES_URL + '/watch/open', auth=(token,''), params=request.args)
    return resp.text, resp.status_code

@app.route('/api/operator_event', methods=['GET'])
def get_operator_event():
    response = requests.get(SERVICES_URL + '/operator_event', params=request.args)
    return response.text, response.status_code

@app.route('/api/operator_event', methods=['POST'])
def post_event():
    token = get_login()
    resp = requests.get(SERVICES_URL + '/operator_event', auth=(token,''))
    return resp.text, resp.status_code

