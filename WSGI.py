#!/usr/bin/env python
'''
WSGI.py
'''
import argparse
from flask import jsonify, url_for
from ooiui.core.app import app
import ooiui.core.routes.common
import ooiui.core.routes.science
import ooiui.core.routes.c2
import ooiui.core.routes.aa
import ooiui.core.routes.m2m

if __name__ == '__main__':
    app.run(host='localhost:5000', debug=True)
