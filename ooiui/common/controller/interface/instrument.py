#!/usr/bin/env python
'''

ooiui.common.controller.interface.instruments.py

Private methods for handling the list and detail object of instruments for consumption by ooiui.

'''

__author__ = 'Matt Campbell'

import requests
import os
import json

#from ooiui.common.controller.interface.base import BaseInterface
from flask import request, render_template, Response
from collections import namedtuple
from base import BaseInterface


class InstrumentsListInterface(BaseInterface):

    def __init__(self):
        BaseInterface.__init__(self)


    def create_list(self):

        #TODO: Externalize URL protocol:host:port
        response = requests.get('http://localhost:4000/instrument')

        #Now have data from ooiservice
        data = response.json()

        #Simple list of items.
        data = { r['id'] for r in data}

        #TODO: Create parser to organize concise list of relevent data
        return data


class InstrumentObjectInterface(BaseInterface):

    def __init__(self):
        BaseInterface.__init__(self)

    def create_object(self, id):

        #TODO: Externalize URL protocol:host:port
        response = requests.get('http://localhost:4000/instrument/%s' % (id))

        #Now have data from ooiservice
        data = response.json()

        #TODO: Create parser to organize ONLY relevant data to passed id
        #For now, just get all the data for this item

        return data