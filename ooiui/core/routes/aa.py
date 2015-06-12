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
import json
import urllib2 

import requests


#main aa page
@app.route('/alerts/dashboard')
@app.route('/alerts/dashboard/')
def aa_dashboard():
    urllib2.urlopen(app.config['GOOGLE_ANALYTICS_URL'] + '&dp=%2Falerts')
    return render_template('aa/AlertPage.html')

#main aa page
@app.route('/alerts/dashboard/triggered')
@app.route('/alerts/dashboard/triggered')
def aa_triggered_dashboard():
    return render_template('aa/TriggeredPage.html')

#edit/new page for aa
#this is not being used right now
@app.route('/alerts/createalert')
@app.route('/alerts/createalert/')
def aa_index():
    return render_template('aa/CreateAlert.html')

# AA ooi-ui-services Routes


#All current alerts that have been triggered
#
# http://localhost:4000/alert_alarm_definition
@app.route('/api/aa/triggered', methods=['GET'])
def get_aa_triggered_all():
    token = get_login()
    response = requests.get(app.config['SERVICES_URL'] + '/alert_alarm', auth=(token, ''))
    return response.text, response.status_code

@app.route('/api/aa/triggered/<string:id>', methods=['GET'])
def get_triggered_specific_id(id):
    token = get_login()
    response = requests.get(app.config['SERVICES_URL'] + '/alert_alarm?%s' % (id), auth=(token, ''), params=request.args)
    return response.text, response.status_code

@app.route('/api/aa/triggered', methods=['POST'])
def post_aa_triggered():
    token = get_login()
    data = json.loads(request.data)
    response = requests.post(app.config['SERVICES_URL'] + '/alert_alarm', auth=(token, ''), data=data)
    return response.text, response.status_code


# Alerts by List
#
# http://localhost:4000/alert_alarm_definition
@app.route('/api/aa/alerts', methods=['GET'])
def get_aa_array_all():
    token = get_login()
    response = requests.get(app.config['SERVICES_URL'] + '/alert_alarm_definition', auth=(token, ''))
    return response.text, response.status_code

@app.route('/api/aa/alerts', methods=['POST'])
def create_aa_array():
    token = get_login()
    data = json.loads(request.data)
    #api_key = app.config['UI_API_KEY']
    #headers={'X-Csrf-Token' : api_key}
    response = requests.post(app.config['SERVICES_URL'] + '/alert_alarm_definition', auth=(token, ''), data=request.data)
    return response.text, response.status_code

@app.route('/api/aa/alerts/<int:id>', methods=['PUT'])
def edit_aa_array(id):
    token = get_login()
    data = json.loads(request.data)
    #api_key = app.config['UI_API_KEY']
    #headers={'X-Csrf-Token' : api_key}
    response = requests.put(app.config['SERVICES_URL'] + '/alert_alarm_definition/%s' % id, auth=(token, ''), data=request.data)
    return response.text, response.status_code


# currently fitler all alert definiations by one id
@app.route('/api/aa/<string:id>', methods=['GET'])
def get_aa_specific_id(id):
    token = get_login()
    response = requests.get(app.config['SERVICES_URL'] + '/alert_alarm_definition?%s' % (id), auth=(token, ''), params=request.args)
    return response.text, response.status_code


# Get Alerts Options
#
#TODO
# http://localhost:4000/alert_alarm
#@app.route('/api/aa/array/', methods=['GET'])
#def get_aa_aptions(array_code):
#    token = get_login()
#    response = requests.get(app.config['SERVICES_URL'] + '/aa/options/%s/abstract' % (array_code), auth=(token, ''), params=request.args)
#    return response.text, response.status_code
