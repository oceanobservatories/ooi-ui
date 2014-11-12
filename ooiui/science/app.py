from flask import Flask, url_for,request
from flask import Response
from flask import request, current_app
from flask import render_template

import numpy as np

from shapely.geometry import Polygon,Point,LineString
from math import cos, sin, asin, sqrt, radians

from functools import wraps

import requests
from bs4 import BeautifulSoup
import json

import netCDF4
from netCDF4 import num2date, date2num

import os
import psycopg2 
import json

OOI_ERRDAP = "http://erddap.ooi.rutgers.edu/erddap/tabledap/"

app = Flask(__name__, static_url_path='')

def support_jsonp(func):
    """Wraps JSONified output for JSONP requests."""
    @wraps(func)
    def decorated_function(*args, **kwargs):
        callback = request.args.get('callback', False)
        if callback:
            data = str(func(*args, **kwargs).data)
            content = str(callback) + '(' + data + ')'
            mimetype = 'application/javascript'
            return current_app.response_class(content, mimetype=mimetype)
        else:
            return func(*args, **kwargs)
    return decorated_function

def root_dir():  # pragma: no cover
    return os.path.abspath(os.path.dirname(__file__))

@app.route('/json/<path:path>')
def jsonFiles(path):
    location = os.path.join('json', path)
    return app.send_static_file(location)

@app.route('/js/<path:path>')
def jsFiles(path):
    location = os.path.join('js', path)
    return app.send_static_file(location)

@app.route('/img/<path:path>')
def imageFiles(path):
    location = os.path.join('img', path)
    return app.send_static_file(location)

@app.route('/css/<path:path>')
def cssFiles(path):
    location = os.path.join('css', path)
    return app.send_static_file(location)

@app.route('/fonts/<path:path>')
def fontFiles(path):
    location = os.path.join('fonts', path)
    return app.send_static_file(location)

@app.route('/common/<filename>')
def commonFiles(filename):
    return app.send_static_file(os.path.join('static', filename))

@app.route('/pioneer/')
def pioneer(name=None):
    if name:
        return render_template(name, title = "")
    else:
        return render_template("pioneer_landing.html", title = 'Pioneer Array')

@app.route('/getdata/')
def getData():
    try:
        instr = request.args['dataset_id']    
        std = request.args['startdate']
        edd = request.args['enddate']
        param = request.args['variables']

        r = getJsonData(instr,std,edd,param)
    except Exception, e:
        r = "{error:" + 'getting params...' + str(e) +"}"        
    
    resp = Response(response=r, status=200, mimetype="application/json")
    return resp

def getJsonData(instrument,start_date,end_date,parameters):
    #override dataset id for now
    instrument = "CP05MAS_GL001_03_CTDGVM0000_ctdgv_m_glider_instrument_recovered"
    #parameters = "sci_water_pressure"

    time_param = "time"
    parameters = ",".join([time_param,parameters])

    url = "".join([OOI_ERRDAP,instrument,".json",
                    "?",parameters,"&",time_param,">=",start_date,"&",
                    time_param,"<=",end_date,"&orderBy(%22",time_param,"%22)"])

    r = requests.get(url);     
    if (not r.status_code == 500): 
        r = r.json()["table"]
        r = json.dumps(r,indent=4)
        return r
    else:
        raise Exception("data request error") 
        
    

@app.route('/')
def root(name=None):
    if name:
        return render_template(name, title = "")
    else:
        return render_template("index.html", title = 'Main')

if __name__ == '__main__':
    app.run(host='localhost',debug=True)