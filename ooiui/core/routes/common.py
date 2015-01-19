from ooiui.core.app import app
from flask import request, render_template, Response
from ooiui.config import SERVICES_URL
import requests
import json
import urllib

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


@app.route('/api/user', methods=['POST'])
@app.route('/api/user/', methods=['POST'])
def submit_user():
    '''
    Acts as a pass-thru proxy to to the services
    '''
    token = request.cookies.get('ooiusertoken')
    token = urllib.unquote(token).decode('utf8')
    if not token:
        return '{"error":"Invalid login token"}', 401
    login, token = token.split(':')
    response = requests.post(SERVICES_URL + '/user', auth=(token, ''), data=request.data)
    return response.text, response.status_code

@app.route('/user_roles')
def user_roles():
    token = request.cookies.get('ooiusertoken')
    token = urllib.unquote(token).decode('utf8')
    if not token:
        return '{"error":"Invalid login token"}', 401
    login, token = token.split(':')
    resp = requests.get(SERVICES_URL + '/user_roles', auth=(token,''))
    return resp.text, resp.status_code

@app.route('/api/login', methods=['POST'])
def login():
    local_context = json.loads(request.data)
    username = local_context['login']
    password = local_context['password']
    response = requests.get(SERVICES_URL + '/token', auth=(username, password))
    return response.text, response.status_code
