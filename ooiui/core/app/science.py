#!/usr/bin/env python
'''
ooiui.core.app.science

Defines the application for the Science UI
'''
from flask import Flask
from flask.ext.cache import Cache
from ooiui.config import CACHE_TYPE

app = Flask(__name__, static_url_path='', template_folder='../../templates', static_folder='../../static')

cache = Cache(app, config={'CACHE_TYPE': CACHE_TYPE})

import ooiui.core.routes.science

if __name__ == '__main__':
    app.run(host='localhost',debug=True)
