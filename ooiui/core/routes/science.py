#!/usr/bin/env python
'''
ooiui.core.routes.science

Defines the application routes
'''
from ooiui.core.app import app
from flask import request, render_template, Response, jsonify
from flask import stream_with_context
from ooiui.core.routes.common import get_login, login_required
import requests
import urllib2
from ooiui.core.routes.decorators import login_required, scope_required

@app.route('/')
def new_index():
    urllib2.urlopen(app.config['GOOGLE_ANALYTICS_URL'] + '&dp=%2Fscience%2Fworld')
    return render_template('science/index.html')


@app.route('/landing/pioneer')
@login_required()
def landing_pioneer():
    return render_template('landing/pioneer.html')


@app.route('/assets/list')
@app.route('/assets/list/')
@login_required()
def instr_index():
    urllib2.urlopen(app.config['GOOGLE_ANALYTICS_URL'] + '&dp=%2Fassets')
    return render_template('asset_management/assetslist.html')


@app.route('/events/list/')
@login_required()
def event_list():
    urllib2.urlopen(app.config['GOOGLE_ANALYTICS_URL'] + '&dp=%2Fevents')
    return render_template('asset_management/eventslist.html')


@app.route('/event/<int:id>', methods=['GET'])
@login_required()
def event_index(id):
    #?id=%s' % id
    return render_template('asset_management/event.html',id=id)


@app.route('/event/<string:new>/<int:aid>/<string:aclass>', methods=['GET'])
@login_required()
def event_new(new,aid,aclass):
    #?id=%s' % id
    return render_template('asset_management/event.html',id=str(new),assetid=aid,aclass=str(aclass))


@app.route('/streams/')
def streams_page():
    urllib2.urlopen(app.config['GOOGLE_ANALYTICS_URL'] + '&dp=%2Fstreams')
    return render_template('science/streams.html')

@app.route('/streamingdata/')
@app.route('/streamingdata')
def streaming_data_page():
    urllib2.urlopen(app.config['GOOGLE_ANALYTICS_URL'] + '&dp=%2Fstreamingdata')
    return render_template('science/streaming_data.html')


@app.route('/antelope_acoustic/')
@login_required()
def acoustics_page():
    urllib2.urlopen(app.config['GOOGLE_ANALYTICS_URL'] + '&dp=%2Facoustic-antelope')
    return render_template('science/antelope_acoustic.html')


@app.route('/plotting', methods=['GET'])
@app.route('/plotting/', methods=['GET'])
@login_required()
def show_plotting_no_path():
    urllib2.urlopen(app.config['GOOGLE_ANALYTICS_URL'] + '&dp=%2Fplotting')
    return plotting_page(None)


@app.route('/plotting/<path:path>', methods=['GET'])
@login_required()
def plotting_page(path):
    urllib2.urlopen(app.config['GOOGLE_ANALYTICS_URL'] + '&dp=%2Fplotting')
    return render_template('science/plotting.html')


@app.route('/getdata/')
def getData():
    '''
    gets data in the google chart format
    '''
    instr = request.args['instrument']
    stream = request.args['stream']

    #std = request.args['startdate']
    #edd = request.args['enddate']
    #param = request.args['variables']
    #ann = request.args['annotaton']
    ann = "?annotation=true"

    response = requests.get(app.config['SERVICES_URL'] + '/uframe/get_data'+"/"+instr+"/"+stream+ann, params=request.args)

    return response.text, response.status_code


@app.route('/api/get_data', methods=['GET'])
def getUframeDataProxy():
    '''
    gets data in the google chart format
    '''
    try:
        instr = request.args['instrument']
        stream = request.args['stream']
        # comma list
        xvars = request.args['xvars']
        yvars = request.args['yvars']

        # there should be a start and end date in the params
        # ?startdate=2015-01-21T22:01:48.103Z&enddate=2015-04-29T10:10:51.563Z

        data_url = "/".join([app.config['SERVICES_URL'], 'uframe/get_data', instr, stream, xvars, yvars])
        response = requests.get(data_url, params=request.args)
        data_text = response.text
        data_text = data_text.replace("NaN", "null")
        return data_text, response.status_code, dict(response.headers)
    except Exception, e:
        return jsonify(error=str(e))


@app.route('/api/get_multistream', methods=['GET'])
def getUframeMultiStreamInterp():
    '''
    Makes a request to the backend services to get the multi stream interpolated data
    Example request:
        /uframe/get_multistream/CP05MOAS-GL340-03-CTDGVM000/CP05MOAS-GL340-02-FLORTM000/telemetered_ctdgv_m_glider_instrument/
        telemetered_flort_m_glider_instrument/sci_water_pressure/sci_flbbcd_chlor_units?startdate=2015-05-07T02:49:22.745Z&enddate=2015-06-28T04:00:41.282Z
    '''
    try:
        # Parse the parameters
        stream1 = request.args['stream1']
        stream2 = request.args['stream2']
        instr1 = request.args['instrument1']
        instr2 = request.args['instrument2']
        var1 = request.args['var1']
        var2 = request.args['var2']
        startdate = request.args['startdate']
        enddate = request.args['enddate']

        # Build the URL
        params = '?startdate=%s&enddate=%s' % (startdate, enddate)
        data_url = "/".join([app.config['SERVICES_URL'], 'uframe/get_multistream', stream1, stream2, instr1, instr2, var1, var2 + params])

        # Get the response
        response = requests.get(data_url, params=request.args)
        data_text = response.text
        data_text = data_text.replace("NaN", "null")
        return data_text, response.status_code, dict(response.headers)
    except Exception, e:
        return jsonify(error=str(e))


@app.route('/api/annotation', methods=['GET'])
def get_annotations():
    try:
        instr = request.args['reference_designator']
        stream = request.args['stream_name']

        response = requests.get(app.config['SERVICES_URL'] + '/annotation/'+instr+"/"+stream, params=request.args)
        return response.text, response.status_code, dict(response.headers)
    except Exception, e:
        return jsonify(error=str(e))


@app.route('/api/annotation', methods=['POST'])
def post_annotation():
    token = get_login()
    response = requests.post(app.config['SERVICES_URL'] + '/annotation', auth=(token, ''), data=request.data)
    return response.text, response.status_code, dict(response.headers)


@app.route('/api/annotation/<string:id>', methods=['PUT'])
def put_annotation(id):
    token = get_login()
    response = requests.put(app.config['SERVICES_URL'] + '/annotation/%s' % id, auth=(token, ''), data=request.data)
    return response.text, response.status_code


# old
@app.route('/api/array')
def array_proxy():
    response = requests.get(app.config['SERVICES_URL'] + '/arrays', params=request.args)
    return response.text, response.status_code


@app.route('/api/uframe/get_structured_toc')
def structured_toc_proxy():
    response = requests.get(app.config['SERVICES_URL'] + '/uframe/get_structured_toc', params=request.args)
    return response.text, response.status_code


# old
@app.route('/api/platform_deployment')
def platform_deployment_proxy():
    response = requests.get(app.config['SERVICES_URL'] + '/platform_deployments', params=request.args)
    return response.text, response.status_code


@app.route('/api/display_name')
def display_name():
    ref = request.args['reference_designator']
    response = requests.get(app.config['SERVICES_URL'] + '/display_name'+"?reference_designator="+ref, params=request.args)
    return response.text, response.status_code


# Assets
@app.route('/api/asset_deployment', methods=['GET'])
def instrument_deployment_proxy():


    response = requests.get(app.config['SERVICES_URL'] + '/uframe/assets', params=request.args)

    if 'export' in request.args:
        return Response(response.text,
            mimetype='application/json',
            headers={'Content-Disposition':'attachment;filename=filtered_assets.json'})
    else:
        return response.text, response.status_code


@app.route('/api/asset_deployment/<int:id>', methods=['GET'])
def instrument_deployment_get(id):
    response = requests.get(app.config['SERVICES_URL'] + '/uframe/assets/%s' % id, data=request.data)
    return response.text, response.status_code


@app.route('/api/asset_deployment/<int:id>', methods=['PUT'])
@scope_required('asset_manager')
@login_required()
def instrument_deployment_put(id):
    response = requests.put(app.config['SERVICES_URL'] + '/uframe/assets/%s' % id, data=request.data)
    return response.text, response.status_code


@app.route('/api/asset_deployment', methods=['POST'])
@scope_required('asset_manager')
@login_required()
def instrument_deployment_post():
    response = requests.post(app.config['SERVICES_URL'] + '/uframe/assets', data=request.data)
    return response.text, response.status_code


# not working/using now
@app.route('/api/asset_deployment/<int:id>', methods=['DELETE'])
@scope_required('asset_manager')
@login_required()
def instrument_deployment_delete(id):
    response = requests.delete(app.config['SERVICES_URL'] + '/uframe/assets/%s' % id, data=request.data)
    return response.text, response.status_code


# Events
@app.route('/api/asset_events', methods=['GET'])
def event_deployments_proxy():
    response = requests.get(app.config['SERVICES_URL'] + '/uframe/events', params=request.args)
    return response.text, response.status_code


@app.route('/api/asset_events/<int:id>', methods=['GET'])
def event_deployment_get(id):
    response = requests.get(app.config['SERVICES_URL'] + '/uframe/assets/%s/events' % id, params=request.args)
    return response.text, response.status_code


@app.route('/api/asset_events/<int:assetId>/<int:id>', methods=['PUT'])
@scope_required('asset_manager')
@login_required()
def asset_event_put(id, assetId):
    token = get_login()
    response = requests.put(app.config['SERVICES_URL'] + '/uframe/events/%s' % id, auth=(token, ''), data=request.data)
    return response.text, response.status_code


@app.route('/api/asset_events', methods=['POST'])
@scope_required('asset_manager')
@login_required()
def asset_event_post():
    token = get_login()
    response = requests.post(app.config['SERVICES_URL'] + '/uframe/events', auth=(token, ''), data=request.data)
    return response.text, response.status_code


@app.route('/api/events', methods=['GET'])
def get_event_by_ref_des():
    response = requests.get(app.config['SERVICES_URL'] + '/uframe/events?ref_des=%s' % request.args.get('ref_des'), data=request.args)
    return response.text, response.status_code


@app.route('/opLog.html')
def op_log():
    urllib2.urlopen(app.config['GOOGLE_ANALYTICS_URL'] + '&dp=%2FopLog')
    return render_template("common/opLog.html")


@app.route('/api/uframe/stream')
def stream_proxy():
    token = get_login()
    response = requests.get(app.config['SERVICES_URL'] + '/uframe/stream', auth=(token, ''), params=request.args)
    return response.text, response.status_code


@app.route('/api/antelope_acoustic/list', methods=['GET'])
def get_acoustic_datalist():
    token = get_login()
    response = requests.get(app.config['SERVICES_URL'] + '/uframe/antelope_acoustic/list', auth=(token, ''), params=request.args)

    return response.text, response.status_code


@app.route('/api/uframe/get_metadata/<string:stream_name>/<string:reference_designator>', methods=['GET'])
def metadata_proxy(stream_name, reference_designator):
    '''
    get metadata for a given ref and stream
    '''
    token = get_login()
    response = requests.get(app.config['SERVICES_URL'] + '/uframe/get_metadata/%s/%s' % (stream_name, reference_designator), auth=(token, ''), params=request.args)
    return response.text, response.status_code


@app.route('/api/uframe/get_metadata_times/<string:stream_name>/<string:reference_designator>', methods=['GET'])
def metadata_times_proxy(stream_name, reference_designator):
    '''
    get metadata times for a given ref and stream
    '''
    token = get_login()
    response = requests.get(app.config['SERVICES_URL'] + '/uframe/get_metadata_times/%s/%s' % (stream_name, reference_designator), auth=(token, ''), params=request.args)
    return response.text, response.status_code


@app.route('/api/uframe/get_csv/<string:stream_name>/<string:reference_designator>/<string:start>/<string:end>')
def get_csv(stream_name, reference_designator, start, end):
    token = get_login()
    dpa = "1"
    user = request.args.get('user', '')
    email = request.args.get('email', '')
    url = app.config['SERVICES_URL'] + '/uframe/get_csv/%s/%s/%s/%s/%s?user=%s&email=%s' % (stream_name, reference_designator, start, end, dpa, user, email)
    req = requests.get(url, auth=(token, ''), stream=True)
    return Response(stream_with_context(req.iter_content(chunk_size=1024*1024*4)), headers=dict(req.headers))


@app.route('/api/uframe/get_json/<string:stream_name>/<string:reference_designator>/<string:start>/<string:end>/<string:provenance>/<string:annotations>')
def get_json(stream_name, reference_designator, start, end, provenance, annotations):
    token = get_login()
    dpa = "0"
    user = request.args.get('user', '')
    email = request.args.get('email', '')
    url = app.config['SERVICES_URL'] + '/uframe/get_json/%s/%s/%s/%s/%s/%s/%s?user=%s&email=%s' % (stream_name, reference_designator, start, end, dpa, provenance, annotations, user, email)
    req = requests.get(url, auth=(token, ''), stream=True, params=request.args)
    return Response(stream_with_context(req.iter_content(chunk_size=1024*1024*4)), headers=dict(req.headers))


@app.route('/api/uframe/get_netcdf/<string:stream_name>/<string:reference_designator>/<string:start>/<string:end>/<string:provenance>/<string:annotations>')
def get_netcdf(stream_name, reference_designator, start, end, provenance, annotations):
    token = get_login()
    dpa = "0"
    user = request.args.get('user', '')
    email = request.args.get('email', '')
    req = requests.get(app.config['SERVICES_URL'] + '/uframe/get_netcdf/%s/%s/%s/%s/%s/%s/%s?user=%s&email=%s'
                       % (stream_name, reference_designator, start, end, dpa, provenance, annotations, user, email), auth=(token, ''), stream=True)
    return Response(stream_with_context(req.iter_content(chunk_size=1024*1024*4)), headers=dict(req.headers))


@app.route('/api/uframe/get_profiles/<string:stream_name>/<string:reference_designator>')
def get_profiles(stream_name, reference_designator):
    token = get_login()
    req = requests.get(app.config['SERVICES_URL'] + '/uframe/get_profiles/%s/%s/%s/%s' % (stream_name, reference_designator), auth=(token, ''), stream=True)
    return Response(stream_with_context(req.iter_content(chunk_size=1024*1024*4)), headers=dict(req.headers))


@app.route('/svg/plot/<string:instrument>/<string:stream>', methods=['GET'])
def get_plotdemo(instrument, stream):
    token = get_login()
    import time
    t0 = time.time()
    req = requests.get(app.config['SERVICES_URL'] + '/uframe/plot/%s/%s' % (instrument, stream), auth=(token, ''), params=request.args)
    t1 = time.time()
    print "GUI took %s" % (t1 - t0)
    # they fake the response to 200
    return req.content, req.status_code, dict(req.headers)


# C2 Routes
@app.route('/api/c2/array_display/<string:array_code>', methods=['GET'])
def get_c2_array_display(array_code):
    response = requests.get(app.config['SERVICES_URL'] + '/c2/array_display/%s' % (array_code))
    return response.text, response.status_code


@app.route('/api/c2/platform_display/<string:reference_designator>', methods=['GET'])
def get_c2_platform_display(reference_designator):
    response = requests.get(app.config['SERVICES_URL'] + '/c2/platform_display/%s' % (reference_designator))
    return response.text, response.status_code


@app.route('/api/c2/instrument_display/<string:reference_designator>', methods=['GET'])
def get_c2_instrument_display(reference_designator):
    response = requests.get(app.config['SERVICES_URL'] + '/c2/instrument_display/%s' % (reference_designator))
    return response.text, response.status_code


@app.route('/api/c2/instrument/<string:reference_designator>/<string:stream_name>', methods=['GET'])
def get_c2_instrument_fields(reference_designator, stream_name):
    response = requests.get(app.config['SERVICES_URL'] + '/c2/instrument/%s/%s/fields' % (reference_designator, stream_name))
    return response.text, response.status_code
