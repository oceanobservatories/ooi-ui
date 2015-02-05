#!/usr/bin/env python
'''
ooiui.core.routes.science

Defines the application routes
'''
from ooiui.core.app import app
from flask import request, render_template, Response, jsonify



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


@app.route('/api/array')
def array_proxy():
    response = requests.get(app.config['SERVICES_URL'] + '/arrays', params=request.args)
    return response.text, response.status_code

@app.route('/api/platform_deployment')
def platform_deployment_proxy():
    response = requests.get(app.config['SERVICES_URL'] + '/platform_deployments', params=request.args)
    return response.text, response.status_code

@app.route('/api/instrument_deployment')
def instrument_deployment_proxy():
    response = requests.get(app.config['SERVICES_URL'] + '/instrument_deployments', params=request.args)
    return response.text, response.status_code

@app.route('/opLog.html')
def op_log():
    return render_template("common/opLog.html")
