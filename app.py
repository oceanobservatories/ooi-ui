#!/usr/bin/env python
'''
app.py
'''
import argparse
from flask import jsonify, url_for
from ooiui.core.app import app
def has_no_empty_params(rule):
    '''
    Something to do with empty params?
    '''
    defaults = rule.defaults if rule.defaults is not None else ()
    arguments = rule.arguments if rule.arguments is not None else ()
    return len(defaults) >= len(arguments)

#route("/site-map")
def site_map():
    '''
    Returns a json structure for the site routes and handlers
    '''
    links = []
    for rule in app.url_map.iter_rules():
        # Filter out rules we can't navigate to in a browser
        # and rules that require parameters
        if "GET" in rule.methods and has_no_empty_params(rule):
            url = url_for(rule.endpoint)
            links.append((url, rule.endpoint))
    # links is now a list of url, endpoint tuples
    return jsonify(rules=links)

def science(args):

    import ooiui.core.routes.common
    import ooiui.core.routes.science
    import ooiui.core.routes.c2
    import ooiui.core.routes.aa

    if app.config['DEBUG'] == True:
        app.add_url_rule('/site-map', 'site_map', site_map)
    app.run(host='localhost', debug=True)


def main(args):
    if args.science:
        science(args)

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Development Application for OOI UI')
    parser.add_argument('-s', '--science', action='store_true', help='Launch science UI')
    args = parser.parse_args()
    main(args)
