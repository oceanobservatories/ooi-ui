#!/usr/bin/env python
'''
ooiui.core.routes.c2

Defines the application routes
'''
from ooiui.core.app import app
from flask import request, render_template, Response, jsonify
from flask import stream_with_context, make_response
from ooiui.core.routes.common import get_login


import requests

# C2 Page Routes
@app.route('/c2/arrays')
@app.route('/c2/arrays/')
def c2_arrays():
    return render_template('c2/array_display.html')

# C2 ooi-ui-services Routes
# http://localhost:4000/c2/array/CP/abstract
@app.route('/api/c2/array/<string:array_code>/abstract', methods=['GET'])
def get_c2_array_abstract(array_code):
    token = get_login()
    response = requests.get(app.config['SERVICES_URL'] + '/c2/array/%s/abstract' % (array_code), auth=(token, ''), params=request.args)
    return response.text, response.status_code

# http://localhost:4000/c2/array/CP/current_status_display
@app.route('/api/c2/array/<string:array_code>/current_status_display', methods=['GET'])
def get_c2_array_current_status_display(array_code):
    token = get_login()
    response = requests.get(app.config['SERVICES_URL'] + '/c2/array/%s/current_status_display' % (array_code), auth=(token, ''), params=request.args)
    return response.text, response.status_code
# http://localhost:4000/c2/array/CP/history
@app.route('/api/c2/array/<string:array_code>/history', methods=['GET'])
def get_c2_array_history(array_code):
    token = get_login()
    response = requests.get(app.config['SERVICES_URL'] + '/c2/array/%s/history' % (array_code), auth=(token, ''), params=request.args)
    return response.text, response.status_code

# http://localhost:4000/c2/array/CP/status_display
@app.route('/api/c2/array/<string:array_code>/status_display', methods=['GET'])
def get_c2_array_status_display(array_code):
    token = get_login()
    response = requests.get(app.config['SERVICES_URL'] + '/c2/array/%s/status_display' % (array_code), auth=(token, ''), params=request.args)
    return response.text, response.status_code

# http://localhost:4000/c2/array/CP/mission_display
@app.route('/api/c2/array/<string:array_code>/mission_display', methods=['GET'])
def get_c2_array_mission_display(array_code):
    token = get_login()
    response = requests.get(app.config['SERVICES_URL'] + '/c2/array/%s/mission_display' % (array_code), auth=(token, ''), params=request.args)
    return response.text, response.status_code





@app.route('/api/c2/platform_display/<string:reference_designator>', methods=['GET'])
def get_c2_platform_display(reference_designator):
    response = requests.get(app.config['SERVICES_URL'] + '/c2/platform_display/%s' % (reference_designator))
    return response.text, response.status_code

@app.route('/api/c2/instrument_display/<string:reference_designator>', methods=['GET'])
def get_c2_instrument_display(reference_designator):
    response = requests.get(app.config['SERVICES_URL'] + '/c2/instrument_display/%s' % (reference_designator))
    return response.text, response.status_code

@app.route('/api/c2/instrument/<string:reference_designator>/<string:stream_name>', methods=['GET'])
def get_c2_instrument_fields(reference_designator, stream_name):
    response = requests.get(app.config['SERVICES_URL'] + '/c2/instrument/%s/%s/fields' % (reference_designator, stream_name))
    return response.text, response.status_code