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

app = Flask(__name__, static_url_path='')

@app.route('/')
@app.route('/<name>')
def root(name=None):
    if name:
        return render_template(name, title = name)
    else:
        return render_template("index.html", title = 'Main')

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
 

def getMockArrayDataList():
    array_list = {}
    array_list['CE']={'name':'Endurance Array (CE)',"num":14,'lat':44.37,'lon':-124.95}
    array_list['GP']={'name':'Station PAPA (GP)',"num":6,'lat':49.9795,'lon':-144.254}
    array_list['CP']={'name':'Pioneer Array (CP)',"num":16,'lat':40.1,'lon':-70.88}
    array_list['GA']={'name':'Global Argentine (GA)','num':7,'lat':-42.5073,'lon':-42.8905}
    array_list['RS']={'name':'RS Regional','num':11,'lat':44.554,'lon':-125.352}
    array_list['GI']={'name':'Global Irminger Sea (GI)','num':7,'lat':60.4582,'lon':-38.4407}
    array_list['GS']={'name':'55 South (GS)','num':7,'lat':-54.0814,'lon':-89.6652}
    return array_list


@app.route("/arraylist/")
@support_jsonp
def getArrayList():
    '''
    get a list of the arrays and their bounding information
    '''
    try:
        array_list = getMockArrayDataList()
        array_list = json.dumps(array_list,indent=2)
        resp = Response(response=array_list,
                    status=200,
                    mimetype="application/json")
        return resp

    except Exception, e:
        raise e

@app.route("/platformlist/")
@support_jsonp
def getPlatformsForArray():
    '''
    get a list of platforms given an array id
    '''
    try:
        array_name = request.args['array']
    except Exception, e:
        raise e

@app.route("/instrumentlist/")
@support_jsonp
def getInstrumentList():
    '''
    gets a list of instruments, given an array and platform id
    includes the variable information
    '''
    try:
        array_name = request.args['array']
        platform_name = request.args['platform']
    except Exception, e:
        raise e


@app.route("/variablelist/")
@support_jsonp
def getVariableList():
    '''
    by variable, lists the platforms available
    '''
    try:
        array_name = request.args['array']
        platform_name = request.args['platform']
    except Exception, e:
        raise e


@app.route("/timeseries/")
@support_jsonp
def getTsData():
    '''
    get time series data for a given set of inputs
    '''
    try:
        array_name = request.args['array']
        platform_name = request.args['platform']
        instrument_name = request.args['instrument']
        variable_name = request.args['variable']
    except Exception, e:
        raise e





if __name__ == '__main__':
    app.run(host='0.0.0.0',debug=True)