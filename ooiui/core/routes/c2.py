#!/usr/bin/env python
'''
ooiui.core.routes.c2

Defines the application routes
'''
from ooiui.core.app import app
from flask import request, render_template, Response, jsonify
from flask import stream_with_context, make_response
from ooiui.core.routes.common import get_login
import json
import urllib2

import requests

#probably not going to use
@app.route('/c2/platforms')
@app.route('/c2/platforms/')
def c2_platforms():
    urllib2.urlopen(app.config['GOOGLE_ANALYTICS_URL'] + '&dp=%2Fc2%2Fplatforms')
    return render_template('c2/platforms.html')

@app.route('/c2/instrument')
@app.route('/c2/instrument/')
def c2_platform_status():
    urllib2.urlopen(app.config['GOOGLE_ANALYTICS_URL'] + '&dp=%2Fc2%2Finstrument')
    return render_template('c2/instrument.html')

#arrays list
@app.route('/c2')
@app.route('/c2/')
def c2_index():
    urllib2.urlopen(app.config['GOOGLE_ANALYTICS_URL'] + '&dp=%2Fc2%2Flanding')
    return render_template('c2/landing.html')

# C2 ooi-ui-services Routes

# ARRAYS
#
# http://localhost:4000/c2/arrays
@app.route('/api/c2/arrays', methods=['GET'])
def get_c2_arrays_all():
    token = get_login()
    response = requests.get(app.config['SERVICES_URL'] + '/c2/arrays', auth=(token, ''))
    return response.text, response.status_code

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


# PLATFORMS
#
# http://localhost:4000/c2/platform/CP02PMCO-WFP01/abstract
@app.route('/api/c2/platform/<string:platform_code>/abstract', methods=['GET'])
def get_c2_platform_abstract(platform_code):
    token = get_login()
    response = requests.get(app.config['SERVICES_URL'] + '/c2/platform/%s/abstract' % (platform_code), auth=(token, ''), params=request.args)
    return response.text, response.status_code

# http://localhost:4000/c2/platform/CP02PMCO-WFP01/current_status_display
@app.route('/api/c2/platform/<string:platform_code>/current_status_display', methods=['GET'])
def get_c2_platform_current_status_display(platform_code):
    token = get_login()
    response = requests.get(app.config['SERVICES_URL'] + '/c2/platform/%s/current_status_display' % (platform_code), auth=(token, ''), params=request.args)
    return response.text, response.status_code

# http://localhost:4000/c2/platform/CP02PMCO-WFP01/history
@app.route('/api/c2/platform/<string:platform_code>/history', methods=['GET'])
def get_c2_platform_history(platform_code):
    token = get_login()
    response = requests.get(app.config['SERVICES_URL'] + '/c2/platform/%s/history' % (platform_code), auth=(token, ''), params=request.args)
    return response.text, response.status_code

# http://localhost:4000/c2/platform/CP02PMCO-WFP01/status_display
@app.route('/api/c2/platform/<string:platform_code>/status_display', methods=['GET'])
def get_c2_platform_status_display(platform_code):
    token = get_login()
    response = requests.get(app.config['SERVICES_URL'] + '/c2/platform/%s/status_display' % (platform_code), auth=(token, ''), params=request.args)
    return response.text, response.status_code

# http://localhost:4000/c2/platform/CP02PMCO-WFP01-05-PARADK000/commands
@app.route('/api/c2/platform/<string:platform_code>/commands', methods=['GET'])
def get_c2_platform_commands(platform_code):
    token = get_login()
    response = requests.get(app.config['SERVICES_URL'] + '/c2/platform/%s/commands' % (platform_code), auth=(token, ''), params=request.args)
    return response.text, response.status_code

# http://localhost:4000/c2/platform/CP02PMCO-WFP01/mission_display
@app.route('/api/c2/platform/<string:platform_code>/mission_display', methods=['GET'])
def get_c2_platform_mission_display(platform_code):
    token = get_login()
    response = requests.get(app.config['SERVICES_URL'] + '/c2/platform/%s/mission_display' % (platform_code), auth=(token, ''), params=request.args)
    return response.text, response.status_code

# http://localhost:4000/c2/platform/CP02PMCO-WFP01/ports_display
@app.route('/api/c2/platform/<string:platform_code>/ports_display', methods=['GET'])
def get_c2_platform_portsdisplay(platform_code):
    token = get_login()
    response = requests.get(app.config['SERVICES_URL'] + '/c2/platform/%s/ports_display' % (platform_code), auth=(token, ''), params=request.args)
    return response.text, response.status_code

@app.route('/api/c2/platform/<string:platform_code>/execute', methods=['POST'])
def c2_execute_command_plat(platform_code):
    token = get_login()
    data = request.json

    response = requests.post(app.config['SERVICES_URL'] + '/c2/platform/%s/execute' % (instrument_ref), auth=(token, ''), data=request.data)
    return response.text, response.status_code

@app.route('/api/c2/platform/<string:platform_code>/parameters', methods=['POST'])
def c2_edit_plat_params(platform_code):
    token = get_login()
    data = request.json

    response = requests.post(app.config['SERVICES_URL'] + '/c2/platform/%s/parameters' % (instrument_ref), auth=(token, ''), data=request.data)
    return response.text, response.status_code

# INSTRUMENTS
#
# http://localhost:4000/c2/instrument/CP02PMCO-WFP01-05-PARADK000/abstract
@app.route('/api/c2/instrument/<string:instrument_code>/abstract', methods=['GET'])
def get_c2_instrument_abstract(instrument_code):
    token = get_login()
    response = requests.get(app.config['SERVICES_URL'] + '/c2/instrument/%s/abstract' % (instrument_code), auth=(token, ''), params=request.args)
    return response.text, response.status_code

# http://localhost:4000/c2/instrument/CP02PMCO-WFP01-05-PARADK000/streams
@app.route('/api/c2/instrument/<string:instrument_code>/streams', methods=['GET'])
def get_c2_instrument_streams(instrument_code):
    token = get_login()
    response = requests.get(app.config['SERVICES_URL'] + '/c2/instrument/%s/streams' % (instrument_code), auth=(token, ''), params=request.args)
    return response.text, response.status_code

# http://localhost:4000/c2/instrument/CP02PMCO-WFP01-05-PARADK000/commands
@app.route('/api/c2/instrument/<string:instrument_code>/commands', methods=['GET'])
def get_c2_instrument_commands(instrument_code):
    token = get_login()
    response = requests.get(app.config['SERVICES_URL'] + '/c2/instrument/%s/commands' % (instrument_code), auth=(token, ''), params=request.args)
    return response.text, response.status_code

# http://localhost:4000/c2/instrument/CP02PMCO-WFP01-05-PARADK000/history
@app.route('/api/c2/instrument/<string:instrument_code>/history', methods=['GET'])
def get_c2_instrument_history(instrument_code):
    token = get_login()
    response = requests.get(app.config['SERVICES_URL'] + '/c2/instrument/%s/history' % (instrument_code), auth=(token, ''), params=request.args)
    return response.text, response.status_code

# http://localhost:4000/c2/instrument/CP02PMCO-WFP01-05-PARADK000/status_display
@app.route('/api/c2/instrument/<string:instrument_code>/status_display', methods=['GET'])
def get_c2_instrument_status_display(instrument_code):
    token = get_login()
    response = requests.get(app.config['SERVICES_URL'] + '/c2/instrument/%s/status_display' % (instrument_code), auth=(token, ''), params=request.args)
    return response.text, response.status_code

# http://localhost:4000/c2/instrument/CP02PMCO-WFP01-05-PARADK000/mission_display
@app.route('/api/c2/instrument/<string:instrument_code>/mission_display', methods=['GET'])
def get_c2_instrument_mission_display(instrument_code):
    token = get_login()
    response = requests.get(app.config['SERVICES_URL'] + '/c2/instrument/%s/mission_display' % (instrument_code), auth=(token, ''), params=request.args)
    return response.text, response.status_code

# http://localhost:4000/c2/instrument/CP02PMCO-WFP01-02-DOFSTK000/dofst_k_wfp_metadata/fields
# http://localhost:4000/c2/instrument/CP02PMCO-WFP01-05-PARADK000/parad_k_stc_imodem_instrument/fields
@app.route('/api/c2/instrument/<string:instrument_code>/<string:stream_code>/fields', methods=['GET'])
def get_c2_instrument_stream_fields(instrument_code, stream_code):
    token = get_login()
    response = requests.get(app.config['SERVICES_URL'] + '/c2/instrument/%s/%s/fields' % (instrument_code, stream_code), auth=(token, ''), params=request.args)
    return response.text, response.status_code

# http://localhost:4000/c2/instrument/CP02PMCO-WFP01-05-PARADK000/parad_k_stc_imodem_instrument/fields
@app.route('/api/c2/instrument/<string:instrument_code>/ports_display', methods=['GET'])
def get_c2_instrument_ports_display(instrument_code):
    token = get_login()
    response = requests.get(app.config['SERVICES_URL'] + '/c2/instrument/%s/ports_display' % (instrument_code), auth=(token, ''), params=request.args)
    return response.text, response.status_code

@app.route('/api/c2/instrument/<string:instrument_ref>/execute', methods=['POST'])
def c2_execute_command(instrument_ref):
    token = get_login()
    data = request.json

    response = requests.post(app.config['SERVICES_URL'] + '/c2/instrument/%s/execute' % (instrument_ref), auth=(token, ''), data=request.data)
    return response.text, response.status_code

@app.route('/api/c2/instrument/<string:instrument_ref>/parameters', methods=['POST'])
def c2_edit_instr_params(instrument_ref):
    token = get_login()
    data = request.json

    response = requests.post(app.config['SERVICES_URL'] + '/c2/instrument/%s/parameters' % (instrument_ref), auth=(token, ''), data=request.data)
    return response.text, response.status_code


# STATUS and SAMPLE GET
#
@app.route('/api/c2/sample/<string:ref_code>', methods=['GET'])
def get_c2_instrument_sample(ref_code):
    token = get_login()
    response = requests.get(app.config['SERVICES_URL'] + '/c2/instrument/%s/ports_display' % (ref_code), auth=(token, ''), params=request.args)
    return response.text, response.status_code

@app.route('/api/c2/status/<string:ref_code>', methods=['GET'])
def get_c2_instrument_status(ref_code):
    token = get_login()
    response = requests.get(app.config['SERVICES_URL'] + '/c2/instrument/%s/ports_display' % (ref_code), auth=(token, ''), params=request.args)
    return response.text, response.status_code
