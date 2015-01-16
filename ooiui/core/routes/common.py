from ooiui.core.app import app
from flask import request, render_template, Response
from ooiui.config import SERVICES_URL
import requests
import json

@app.route('/signup')
def user_signup():   
    return render_template('common/signup.html')

@app.route('/login')
def user_login():    
    return render_template('common/loginDemo.html')


@app.route('/api/user', methods=['POST'])
@app.route('/api/user/', methods=['POST'])
def submit_user():
    '''
    Acts as a pass-thru proxy to to the services
    '''
    response = requests.post(SERVICES_URL + '/user', auth=('Bill', 'admin'), data=request.data)
    return response.text, response.status_code

@app.route('/user_roles')
def user_roles():
    resp = requests.get(SERVICES_URL + '/user_roles', auth=('Bill','admin'))
    data = json.dumps(resp.json()) 
    return data, resp.status_code
