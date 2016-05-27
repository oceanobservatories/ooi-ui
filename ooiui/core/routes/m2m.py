#!/usr/bin/env python
'''
ooiui.core.routes.m2m

Defines the application routes
'''
from ooiui.core.app import app
from flask import request, render_template, Response, jsonify
from flask import stream_with_context
from ooiui.core.routes.common import get_login
from ooiui.core.routes.decorators import login_required, scope_required
import requests
import urllib2

#M2M Interface
@login_required()
@scope_required('data_manager')
@app.route('/api/m2m/get_data/')
def get_data():
    token = get_login()
    print token
    params = ''
    for term in request.args:
        if term != 'uframe':
            params =  params +  '&' + term + '=' + request.args.get(term)
    url = app.config['SERVICES_URL'] + '/m2m/get_data/?uframe=%s' %(request.args.get('uframe').replace('?','(')+params.replace('&',')'))
    data = requests.get(url, auth=(token, ''), params=request.args)
    return data.text


#@login_required()
@app.route('/api/m2m/get_metadata/<string:reference_designator>', methods=['GET'])
def get_metadata(reference_designator):
    '''
    get metadata for a given ref and stream
    '''
    token = get_login()
    response = requests.get(app.config['SERVICES_URL'] + '/m2m/get_metadata/%s' % (reference_designator), auth=(token, ''))
    return response.text, response.status_code

