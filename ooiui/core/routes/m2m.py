#!/usr/bin/env python
"""
ooiui.core.routes.m2m

Defines the application routes
"""
import requests
from flask import Response
from flask import request
from flask import render_template

from ooiui.core.app import app


@app.route('/api/m2m', methods=['GET', 'PUT', 'POST', 'DELETE'], defaults={'path': ''})
@app.route('/api/m2m/<path:path>', methods=['GET', 'PUT', 'POST', 'DELETE'])
def m2m_handler(path):
    transfer_header_fields = ['Date', 'Content-Type']
    #app.logger.info(path)
    if request.authorization:
        api_user_name = request.authorization['username']
        api_user_token = request.authorization['password']
        url = app.config['SERVICES_URL'] + '/m2m/%s' % path
        if request.method == 'GET':
            url = app.config['SERVICES_URL'] + '/m2m/%s' % path
            response = requests.get(url,
                                    auth=(api_user_name, api_user_token),
                                    params=request.args,
                                    stream=True,
                                    data=request.data)
        elif request.method == 'POST':
            response = requests.post(url,
                                     auth=(api_user_name, api_user_token),
                                     params=request.args,
                                     stream=True,
                                     data=request.data)
        elif request.method == 'PUT':
            response = requests.put(url,
                                    auth=(api_user_name, api_user_token),
                                    params=request.args,
                                    stream=True,
                                    data=request.data)

        elif request.method == 'DELETE':
            response = requests.delete(url,
                                    auth=(api_user_name, api_user_token),
                                    params=request.args)

        else:
            return 'Improper request method \'%s\', only GET, PUT, POST and DELETE are supported. ' % request.method
        headers = dict(response.headers)
        headers = {k: headers[k] for k in headers if k in transfer_header_fields}
        return Response(response.iter_content(1024), response.status_code, headers)
    else:
        return 'Please supply your API credentials', 401

@app.route('/help/m2m')
def m2m_help_page():
    return render_template('common/help_m2m.html', tracking=app.config['GOOGLE_ANALYTICS'])