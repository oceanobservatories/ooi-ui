#!/usr/bin/env python
'''
ooiui.science.app

Defines the application for the Science UI
'''
from flask import Flask
from flask.ext.cache import Cache
from ooiui.config import CACHE_TYPE

app = Flask(__name__, static_url_path='')

cache = Cache(app, config={'CACHE_TYPE': CACHE_TYPE})

import ooiui.science.routes


if __name__ == '__main__':
    app.run(host='localhost',debug=True)
