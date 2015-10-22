#!/usr/bin/env python
'''
ooiui.core.routes.m2m

Defines the application routes
'''
from ooiui.core.app import app
from flask import request, render_template, Response, jsonify
from flask import stream_with_context
from ooiui.core.routes.common import get_login
import requests
import urllib2

#M2M Interface

@app.route('/api/m2m/get_data/<string:reference_designator>/<string:method>/<string:stream>/<string:start>/<string:end>')
def get_data(reference_designator, method, stream, start, end):
    token = get_login()
    url = app.config['SERVICES_URL'] + '/m2m/get_data/%s/%s/%s/%s/%s' % (reference_designator, method, stream, start, end)
    print url
    for each in request.args:
        print each, request.args[each]
    response = requests.get(url, auth=(token, ''), params=request.args)
    print response.text
    return response.text, response.status_code


@app.route('/api/m2m/get_metadata/<string:reference_designator>', methods=['GET'])
def get_metadata(reference_designator):
    '''
    get metadata for a given ref and stream
    '''
    token = get_login()
    response = requests.get(app.config['SERVICES_URL'] + '/m2m/get_metadata/%s' % (reference_designator), auth=(token, ''))
    return response.text, response.status_code

