#!/usr/bin/env python
'''
ooiui.science.app

Defines the application for the Science UI
'''
from flask import Flask
app = Flask(__name__, static_url_path='')

import ooiui.science.routes


if __name__ == '__main__':
    app.run(host='localhost',debug=True)
