#!/usr/bin/env python

'''
ooiservices.config

Configuration Management for OOI Services
'''

import yaml
import pkg_resources


def reload():
    __config_file__ = pkg_resources.resource_string(__name__, "config.yml")
    __config_dict__ = yaml.load(__config_file__)
    globals().update(__config_dict__)

reload() # Initialize the globals on the first load of this module

