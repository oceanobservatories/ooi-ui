
#!/usr/bin/env python
'''
ooiui.core.app.science

Defines the application for the Science UI
'''
from flask import Flask
from flask.ext.cache import Cache
from flask_environments import Environments

app = Flask(__name__, static_url_path='', template_folder='../../templates', static_folder='../../static')


env = Environments(app, default_env='DEVELOPMENT')
env.from_yaml('ooiui/config/config.yml')

cache = Cache(app, config={'CACHE_TYPE': app.config['CACHE_TYPE']})
