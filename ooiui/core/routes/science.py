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
    return render_template('science/index.html')

@app.route('/landing/pioneer')
def landing_pioneer():
    return render_template('landing/pioneer.html')

@app.route('/assets/platforms')
@app.route('/assets/platforms/')
def plat_index():
    return render_template('asset_management/platform_list.html')

@app.route('/assets/instruments')
@app.route('/assets/instruments/')
def instr_index():
    return render_template('asset_management/instrument_list.html')

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

@app.route('/api/array')
def array_proxy():
    response = requests.get(app.config['SERVICES_URL'] + '/arrays', params=request.args)
    return response.text, response.status_code

@app.route('/api/platform_deployment')
def platform_deployment_proxy():
    response = requests.get(app.config['SERVICES_URL'] + '/platform_deployments', params=request.args)
    return response.text, response.status_code

@app.route('/api/instrument_deployment', methods=['GET'])
def instrument_deployment_proxy():
    response = requests.get(app.config['SERVICES_URL'] + '/instrument_deployment', params=request.args)
    return response.text, response.status_code

@app.route('/api/instrument_deployment/<int:id>', methods=['PUT'])
def instrument_deployment_put(id):
    response = requests.put(app.config['SERVICES_URL'] + '/instrument_deployment/%s' % id, data=request.data)
    return response.text, response.status_code

@app.route('/api/instrument_deployment', methods=['POST'])
def instrument_deployment_post():
    response = requests.post(app.config['SERVICES_URL'] + '/instrument_deployment', data=request.data)
    return response.text, response.status_code

@app.route('/api/instrument_deployment/<int:id>', methods=['DELETE'])
def instrument_deployment_delete(id):
    response = requests.delete(app.config['SERVICES_URL'] + '/instrument_deployment/%s' % id, data=request.data)
    return response.text, response.status_code

@app.route('/opLog.html')
def op_log():
    return render_template("common/opLog.html")

@app.route('/api/uframe/stream')
def stream_proxy():
    response = requests.get(app.config['SERVICES_URL'] + '/uframe/stream', params=request.args)
    return response.text, response.status_code

@app.route('/api/uframe/get_csv/<string:stream_name>/<string:reference_designator>')
def get_csv(stream_name, reference_designator):
    req = requests.get(app.config['SERVICES_URL'] + '/uframe/get_csv/%s/%s' % (stream_name, reference_designator), stream=True)
    return Response(stream_with_context(req.iter_content(chunk_size=1024*1024*4)), headers=dict(req.headers))

@app.route('/api/uframe/get_json/<string:stream_name>/<string:reference_designator>')
def get_json(stream_name, reference_designator):
    req = requests.get(app.config['SERVICES_URL'] + '/uframe/get_json/%s/%s' % (stream_name, reference_designator), stream=True)
    return Response(stream_with_context(req.iter_content(chunk_size=1024*1024*4)), headers=dict(req.headers))

@app.route('/api/uframe/get_netcdf/<string:stream_name>/<string:reference_designator>')
def get_netcdf(stream_name, reference_designator):
    req = requests.get(app.config['SERVICES_URL'] + '/uframe/get_netcdf/%s/%s' % (stream_name, reference_designator), stream=True)
    return Response(stream_with_context(req.iter_content(chunk_size=1024*1024*4)), headers=dict(req.headers))

@app.route('/svg/plot/<string:instrument>/<string:stream>', methods=['GET'])
def get_plotdemo(instrument, stream):
    import time
    t0 = time.time()
    req = requests.get(app.config['SERVICES_URL'] + '/plot/%s/%s' % (instrument, stream), params=request.args)
    t1 = time.time()
    print "GUI took %s" % (t1 - t0)
    return req.content, 200, dict(req.headers)

