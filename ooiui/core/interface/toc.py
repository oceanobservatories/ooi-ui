#!/usr/bin/env python
'''
ooiui.science.interface.toc

Defines the TOC interface
'''

from flask import request, render_template, Response
from ooiui.config import TABLEDAP, SERVICES_URL, DEBUG
from ooiui.science.app import cache
import requests
import os
import json
import collections
import functools
import time

@cache.cached(timeout=500)
def get_toc():    
    data = build_toc()
    tree_dict = {}
    
    platform_fields = ["lat","lon","status"]

    for array in data:   
        tree_dict[array]=[]

        for platform_name in sorted(data[array]["platforms"].keys()):
            platform = tree_platforms(data[array]["platforms"][platform_name])

            if platform["children"]:
                tree_dict[array].append(platform)
        
        

    r = json.dumps(tree_dict,indent=4)

    resp = Response(response=r, status=200, mimetype="application/json")
    return resp

def tree_platforms(platform):

    display_name = platform['display_name']
    plat = {"id" : platform['reference_designator'], "title":display_name,"type":"platform"}

    for field in platform:
        plat[field] = platform[field]

    plat['id'] = platform['reference_designator']
    
    plat["expanded"] = False
    plat["folder"] = True
    plat["children"]=[]    
    
    for instrument_name in platform["instruments"]:
        instrument = tree_instruments(platform["instruments"][instrument_name])

        if instrument["children"]:
            plat["children"].append(instrument)

    return plat

        

def tree_instruments(instrument):

    display_name = instrument["display_name"]
    instru = {
       "id"       : instrument['reference_designator'],
       "title"    : display_name,
       "type"     : "instrument",
       "folder"   : True,
       "children" : []
    }
    
    for stream_id in instrument["streams"]:
        stream = tree_streams(stream_id, instrument["streams"][stream_id])
        if stream["children"]:
            instru['children'].append(stream)


    return instru

def tree_streams(stream_id, stream):
    stream_doc = {
        "id"       : stream_id,
        "title"    : stream_id,
        "type"     : "stream",
        "folder"   : True,
        "children" : []
    }

    for param_id in stream:
        param = {
            "id"       : param_id,
            "title"    : param_id,
            "type"     : "parameter",
            "folder"   : False,
            "children" : []
        }
        stream_doc["children"].append(param)
        
    return stream_doc
        
    

def build_toc():
    response = requests.get('%s/arrays' % SERVICES_URL)
    if response.status_code != 200:
        return {}
    doc = response.json()

    doc = { r['array_code'] : r for r in doc  }

    for array in doc.itervalues():
        array['platforms'] = build_platforms(array['id'])

    return doc

def build_platforms(array_id):
    response = requests.get('%s/platform_deployments?array_id=%s' % (SERVICES_URL, array_id))
    if response.status_code != 200:
        return {}

    doc = response.json()
    doc = { r['reference_designator'] : r for r in doc }

    for platform in doc.itervalues():
        platform['instruments'] = build_instruments(platform['id'])

    return doc

def build_instruments(platform_id):
    response = requests.get('%s/instrument_deployments?platform_deployment_id=%s' % (SERVICES_URL, platform_id))
    if response.status_code != 200:
        return {}
    doc = response.json()
    doc = { r['reference_designator'] : r for r in doc }
    for instrument in doc.itervalues():
        instrument['streams'] = build_streams(instrument['reference_designator'])

    return doc


def build_streams(reference_designator):
    response = requests.get('%s/streams?reference_designator=%s' % (SERVICES_URL, reference_designator))
    if response.status_code != 200:
        return {}
    doc = response.json()
    doc = { r['id'][28:] : build_parameters(r['id']) for r in doc }
    return doc

def build_parameters(stream_id):
    response = requests.get('%s/parameters?stream_id=%s' % (SERVICES_URL, stream_id))

    if response.status_code != 200:
        return []

    doc = response.json()
    return doc

def flush_cache():
    cache.clear()
