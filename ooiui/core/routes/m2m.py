#!/usr/bin/env python
"""
ooiui.core.routes.m2m

Defines the application routes
"""
import requests
from flask import request

from ooiui.core.app import app


@app.route('/api/m2m', methods=['GET'], defaults={'path': ''})
@app.route('/api/m2m/<path:path>', methods=['GET'])
def m2m_handler(path):
    app.logger.info(path)
    if request.authorization:
        api_user_name = request.authorization['username']
        api_user_token = request.authorization['password']
        url = app.config['SERVICES_URL'] + '/m2m/%s' % path
        response = requests.get(url, auth=(api_user_name, api_user_token), params=request.args)
        return response.text, response.status_code, dict(response.headers)
    else:
        return 'Please supply your API credentials', 401
