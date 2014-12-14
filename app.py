#!/usr/bin/env python
'''
app.py
'''
import argparse

def science(args):
    from ooiui.science.app import app
    app.run(host='localhost', debug=True)


def main(args):
    if args.science:
        science(args)

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Development Application for OOI UI')
    parser.add_argument('-s', '--science', action='store_true', help='Launch science UI')
    args = parser.parse_args()
    main(args)
