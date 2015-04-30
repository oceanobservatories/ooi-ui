#!/usr/bin/env python
'''
app.py
'''
import argparse

def science(args):
    from ooiui.core.app import app

    import ooiui.core.routes.common
    import ooiui.core.routes.science
    import ooiui.core.routes.c2
    import ooiui.core.routes.aa

    app.run(host='localhost', debug=True)


def main(args):
    if args.science:
        science(args)

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Development Application for OOI UI')
    parser.add_argument('-s', '--science', action='store_true', help='Launch science UI')
    args = parser.parse_args()
    main(args)
