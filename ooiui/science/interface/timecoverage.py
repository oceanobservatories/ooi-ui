#!/usr/bin/env python
'''
ooiui.science.interface.timecoverage

'''
from ooiui.config import ERDDAP_URL

import requests

def get_times_for_stream(ref, stream):
    url = '%s/info/%s_%s/index.json' % (ERDDAP_URL, ref, stream)
    response = requests.get(url)
    if response.status_code != 200:
        return {}
    retval = {}
    metadata = response.json()
    for row in metadata['table']['rows']:
        if row[1] == 'NC_GLOBAL' and 'time_coverage_start' in row[2]:
            retval['time_coverage_start'] = row[4]
        if row[1] == 'NC_GLOBAL' and 'time_coverage_end' in row[2]:
            retval['time_coverage_end'] = row[4]
    return retval

