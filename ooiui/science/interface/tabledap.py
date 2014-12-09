#!/usr/bin/env python
'''
ooiui.science.interface

Defines interfaces used for erddap/tabledap
'''
import math
import numpy as np
import json
import requests
from datetime import datetime,timedelta
from ooiui.config import TABLEDAP, SERVICES_URL, DEBUG
import time

def find_nearest(array,value):
    'gets the closest index to a value'
    idx = (np.abs(array-value)).argmin()
    return idx

def getTableData(instrument,start_date,end_date,parameters,limit=None,transpose=True):
    '''
    actually gets the erddap table data from the server
    '''
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
        #verify that the length of the data is below the limit, and transpose if we want too
        if not (limit is None):
            if (len(data['rows']) > limit):
                if (transpose):
                    trans_data = np.transpose(data['rows'][0:limit]) 
                else:
                    trans_data = (data['rows'][0:limit]) 
            else:
                if (transpose):
                    trans_data = np.transpose(data['rows']) 
                else:
                    trans_data = (data['rows']) 
        else:
            if (transpose):
                trans_data = np.transpose(data['rows']) 
            else:
                trans_data = data['rows']

        return data, trans_data
    else:    
        raise Exception("data request error") 
        return None,None

def getTimeSeriesJsonData(instrument,start_date,end_date,parameters):    
    '''
    regular time series request: re format the response for the time period request, row to cols and jsonify
    '''
    r = getTableData(instrument,start_date,end_date,parameters)    
    data, trans_data = getTableData(instrument,start_date,end_date,parameters,limit=2000,transpose=False)

    if data is not None:   
        return_json = ""                 
        try:    
            #figure out the time index, and extents
            colIdx = -1    
            temp_data = np.transpose(data['rows'])
            data_extents = {} 
            for i, col in enumerate(data['columnNames']):
                if col == "time":
                    colIdx = i                                        
                else: 
                    d_type = (data['columnTypes'])
    
                    if d_type == "int":
                        d_array = temp_data[i]
                        d_array =d_array.astype(int)
                    elif d_type =="double":
                        d_array = temp_data[i]
                        d_array = d_array.astype(float)
                    elif d_type =="string":
                        #this is bad.....
                        d_array= []                        
                    else:
                        #figure it must be a value
                        d_array = temp_data[i]
                        d_array = d_array.astype(float)

                    data_extents[col] = {'min':np.nanmin(d_array),
                                         'max':np.nanmax(d_array)
                                        }

            return_json = { "data_extents":data_extents,
                            "data_start_date":trans_data[0][colIdx],
                            "data_end_date": trans_data[-1][colIdx],
                            "request_start_date":trans_data[0][colIdx],
                            "request_end_date": trans_data[-1][colIdx],
                            "data":trans_data,
                            "timeidx":colIdx,
                            "timezone":"UTC",
                            "fields":data['columnNames'],
                            "time_note":"time is point of data",
                            "time_span":"full",
                            "variables":data['columnNames'],
                            "units":data['columnUnits']}

            r = json.dumps(return_json,indent=4)

        except Exception, e:
            return_json = "{FAIL:"+str(e)+"}"            
        
        r = json.dumps(return_json,indent=4)
        return r
    else:
        raise Exception("data request error") 
        r = json.dumps("data request error",indent=4)


def getFormattedJsonData(instrument,start_date,end_date,parameters):
    '''
    time averaged request: get Formatted JsonData time averaged by a time period
    '''
    r = getTableData(instrument,start_date,end_date,parameters)    
    data, trans_data = getTableData(instrument,start_date,end_date,parameters)

    
    if data is not None:   
        return_json = ""                 
        try:                                                
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
                            val_min = np.nanmin(np.array(trans_data[j][st_idx:ed_idx],np.float))
                            val_max = np.nanmax(np.array(trans_data[j][st_idx:ed_idx],np.float))
                            val_mean = np.nanmean(np.array(trans_data[j][st_idx:ed_idx],np.float))
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
        r = json.dumps("data request error",indent=4)
