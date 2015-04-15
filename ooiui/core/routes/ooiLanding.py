#!/usr/bin/env python
'''
ooiui.core.routes.science

Defines the application routes
'''
from ooiui.core.app import app
from flask import request, render_template, Response, jsonify
from flask import stream_with_context, make_response
from ooiui.core.routes.common import get_login


import requests
import os
import json
from datetime import datetime,timedelta
import time
import numpy as np
import math

@app.route('/')
def new_index():
    return render_template('ooi-landing/index.html')

@app.route('/landing/pioneer')
def landing_pioneer():
    return render_template('landing/pioneer.html')

@app.route('/assets/list')
@app.route('/assets/list/')
def instr_index():
    return render_template('asset_management/assetslist.html')

@app.route('/events/list/')
def event_list():
    return render_template('asset_management/eventslist.html')

@app.route('/event/<int:id>', methods=['GET'])
def event_index(id):
    #?id=%s' % id
    return render_template('asset_management/event.html',id=id)

@app.route('/event/<string:new>/<int:aid>/<string:aclass>', methods=['GET'])
def event_new(new,aid,aclass):
    #?id=%s' % id
    return render_template('asset_management/event.html',id=str(new),assetid=aid,aclass=str(aclass))

@app.route('/streams')
@app.route('/streams/')
def streams_page():
    return render_template('science/streams.html')

@app.route('/getdata/')
def getData():
    '''
    gets data in the google chart format
    '''
    instr = request.args['instrument']
    stream = request.args['stream']

    #std = request.args['startdate']
    #edd = request.args['enddate']
    #param = request.args['variables']
    #ann = request.args['annotaton']
    ann = "?annotation=true"

    response = requests.get(app.config['SERVICES_URL'] + '/uframe/get_data'+"/"+instr+"/"+stream+ann, params=request.args)

    return response.text, response.status_code

@app.route('/api/annotation', methods=['GET'])
def get_annotations():
    response = requests.get(app.config['SERVICES_URL'] + '/annotation', params=request.args)
    return response.text, response.status_code, dict(response.headers)

@app.route('/api/annotation', methods=['POST'])
def post_annotation():
    token = get_login()
    response = requests.post(app.config['SERVICES_URL'] + '/annotation', auth=(token, ''), data=request.data)
    return response.text, response.status_code, dict(response.headers)

@app.route('/api/annotation/<int:id>', methods=['PUT'])
def put_annotation(id):
    token = get_login()
    response = requests.put(app.config['SERVICES_URL'] + '/annotation/%s' % id, auth=(token, ''), data=request.data)
    return response.text, response.status_code

#old
@app.route('/api/array')
def array_proxy():
    response = requests.get(app.config['SERVICES_URL'] + '/arrays', params=request.args)
    return response.text, response.status_code

#old
@app.route('/api/platform_deployment')
def platform_deployment_proxy():
    response = requests.get(app.config['SERVICES_URL'] + '/platform_deployments', params=request.args)
    return response.text, response.status_code

@app.route('/api/display_name')
def display_name():
    ref = request.args['reference_designator'];
    response = requests.get(app.config['SERVICES_URL'] + '/display_name'+"?reference_designator="+ref, params=request.args)
    return response.text, response.status_code

#Assets
@app.route('/api/asset_deployment', methods=['GET'])
def instrument_deployment_proxy():
    response = requests.get(app.config['SERVICES_URL'] + '/uframe/assets', params=request.args)
    return response.text, response.status_code

@app.route('/api/asset_deployment/<int:id>', methods=['GET'])
def instrument_deployment_get(id):
    response = requests.get(app.config['SERVICES_URL'] + '/uframe/assets/%s' % id, data=request.data)
    return response.text, response.status_code

@app.route('/api/asset_deployment/<int:id>', methods=['PUT'])
def instrument_deployment_put(id):
    response = requests.put(app.config['SERVICES_URL'] + '/uframe/assets/%s' % id, data=request.data)
    return response.text, response.status_code

@app.route('/api/asset_deployment', methods=['POST'])
def instrument_deployment_post():
    response = requests.post(app.config['SERVICES_URL'] + '/uframe/assets', data=request.data)
    return response.text, response.status_code

#not working/using now
@app.route('/api/asset_deployment/<int:id>', methods=['DELETE'])
def instrument_deployment_delete(id):
    response = requests.delete(app.config['SERVICES_URL'] + '/uframe/assets/%s' % id, data=request.data)
    return response.text, response.status_code

#Events
@app.route('/api/asset_events', methods=['GET'])
def event_deployments_proxy():
    response = requests.get(app.config['SERVICES_URL'] + '/uframe/events', params=request.args)
    return response.text, response.status_code

@app.route('/api/asset_events/<int:id>', methods=['GET'])
def event_deployment_get(id):
    response = requests.get(app.config['SERVICES_URL'] + '/uframe/events/%s' % id, params=request.args)
    return response.text, response.status_code

@app.route('/api/asset_events/<int:id>', methods=['PUT'])
def asset_event_put(id):
    response = requests.put(app.config['SERVICES_URL'] + '/uframe/events/%s' % id, data=request.data)
    return response.text, response.status_code

@app.route('/api/asset_events', methods=['POST'])
def asset_event_post():
    response = requests.post(app.config['SERVICES_URL'] + '/uframe/events', data=request.data)
    return response.text, response.status_code


@app.route('/opLog.html')
def op_log():
    return render_template("common/opLog.html")

@app.route('/api/uframe/stream')
def stream_proxy():
    token = get_login()
    response = requests.get(app.config['SERVICES_URL'] + '/uframe/stream', auth=(token, ''), params=request.args)
    return response.text, response.status_code

@app.route('/api/uframe/get_metadata/<string:stream_name>/<string:reference_designator>', methods=['GET'])
def metadata_proxy(stream_name,reference_designator):
    '''
    get metadata for a given ref and stream
    '''
    token = get_login()
    response = requests.get(app.config['SERVICES_URL'] + '/uframe/get_metadata/%s/%s' % (stream_name, reference_designator), auth=(token, ''), params=request.args)
    return response.text, response.status_code

@app.route('/api/uframe/get_metadata_times/<string:stream_name>/<string:reference_designator>', methods=['GET'])
def metadata_times_proxy(stream_name,reference_designator):
    '''
    get metadata times for a given ref and stream
    '''
    token = get_login()
    response = requests.get(app.config['SERVICES_URL'] + '/uframe/get_metadata_times/%s/%s' % (stream_name, reference_designator), auth=(token, ''), params=request.args)
    return response.text, response.status_code

@app.route('/api/uframe/get_csv/<string:stream_name>/<string:reference_designator>/<string:start>/<string:end>')
def get_csv(stream_name, reference_designator,start,end):
    token = get_login()
    dpa = "0"
    url = app.config['SERVICES_URL'] + '/uframe/get_csv/%s/%s/%s/%s/%s' % (stream_name, reference_designator,start,end,dpa)
    req = requests.get(url, auth=(token, ''), stream=True,params=request.args)
    return Response(stream_with_context(req.iter_content(chunk_size=1024*1024*4)), headers=dict(req.headers))

@app.route('/api/uframe/get_json/<string:stream_name>/<string:reference_designator>/<string:start>/<string:end>')
def get_json(stream_name, reference_designator,start,end):
    token = get_login()
    dpa = "0"
    url = app.config['SERVICES_URL'] + '/uframe/get_json/%s/%s/%s/%s/%s' % (stream_name, reference_designator,start,end,dpa)
    req = requests.get(url, auth=(token, ''), stream=True,params=request.args)
    return Response(stream_with_context(req.iter_content(chunk_size=1024*1024*4)), headers=dict(req.headers))

@app.route('/api/uframe/get_netcdf/<string:stream_name>/<string:reference_designator>/<string:start>/<string:end>')
def get_netcdf(stream_name, reference_designator,start,end):
    token = get_login()
    dpa = "0"
    req = requests.get(app.config['SERVICES_URL'] + '/uframe/get_netcdf/%s/%s/%s/%s/%s' % (stream_name, reference_designator,start,end,dpa), auth=(token, ''), stream=True)
    return Response(stream_with_context(req.iter_content(chunk_size=1024*1024*4)), headers=dict(req.headers))

@app.route('/api/uframe/get_profiles/<string:stream_name>/<string:reference_designator>')
def get_profiles(stream_name, reference_designator):
    token = get_login()
    req = requests.get(app.config['SERVICES_URL'] + '/uframe/get_profiles/%s/%s/%s/%s' % (stream_name, reference_designator), auth=(token, ''), stream=True)
    return Response(stream_with_context(req.iter_content(chunk_size=1024*1024*4)), headers=dict(req.headers))

@app.route('/svg/plot/<string:instrument>/<string:stream>', methods=['GET'])
def get_plotdemo(instrument, stream):
    token = get_login()
    import time    
    t0 = time.time()
    req = requests.get(app.config['SERVICES_URL'] + '/uframe/plot/%s/%s' % (instrument, stream), auth=(token, ''), params=request.args)
    t1 = time.time()
    print "GUI took %s" % (t1 - t0)
    return req.content, 200, dict(req.headers)

# C2 Routes
@app.route('/api/c2/array_display/<string:array_code>', methods=['GET'])
def get_c2_array_display(array_code):
    response = requests.get(app.config['SERVICES_URL'] + '/c2/array_display/%s' % (array_code))
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

