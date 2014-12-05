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
        data = r.json()['table']
        return_json = ""    
        try:                        
            print "re-org-data"
            trans_data = np.transpose(data['rows'])            
            colIdx = -1    
            colList = []  #minus time
            unitList = []  #minus time
            for i, col in enumerate(data['columnNames']):
                if col == "time":
                    colIdx = i                    
                else:
                    unitList.append(data['columnUnits'][i])    
                    colList.append(col)
            colNames = data['columnNames']      

            #create array of the data dates
            date_array_int = []
            date_array = []
            for d in (trans_data[colIdx]):        
                date_object = datetime.strptime(d, "%Y-%m-%dT%H:%M:%SZ")
                date_array.append(date_object)
                date_array_int.append(time.mktime(date_object.timetuple()) * 1000)


            date_array_int = np.array(date_array_int)
            date_array = np.array(date_array)
            
            #get start and end of data
            end_date = date_array[-1]
            start_date = date_array[0]

            #calc the diff between the start and end dates
            diff_in_days = abs(start_date - end_date)
            dd = divmod(diff_in_days.days * 86400 + diff_in_days.seconds, 60)
            #convert minutes to hours
            diff_in_hours = int(math.ceil(dd[0]*0.0166667))
            print "hours diff between start and end:", diff_in_hours

            #get the start date in miliseconds
            st = time.mktime(start_date.timetuple()) * 1000
            ed = time.mktime(end_date.timetuple()) * 1000

            dt_data = []
            for i in xrange(0,diff_in_hours):   #should be a while loop
                st_datetime = start_date + timedelta(hours=i)
                ed_datetime = start_date + timedelta(hours=i+1)                    
                middle_datetime = st_datetime + timedelta(minutes=30)                

                #create datetime from generate vals
                st_val = time.mktime(st_datetime.timetuple()) * 1000
                ed_val = time.mktime(ed_datetime.timetuple()) * 1000

                #index of values
                st_idx = (find_nearest(date_array_int, st_val))
                ed_idx = (find_nearest(date_array_int, ed_val))                

                #get the int values
                st_time_int = date_array_int[st_idx]
                ed_time_int = date_array_int[ed_idx]

                #get the difference between the date times
                diff_in_days = abs((date_array[st_idx] - date_array[ed_idx]))
                dd = divmod(diff_in_days.days * 86400 + diff_in_days.seconds, 60)
                #convert minutes to hours
                diff_in_hours_data = dd[0]*0.0166667

                data_row = {}
                for j,col in enumerate(data['columnNames']):                    
                    if st_idx < ed_idx:                        
                        if not col == "time":                                                      
                            val_row = []
                            val_min = np.min(np.array(trans_data[j][st_idx:ed_idx],np.float))
                            val_max = np.max(np.array(trans_data[j][st_idx:ed_idx],np.float))
                            val_mean = np.mean(np.array(trans_data[j][st_idx:ed_idx],np.float))
                            val_row.append(val_min)
                            val_row.append(val_mean)
                            val_row.append(val_max)
                            data_row[col] = val_row
                        else:                         
                            data_row['time'] = (str(middle_datetime))

                        #print data_row,diff_in_hours_data

                #add the data only if there is contents
                if len(data_row)>0:
                    dt_data.append(data_row)


            return_json = { "total_hours_start_end":diff_in_hours,
                            "data_start_date":str(start_date),
                            "data_end_date": str(end_date),
                            "data":dt_data,
                            "timezone":"UTC",
                            "fields":colList,
                            "time_note":"time is middle of the timespan, time span is in hours",
                            "time_span":"1",
                            "variables":["min","mean","max"],
                            "units":unitList}

        except Exception, e:
            return_json = "{FAIL}"
            print "FAIL!",str(e)

        r = json.dumps(return_json,indent=4)
        return r
    else:
        raise Exception("data request error") 


def find_nearest(array,value):
    idx = (np.abs(array-value)).argmin()
    return idx


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

