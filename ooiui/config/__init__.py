#!/usr/bin/env python

'''
ooiservices.config

Configuration Management for OOI Services
'''

import yaml
import pkg_resources
import os

def reload():
    basedir = os.path.abspath(os.path.dirname(__file__))

    __config_file__ = pkg_resources.resource_string(__name__, "config.yml")

    if os.path.exists(os.path.join(basedir, 'config_local.yml')):
        __config_file__ = pkg_resources.resource_string(__name__, "config_local.yml")

    __config_dict__ = yaml.load(__config_file__, Loader=yaml.FullLoader)
    globals().update(__config_dict__)


reload() # Initialize the globals on the first load of this module
