#!/usr/bin/env python
'''
ooiui.science.routes

Defines the application routes
'''
from ooiui.science.app import app
from flask import request, render_template, Response
from ooiui.config import TABLEDAP, SERVICES_URL, DEBUG

import requests
import os
import json

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

        r = getJsonData(instr,std,edd,param)
    except Exception, e:
        r = "{error:" + 'getting params...' + str(e) +"}"        
    
    resp = Response(response=r, status=200, mimetype="application/json")
    return resp

def getJsonData(instrument,start_date,end_date,parameters):
    #override dataset id for now
    instrument = instrument.replace('-', '_')
    #parameters = "sci_water_pressure"

    time_param = "time"
    parameters = ",".join([time_param,parameters])

    url = "".join([TABLEDAP,instrument,".json",
                    "?",parameters,"&",time_param,">=",start_date,"&",
                    time_param,"<=",end_date,"&orderBy(%22",time_param,"%22)"])

    r = requests.get(url);     
    if (r.status_code != 500): 
        r = r.json()["table"]
        r = json.dumps(r,indent=4)
        return r
    else:
        raise Exception("data request error") 

@app.route('/get_time_coverage/<ref>/<stream>')
def get_time_coverage(ref, stream):
    response = requests.get('%s/get_time_coverage/%s/%s' % (SERVICES_URL, ref,stream))
    if response.status_code != 200:
        data = {}

    data = response.json()

    resp = Response(response=json.dumps(data), status=200, mimetype="application/json")
    return resp
        
@app.route('/gettoc/')
def getTocLayout():  
    if DEBUG:
        with open('toc.json') as data_file:    
            tree_dict = json.load(data_file)
    else:
        response = requests.get('%s/shortcut' % SERVICES_URL)
        data = response.json()

        if response.status_code == 200:
            data = response.json()


        tree_dict = {}
        platform_fields = ["lat","lon","status"]

        for array in data:   
            tree_dict[array]=[]
            
            for platform_name in sorted(data[array].keys()):
                plat = {"title":platform_name,"type":"platform"}
                for f in platform_fields:
                    try:
                        v = data[array][platform_name][f]      
                        plat[f]=v
                    except:
                        pass
                
                plat["expanded"] = False
                plat["folder"] = True
                plat["children"]=[]    
                
                for instrument_name in data[array][platform_name]["instruments"]:
                    
                    instrument_key =  instrument_name
                    instru = {"title":instrument_key,"type":"instrument","folder": True,"children":[]}                                    
                    
                    for stream_id in data[array][platform_name]["instruments"][instrument_key]:
                        stream_name = stream_id             
                        stream = {"title":stream_name,"type":"stream","folder": True,"children":[]}
                        for param_id in data[array][platform_name]["instruments"][instrument_key][stream_id]:
                            param = {"title":param_id,"type":"parameter","folder": False,"children":[]}
                            stream["children"].append(param)
                            
                        instru["children"].append(stream)
                        
                    plat["children"].append(instru)
                    
                #print plat,"\n",platform_name,data[array][platform_name]
                
                tree_dict[array].append(plat)
            #print tree_dict
        with open('toc.json', 'w') as outfile:
            json.dump(tree_dict, outfile)

    r = json.dumps(tree_dict,indent=4)

    resp = Response(response=r, status=200, mimetype="application/json")
    return resp

@app.route('/')
def root():
    return app.send_static_file('index.html')

