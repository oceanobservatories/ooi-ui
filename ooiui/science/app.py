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

@app.route('/')
def root(name=None):
    if name:
        return render_template(name, title = "")
    else:
        return render_template("index.html", title = 'Main')


## MOCK FUNCTIONS 

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

if __name__ == '__main__':
    app.run(host='localhost',debug=True)