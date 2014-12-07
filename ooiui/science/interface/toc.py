#!/usr/bin/env python
'''
ooiui.science.interface.toc

Defines the TOC interface
'''

from flask import request, render_template, Response
from ooiui.config import TABLEDAP, SERVICES_URL, DEBUG
import requests
import os
import json


def get_toc():    
    #boolean flag for original non modified json
    if 'original' in request.args:
        original = request.args['original']    
    else:
        original = False

    if DEBUG:
        SITE_ROOT = os.path.realpath(os.path.dirname(__file__))
        json_url = os.path.join(SITE_ROOT, "static/json", 'toc.json')
        with open(json_url) as data_file:    
            tree_dict = json.load(data_file)
    else:
        response = requests.get('%s/shortcut' % SERVICES_URL)        
        tree_dict = {}

        if response.status_code == 200:
            data = response.json()
            
            if original:
                tree_dict = data
            else:    
                platform_fields = ["lat","lon","status"]

                for array in data:   
                    tree_dict[array]=[]
                    
                    for platform_name in sorted(data[array].keys()):
                        display_name = data[array][platform_name]['display_name']
                        plat = {"id" : platform_name, "title":display_name,"type":"platform"}
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
                            
                            display_name = data[array][platform_name]["instruments"][instrument_name]["display_name"]
                            instru = {
                               "id"       : instrument_name,
                               "title"    : display_name,
                               "type"     : "instrument",
                               "folder"   : True,
                               "children" : []
                            }
                            
                            for stream_id in data[array][platform_name]["instruments"][instrument_name]["streams"]:
                                stream = {
                                    "id"       : stream_id,
                                    "title"    : stream_id,
                                    "type"     : "stream",
                                    "folder"   : True,
                                    "children" : []
                                }

                                for param_id in data[array][platform_name]["instruments"][instrument_name]["streams"][stream_id]:
                                    param = {
                                        "id"       : param_id,
                                        "title"    : param_id,
                                        "type"     : "parameter",
                                        "folder"   : False,
                                        "children" : []
                                    }
                                    stream["children"].append(param)
                                    
                                if stream["children"]:
                                    instru["children"].append(stream)
                                
                            if instru["children"]:
                                plat["children"].append(instru)                                                
                        
                        if plat["children"]:
                            tree_dict[array].append(plat)
            
        with open('toc.json', 'w') as outfile:
            json.dump(tree_dict, outfile)

    r = json.dumps(tree_dict,indent=4)

    resp = Response(response=r, status=200, mimetype="application/json")
    return resp
