#!/usr/bin/env python
'''
ooiui.core.routes.m2m

Defines the application routes
'''
from ooiui.core.app import app
from flask import request
from ooiui.core.routes.common import get_login
import requests

# M2M Interface

# External API Request
# http://localhost:5000/api/m2m/get_data?data_type=sensor_inv&user_request=CP02PMUO/WFP01/03-CTDPFK000/telemetered/ctdpf_ckl_wfp_instrument%3FbeginDT=2015-10-14T15:15:27.000Z%26endDT=2015-10-15T15:15:27.000Z%26limit=1000%26parameters=PD1959,PD1960,PD1961,PD7,PD7,PD7
@app.route('/api/m2m/get_data')
def get_data():
    if request.authorization:
        api_user_name = request.authorization['username']
        api_user_token = request.authorization['password']
        url = app.config['SERVICES_URL'] + '/m2m/get_data'
        response = requests.get(url, auth=(api_user_name, api_user_token), params=request.args)
        return response.text, response.status_code
    else:
        return 'Please supply your API credentials', 401


@app.route('/api/m2m/get_metadata/<string:reference_designator>', methods=['GET'])
def get_metadata(reference_designator):
    '''
    get metadata for a given ref and stream
    '''
    token = get_login()
    response = requests.get(app.config['SERVICES_URL'] + '/m2m/get_metadata/%s' % (reference_designator), auth=(token, ''))
    return response.text, response.status_code

