#!/usr/bin/env python
'''
ooiui.core.routes.aa

Defines the application routes

Alerts and Alarms

v 0.1
'''
from ooiui.core.app import app
from flask import request, render_template, Response, jsonify
from flask import stream_with_context, make_response
from ooiui.core.routes.common import get_login

import requests


#main aa page
@app.route('/aa/dashboard')
@app.route('/aa/dashboard/')
def aa_dashboard():
    return render_template('aa/AlertPage.html')

#edit/new page for aa
@app.route('/aa/createalert')
@app.route('/aa/createalert/')
def aa_index():
    return render_template('aa/CreateAlert.html')

# AA ooi-ui-services Routes

# Alerts by Array
#
# http://localhost:4000/alert_alarm_definition
@app.route('/api/aa/arrays', methods=['GET'])
def get_aa_array_all():
    token = get_login()
    response = requests.get(app.config['SERVICES_URL'] + '/alert_alarm_definition', auth=(token, ''))
    return response.text, response.status_code

@app.route('/api/aa/array', methods=['POST'])
def create_aa_array():
    token = get_login()
    data = json.loads(request.data)
    api_key = app.config['UI_API_KEY']
    response = requests.post(app.config['SERVICES_URL'] + '/alert_alarm_definition', headers={'X-Csrf-Token' : api_key}, data=data)
    return response.text, response.status_code



# Alerts by Platform
#
# http://localhost:4000/alert_alarm
@app.route('/api/aa/platforms', methods=['GET'])
def get_aa_platform_all():
    token = get_login()
    response = requests.get(app.config['SERVICES_URL'] + '/alert_alarm_definition', auth=(token, ''))
    return response.text, response.status_code

@app.route('/api/aa/platform', methods=['POST'])
def create_aa_platform():
    token = get_login()
    data = json.loads(request.data)
    api_key = app.config['UI_API_KEY']
    response = requests.post(app.config['SERVICES_URL'] + '/alert_alarm_definition', headers={'X-Csrf-Token' : api_key}, data=data)
    return response.text, response.status_code



# Alerts by Instrument
#
# http://localhost:4000/alert_alarm
#@app.route('/api/c2/array/<string:array_code>/abstract', methods=['GET'])
#def get_c2_array_abstract(array_code):
#    token = get_login()
#    response = requests.get(app.config['SERVICES_URL'] + '/c2/array/%s/abstract' % (array_code), auth=(token, ''), params=request.args)
#    return response.text, response.status_code


# Manage Instrument Alerts
# TODO
# ADD post section for instruments
#
#


# Get Alerts Options
#
#TODO
# http://localhost:4000/alert_alarm
#@app.route('/api/aa/array/', methods=['GET'])
#def get_aa_aptions(array_code):
#    token = get_login()
#    response = requests.get(app.config['SERVICES_URL'] + '/aa/options/%s/abstract' % (array_code), auth=(token, ''), params=request.args)
#    return response.text, response.status_code
