#!/usr/bin/env python
'''
ooiui.core.routes.c2

Defines the application routes
'''
from ooiui.core.app import app
from flask import request, render_template, Response, jsonify
from flask import stream_with_context, make_response
from ooiui.core.routes.decorators import login_required, scope_required
from ooiui.core.routes.common import get_login
import json
import urllib2
import requests
from threading import Thread
from flask_socketio import SocketIO


thread = None

namespace = '/c2_direct_access'

async_mode = None

if async_mode is None:
    try:
        from gevent import monkey
        async_mode = 'gevent'
    except ImportError:
        pass

    if async_mode is None:
        async_mode = 'threading'

    # print('\n ***** async_mode is: ' + async_mode)

sio = SocketIO(app, async_mode=async_mode)


def is_json(input_json):
  try:
    json_object = json.loads(input_json)
  except ValueError, e:
    return False
  return True

@app.route('/cameras')
def c2_cameras():
    return render_template('science/camera_media.html')

#Mission Executive
######
#Mission Executive
@app.route('/mission/executive')
@app.route('/mission/executive/')
@scope_required('command_control')
@login_required()
def c2_mission_executive():
    urllib2.urlopen(app.config['GOOGLE_ANALYTICS_URL'] + '&dp=%2Fmissing%2Fexecutive')
    return render_template('c2/missionExecutive.html')

#Mission Load
@app.route('/mission/load')
@app.route('/mission/load/')
@scope_required('command_control')
@login_required()
def c2_mission_load():
    urllib2.urlopen(app.config['GOOGLE_ANALYTICS_URL'] + '&dp=%2Fmissing%2Fload')
    return render_template('c2/missionLoad.html')


#probably not going to use
@app.route('/c2/platforms')
@app.route('/c2/platforms/')
@scope_required('command_control')
@login_required()
def c2_platforms():
    urllib2.urlopen(app.config['GOOGLE_ANALYTICS_URL'] + '&dp=%2Fc2%2Fplatforms')
    return render_template('c2/platforms.html')

@app.route('/c2/instrument')
@app.route('/c2/instrument/')
@scope_required('command_control')
@login_required()
def c2_platform_status():
    urllib2.urlopen(app.config['GOOGLE_ANALYTICS_URL'] + '&dp=%2Fc2%2Finstrument')
    return render_template('c2/instrument.html')

#arrays list
@app.route('/c2')
@app.route('/c2/')
@scope_required('command_control')
@login_required()
def c2_index():
    urllib2.urlopen(app.config['GOOGLE_ANALYTICS_URL'] + '&dp=%2Fc2%2Flanding')
    return render_template('c2/landing.html')

#Mission Executive DATA PATHS
######
@app.route('/api/c2/missions', methods=['GET'])
@scope_required('command_control')
@login_required()
def get_c2_get_missions():
    token = get_login()
    response = requests.get(app.config['SERVICES_URL'] + '/c2/missions', auth=(token, ''))
    return response.text, response.status_code

@app.route('/api/c2/missions/<string:mission_id>', methods=['GET'])
@scope_required('command_control')
@login_required()
def get_c2_get_mission(mission_id):
    token = get_login()
    response = requests.get(app.config['SERVICES_URL'] + '/c2/missions/%s' % (mission_id), auth=(token, ''), params=request.args)
    return response.text, response.status_code

@app.route('/api/c2/missions', methods=['POST'])
@scope_required('command_control')
@login_required()
def get_c2_add_mission():
    token = get_login()
    response = requests.post(app.config['SERVICES_URL'] + '/c2/missions', auth=(token, ''), data=request.data)
    return response.text, response.status_code

@app.route('/api/c2/missions', methods=['PUT'])
@scope_required('command_control')
@login_required()
def get_c2_update_mission():
    token = get_login()
    response = requests.get(app.config['SERVICES_URL'] + '/c2/missions', auth=(token, ''), params=request.args)
    return response.text, response.status_code

@app.route('/api/c2/missions/<string:mission_id>/delete', methods=['GET'])
@scope_required('command_control')
@login_required()
def get_c2_del_mission(mission_id):
    token = get_login()
    response = requests.get(app.config['SERVICES_URL'] + '/c2/missions/%s/delete' % (mission_id), auth=(token, ''), params=request.data)
    return response.text, response.status_code

@app.route('/api/c2/missions/<string:mission_id>/activate', methods=['GET'])
@scope_required('command_control')
@login_required()
def get_c2_activate_mission(mission_id):
    token = get_login()
    response = requests.get(app.config['SERVICES_URL'] + '/c2/missions/%s/activate' % (mission_id), auth=(token, ''), params=request.args)
    return response.text, response.status_code

@app.route('/api/c2/missions/<string:mission_id>/deactivate', methods=['GET'])
@scope_required('command_control')
@login_required()
def get_c2_deactivate_mission(mission_id):
    token = get_login()
    response = requests.get(app.config['SERVICES_URL'] + '/c2/missions/%s/deactivate' % (mission_id), auth=(token, ''), params=request.data)
    return response.text, response.status_code


# C2 ooi-ui-services Routes

# ARRAYS
#
# http://localhost:4000/c2/arrays
@app.route('/api/c2/arrays', methods=['GET'])
@scope_required('command_control')
@login_required()
def get_c2_arrays_all():
    token = get_login()
    response = requests.get(app.config['SERVICES_URL'] + '/c2/arrays', auth=(token, ''))
    return response.text, response.status_code

# http://localhost:4000/c2/array/CP/abstract
@app.route('/api/c2/array/<string:array_code>/abstract', methods=['GET'])
@scope_required('command_control')
@login_required()
def get_c2_array_abstract(array_code):
    token = get_login()
    response = requests.get(app.config['SERVICES_URL'] + '/c2/array/%s/abstract' % (array_code), auth=(token, ''), params=request.args)
    return response.text, response.status_code

# http://localhost:4000/c2/array/CP/current_status_display
@app.route('/api/c2/array/<string:array_code>/current_status_display', methods=['GET'])
@scope_required('command_control')
@login_required()
def get_c2_array_current_status_display(array_code):
    token = get_login()
    response = requests.get(app.config['SERVICES_URL'] + '/c2/array/%s/current_status_display' % (array_code), auth=(token, ''), params=request.args)
    return response.text, response.status_code

# http://localhost:4000/c2/array/CP/history
@app.route('/api/c2/array/<string:array_code>/history', methods=['GET'])
@scope_required('command_control')
@login_required()
def get_c2_array_history(array_code):
    token = get_login()
    response = requests.get(app.config['SERVICES_URL'] + '/c2/array/%s/history' % (array_code), auth=(token, ''), params=request.args)
    return response.text, response.status_code

# http://localhost:4000/c2/array/CP/status_display
@app.route('/api/c2/array/<string:array_code>/status_display', methods=['GET'])
@scope_required('command_control')
@login_required()
def get_c2_array_status_display(array_code):
    token = get_login()
    response = requests.get(app.config['SERVICES_URL'] + '/c2/array/%s/status_display' % (array_code), auth=(token, ''), params=request.args)
    return response.text, response.status_code

# http://localhost:4000/c2/array/CP/mission_display
@app.route('/api/c2/array/<string:array_code>/mission_display', methods=['GET'])
@scope_required('command_control')
@login_required()
def get_c2_array_mission_display(array_code):
    token = get_login()
    response = requests.get(app.config['SERVICES_URL'] + '/c2/array/%s/mission_display' % (array_code), auth=(token, ''), params=request.args)
    return response.text, response.status_code


# PLATFORMS
#
# http://localhost:4000/c2/platform/CP02PMCO-WFP01/abstract
@app.route('/api/c2/platform/<string:platform_code>/abstract', methods=['GET'])
@scope_required('command_control')
@login_required()
def get_c2_platform_abstract(platform_code):
    token = get_login()
    response = requests.get(app.config['SERVICES_URL'] + '/c2/platform/%s/abstract' % (platform_code), auth=(token, ''), params=request.args)
    return response.text, response.status_code

# http://localhost:4000/c2/platform/CP02PMCO-WFP01/current_status_display
@app.route('/api/c2/platform/<string:platform_code>/current_status_display', methods=['GET'])
@scope_required('command_control')
@login_required()
def get_c2_platform_current_status_display(platform_code):
    token = get_login()
    response = requests.get(app.config['SERVICES_URL'] + '/c2/platform/%s/current_status_display' % (platform_code), auth=(token, ''), params=request.args)
    return response.text, response.status_code

# http://localhost:4000/c2/platform/CP02PMCO-WFP01/history
@app.route('/api/c2/platform/<string:platform_code>/history', methods=['GET'])
@scope_required('command_control')
@login_required()
def get_c2_platform_history(platform_code):
    token = get_login()
    response = requests.get(app.config['SERVICES_URL'] + '/c2/platform/%s/history' % (platform_code), auth=(token, ''), params=request.args)
    return response.text, response.status_code

# http://localhost:4000/c2/platform/CP02PMCO-WFP01/status_display
@app.route('/api/c2/platform/<string:platform_code>/status_display', methods=['GET'])
@scope_required('command_control')
@login_required()
def get_c2_platform_status_display(platform_code):
    token = get_login()
    response = requests.get(app.config['SERVICES_URL'] + '/c2/platform/%s/status_display' % (platform_code), auth=(token, ''), params=request.args)
    return response.text, response.status_code

# http://localhost:4000/c2/platform/CP02PMCO-WFP01-05-PARADK000/commands
@app.route('/api/c2/platform/<string:platform_code>/commands', methods=['GET'])
@scope_required('command_control')
@login_required()
def get_c2_platform_commands(platform_code):
    token = get_login()
    response = requests.get(app.config['SERVICES_URL'] + '/c2/platform/%s/commands' % (platform_code), auth=(token, ''), params=request.args)
    return response.text, response.status_code

# http://localhost:4000/c2/platform/CP02PMCO-WFP01/mission_display
@app.route('/api/c2/platform/<string:platform_code>/mission_display', methods=['GET'])
@scope_required('command_control')
@login_required()
def get_c2_platform_mission_display(platform_code):
    token = get_login()
    response = requests.get(app.config['SERVICES_URL'] + '/c2/platform/%s/mission_display' % (platform_code), auth=(token, ''), params=request.args)
    return response.text, response.status_code

# http://localhost:4000/c2/platform/CP02PMCO-WFP01/ports_display
@app.route('/api/c2/platform/<string:platform_code>/ports_display', methods=['GET'])
@scope_required('command_control')
@login_required()
def get_c2_platform_portsdisplay(platform_code):
    token = get_login()
    response = requests.get(app.config['SERVICES_URL'] + '/c2/platform/%s/ports_display' % (platform_code), auth=(token, ''), params=request.args)
    return response.text, response.status_code

@app.route('/api/c2/platform/<string:platform_code>/execute', methods=['POST'])
@scope_required('command_control')
@login_required()
def c2_execute_command_plat(platform_code):
    token = get_login()
    data = request.json

    response = requests.post(app.config['SERVICES_URL'] + '/c2/platform/%s/execute' % (instrument_ref), auth=(token, ''), data=request.data)
    return response.text, response.status_code

@app.route('/api/c2/platform/<string:platform_code>/parameters', methods=['POST'])
@scope_required('command_control')
@login_required()
def c2_edit_plat_params(platform_code):
    token = get_login()
    data = request.json

    response = requests.post(app.config['SERVICES_URL'] + '/c2/platform/%s/parameters' % (instrument_ref), auth=(token, ''), data=request.data)
    return response.text, response.status_code

# INSTRUMENTS
#
# http://localhost:4000/c2/instrument/CP02PMCO-WFP01-05-PARADK000/abstract
@app.route('/api/c2/instrument/<string:instrument_code>/abstract', methods=['GET'])
@scope_required('command_control')
@login_required()
def get_c2_instrument_abstract(instrument_code):
    token = get_login()
    response = requests.get(app.config['SERVICES_URL'] + '/c2/instrument/%s/abstract' % (instrument_code), auth=(token, ''), params=request.args)
    return response.text, response.status_code

# http://localhost:4000/c2/instrument/CP02PMCO-WFP01-05-PARADK000/streams
@app.route('/api/c2/instrument/<string:instrument_code>/streams', methods=['GET'])
@scope_required('command_control')
@login_required()
def get_c2_instrument_streams(instrument_code):
    token = get_login()
    response = requests.get(app.config['SERVICES_URL'] + '/c2/instrument/%s/streams' % (instrument_code), auth=(token, ''), params=request.args)
    return response.text, response.status_code

# http://localhost:4000/c2/instrument/CP02PMCO-WFP01-05-PARADK000/commands
@app.route('/api/c2/instrument/<string:instrument_code>/commands', methods=['GET'])
@scope_required('command_control')
@login_required()
def get_c2_instrument_commands(instrument_code):
    token = get_login()
    response = requests.get(app.config['SERVICES_URL'] + '/c2/instrument/%s/commands' % (instrument_code), auth=(token, ''), params=request.args)
    return response.text, response.status_code

# http://localhost:4000/c2/instrument/CP02PMCO-WFP01-05-PARADK000/history
@app.route('/api/c2/instrument/<string:instrument_code>/history', methods=['GET'])
@scope_required('command_control')
@login_required()
def get_c2_instrument_history(instrument_code):
    token = get_login()
    response = requests.get(app.config['SERVICES_URL'] + '/c2/instrument/%s/history' % (instrument_code), auth=(token, ''), params=request.args)
    return response.text, response.status_code

# http://localhost:4000/c2/instrument/CP02PMCO-WFP01-05-PARADK000/status_display
@app.route('/api/c2/instrument/<string:instrument_code>/status_display', methods=['GET'])
@scope_required('command_control')
@login_required()
def get_c2_instrument_status_display(instrument_code):
    token = get_login()
    response = requests.get(app.config['SERVICES_URL'] + '/c2/instrument/%s/status_display' % (instrument_code), auth=(token, ''), params=request.args)
    return response.text, response.status_code

# http://localhost:4000/c2/instrument/CP02PMCO-WFP01-05-PARADK000/mission_display
@app.route('/api/c2/instrument/<string:instrument_code>/mission_display', methods=['GET'])
@scope_required('command_control')
@login_required()
def get_c2_instrument_mission_display(instrument_code):
    token = get_login()
    response = requests.get(app.config['SERVICES_URL'] + '/c2/instrument/%s/mission_display' % (instrument_code), auth=(token, ''), params=request.args)
    return response.text, response.status_code

# http://localhost:4000/c2/instrument/CP02PMCO-WFP01-02-DOFSTK000/dofst_k_wfp_metadata/fields
# http://localhost:4000/c2/instrument/CP02PMCO-WFP01-05-PARADK000/parad_k_stc_imodem_instrument/fields
@app.route('/api/c2/instrument/<string:instrument_code>/<string:stream_code>/fields', methods=['GET'])
@scope_required('command_control')
@login_required()
def get_c2_instrument_stream_fields(instrument_code, stream_code):
    token = get_login()
    response = requests.get(app.config['SERVICES_URL'] + '/c2/instrument/%s/%s/fields' % (instrument_code, stream_code), auth=(token, ''), params=request.args)
    return response.text, response.status_code

# http://localhost:4000/c2/instrument/CP02PMCO-WFP01-05-PARADK000/parad_k_stc_imodem_instrument/fields
@app.route('/api/c2/instrument/<string:instrument_code>/ports_display', methods=['GET'])
@scope_required('command_control')
@login_required()
def get_c2_instrument_ports_display(instrument_code):
    token = get_login()
    response = requests.get(app.config['SERVICES_URL'] + '/c2/instrument/%s/ports_display' % (instrument_code), auth=(token, ''), params=request.args)
    return response.text, response.status_code

@app.route('/api/c2/instrument/<string:instrument_ref>/execute', methods=['POST'])
@scope_required('command_control')
@login_required()
def c2_execute_command(instrument_ref):
    token = get_login()
    data = request.json

    response = requests.post(app.config['SERVICES_URL'] + '/c2/instrument/%s/execute' % (instrument_ref), auth=(token, ''), data=request.data)
    return response.text, response.status_code

@app.route('/api/c2/instrument/<string:instrument_ref>/parameters', methods=['POST'])
@scope_required('command_control')
@login_required()
def c2_edit_instr_params(instrument_ref):
    token = get_login()
    data = request.json

    response = requests.post(app.config['SERVICES_URL'] + '/c2/instrument/%s/parameters' % (instrument_ref), auth=(token, ''), data=request.data)
    return response.text, response.status_code


# STATUS and SAMPLE GET
#
@app.route('/api/c2/sample/<string:ref_code>', methods=['GET'])
@scope_required('command_control')
@login_required()
def get_c2_instrument_sample(ref_code):
    token = get_login()
    response = requests.get(app.config['SERVICES_URL'] + '/c2/instrument/%s/ports_display' % (ref_code), auth=(token, ''), params=request.args)
    return response.text, response.status_code

@app.route('/api/c2/status/<string:ref_code>', methods=['GET'])
@scope_required('command_control')
@login_required()
def get_c2_instrument_status(ref_code):
    token = get_login()
    response = requests.get(app.config['SERVICES_URL'] + '/c2/instrument/%s/ports_display' % (ref_code), auth=(token, ''), params=request.args)
    return response.text, response.status_code

@app.route('/api/c2/instrument/<string:ref_code>/get_last_particle/<string:stream_method>/<string:stream_name>', methods=['GET'])
@scope_required('command_control')
@login_required()
def get_c2_instrument_last_particle(ref_code, stream_method, stream_name):
    token = get_login()
    response = requests.get(app.config['SERVICES_URL'] + '/c2/instrument/%s/get_last_particle/%s/%s' % (ref_code, stream_method, stream_name), auth=(token, ''), params=request.args)
    if is_json(response.text):
        # print 'good json'
        return response.text, response.status_code
    else:
        # print 'bad json'
        return '{"error": "bad json data"}'

@app.route('/api/c2/instrument/<string:ref_code>/direct_access/start', methods=['GET'])
@scope_required('command_control')
@login_required()
def c2_direct_access_start(ref_code):
    token = get_login()
    response = requests.get(app.config['SERVICES_URL'] + '/c2/instrument/%s/direct_access/start' % (ref_code), auth=(token, ''), params=request.args)
    if is_json(response.text):
        # print 'good json'
        return response.text, response.status_code
    else:
        # print 'bad json'
        return '{"error": "bad json data"}'

@app.route('/api/c2/instrument/<string:ref_code>/direct_access/execute', methods=['POST'])
@scope_required('command_control')
@login_required()
def c2_direct_access_execute(ref_code):
    # print request.data
    # print request.json
    token = get_login()
    response = requests.post(app.config['SERVICES_URL'] + '/c2/instrument/%s/direct_access/execute' % (ref_code), auth=(token, ''), data=request.data)
    if is_json(response.text):
        # print 'good json'
        return response.text, response.status_code
    else:
        # print 'bad json'
        # print response.text
        return '{"error": "bad json data"}'

@app.route('/api/c2/instrument/<string:ref_code>/direct_access/exit', methods=['GET'])
@scope_required('command_control')
@login_required()
def c2_direct_access_exit(ref_code):
    token = get_login()
    response = requests.get(app.config['SERVICES_URL'] + '/c2/instrument/%s/direct_access/exit' % (ref_code), auth=(token, ''), params=request.args)
    if is_json(response.text):
        # print 'good json'
        return response.text, response.status_code
    else:
        # print 'bad json'
        return '{"error": "bad json data"}'

@app.route('/api/c2/instrument/<string:ref_code>/direct_access/sniffer', methods=['POST'])
@scope_required('command_control')
@login_required()
def c2_direct_access_sniffer(ref_code):
    # print request.data
    # print request.json
    token = get_login()

    debug = False

    result = start_thread()
    if result is None:
        # print '\n ***** error: thread was not set (None)...'
        message = 'Unable to start_thread (%s).' % rd
        raise Exception(message)

    response = requests.post(app.config['SERVICES_URL'] + '/c2/instrument/%s/direct_access/sniffer' % (ref_code), auth=(token, ''), data=request.data)
    if is_json(response.text):
        if debug:
            print 'good json'
            print (json.loads(response.text))['msg']
        # do_emmit(namespace, (json.loads(response.text))['msg'])
        return response.text, response.status_code
    else:
        print 'bad json'
        print response.text
        return '{"error": "bad json data"}'


def do_emmit(namespace, data, room=None):
    """ emit to client, no broadcast, and, if room is provided then send it also. room is title (minus spaces).
    """
    debug = False
    if debug:
        print 'this will be the data'
        print data
        print 'this will be sio'
        print sio
    try:
        if room is None:
            if namespace is not None:
                sio.emit('my result', {'data': data}, namespace=namespace, broadcast=False)
            else:
                sio.emit('my result', {'data': data}, broadcast=False)
        else:
            if debug: print '\n send to room: ', room
            if namespace is not None:
                sio.emit('my result', {'data': data}, room=room, namespace=namespace, broadcast=False)
            else:
                sio.emit('my result', {'data': data}, room=room, broadcast=False)

    except Exception as err:
        if debug: print '\n exception in do_emmit: %s' % str(err)
        pass

def start_thread():
    debug = False
    global thread
    if thread is None:
        if debug: print '\n Started thread...'
        thread = Thread() #target=background_thread)
        thread.daemon = True
        thread.start()
    else:
        if debug: print '\n already have thread....'
    return thread