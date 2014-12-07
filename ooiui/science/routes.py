#!/usr/bin/env python
'''
ooiui.science.routes

Defines the application routes
'''
from ooiui.science.app import app
from flask import request, render_template, Response
from ooiui.config import TABLEDAP, SERVICES_URL, DEBUG

from ooiui.science.interface import tabledap as tabled
from ooiui.science.interface.toc import get_toc as get_toc_interface

import requests
import os
import json
from datetime import datetime,timedelta
import time
import numpy as np
import math

@app.route('/pioneer/')
def pioneer():
    return app.send_static_file('pioneer_landing.html')

@app.route('/getdata/')
def getData():
    try:
        instr = request.args['dataset_id']    
        std = request.args['startdate']
        edd = request.args['enddate']
        param = request.args['variables']
        tav = request.args['timeaverage']
        tp = request.args['timeperiod']

        print tav
        
        if (tav=="true"):
            r = tabled.getFormattedJsonData(instr,std,edd,param)
        else:
            r = tabled.getTimeSeriesJsonData(instr,std,edd,param);
    except Exception, e:
        r = "{error:" + 'getting params...' + str(e) +"}"        
    
    resp = Response(response=r, status=200, mimetype="application/json")
    return resp

@app.route('/files')
def files():
    return render_template('filebrowser.html')

@app.route('/get_time_coverage/<ref>/<stream>')
def get_time_coverage(ref, stream):
    response = requests.get('%s/get_time_coverage/%s/%s' % (SERVICES_URL, ref,stream))
    if response.status_code != 200:
        data = {}

    data = response.json()

    resp = Response(response=json.dumps(data), status=200, mimetype="application/json")
    return resp
        
@app.route('/gettoc/')
def get_toc():
    return get_toc_interface()


@app.route('/')
def root():
    return app.send_static_file('index.html')

