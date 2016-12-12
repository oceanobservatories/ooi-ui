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
from ooiui.core.routes.decorators import login_required, scope_required
import json

@app.route('/cilogonhome')
def new_index():
    return render_template('common/home.html', tracking=app.config['GOOGLE_ANALYTICS'])

@app.route('/landing/pioneer')
@login_required()
def landing_pioneer():
    return render_template('landing/pioneer.html', tracking=app.config['GOOGLE_ANALYTICS'])


# @app.route('/assets/list')
# @app.route('/assets/list/')
# @login_required()
# def instr_index():
#     return render_template('asset_management/assetslist.html', tracking=app.config['GOOGLE_ANALYTICS'])

@app.route('/assets/management')
@app.route('/assets/management/')
def assets_management():
    return render_template('asset_management/asset_management.html', tracking=app.config['GOOGLE_ANALYTICS'])


@app.route('/assets/cruises')
@app.route('/assets/cruises/')
def asset_management_cruises():
    return render_template('asset_management/cruises.html', tracking=app.config['GOOGLE_ANALYTICS'])


@app.route('/assets/deployments')
@app.route('/assets/deployments/')
def asset_management_deployments():
    return render_template('asset_management/deployments.html', tracking=app.config['GOOGLE_ANALYTICS'])


@app.route('/events/list/')
@login_required()
def event_list():
    return render_template('asset_management/eventslist.html', tracking=app.config['GOOGLE_ANALYTICS'])


@app.route('/event/<int:id>', methods=['GET'])
@login_required()
def event_index(id):
    return render_template('asset_management/event.html', id=id, tracking=app.config['GOOGLE_ANALYTICS'])


@app.route('/event/<string:new>/<int:aid>/<string:aclass>', methods=['GET'])
@login_required()
def event_new(new, aid, aclass):
    return render_template('asset_management/event.html', id=str(new), assetid=aid, aclass=str(aclass), tracking=app.config['GOOGLE_ANALYTICS'])


@app.route('/streams/')
def streams_page():
    return render_template('science/streams.html', tracking=app.config['GOOGLE_ANALYTICS'])

# @app.route('/datacatalog/')
# def data_catalog_page():
#     return render_template('science/data_catalog.html', tracking=app.config['GOOGLE_ANALYTICS'])

@app.route('/streamingdata/')
@app.route('/streamingdata')
def streaming_data_page():
    return render_template('science/streaming_data.html', tracking=app.config['GOOGLE_ANALYTICS'])


@app.route('/antelope_acoustic/')
def acoustics_page():
    return render_template('science/antelope_acoustic.html', tracking=app.config['GOOGLE_ANALYTICS'])


# @app.route('/plot', methods=['GET'])
# @app.route('/plot/', methods=['GET'])
# def show_plot_no_path():
#     return plot_page(None)
#
#
# @app.route('/plot/<path:path>', methods=['GET'])
# def plot_page(path):
#     return render_template('science/plot.html', tracking=app.config['GOOGLE_ANALYTICS'])


@app.route('/datacatalog/')
@app.route('/plot', methods=['GET'])
@app.route('/plot/', methods=['GET'])
@app.route('/data_access', methods=['GET'])
@app.route('/data_access/', methods=['GET'])
def show_data_access_no_path():
    return render_template('science/data_access.html', tracking=app.config['GOOGLE_ANALYTICS'])


# @app.route('/data_access/<path:path>', methods=['GET'])
# def data_access(path):
#     return render_template('science/data_access.html', tracking=app.config['GOOGLE_ANALYTICS'])


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


@app.route('/api/get_large_format_data', methods=['GET'])
def get_uframe_large_format_data():
    '''
    Make a request to the services to get the listing of large format data
    Example request:
        /uframe/get_large_format_files_by_ref/RS03ASHS-MJ03B-05-OBSSPA302/2015-11-30
    '''
    try:
        # Parse the parameters
        ref_des = request.args['ref_des']
        date = request.args['date']  # Expecting ISO format <yyyy-mm-dd>

        # Build the URL
        data_url = "/".join([app.config['SERVICES_URL'], 'uframe/get_large_format_files_by_ref', ref_des, date])

        # Get the response
        response = requests.get(data_url, params=request.args)
        return response.text, response.status_code, dict(response.headers)
    except Exception, e:
        return jsonify(error=str(e))


@app.route('/api/annotation', methods=['GET'])
def get_annotations():
    try:
        response = requests.get(app.config['SERVICES_URL'] + '/annotation', params=request.args)
        return response.text, response.status_code, dict(response.headers)
    except Exception, e:
        return jsonify(error=str(e))


@app.route('/api/annotation', methods=['POST'])
def post_annotation():
    token = get_login()
    headers = {'Content-Type': 'application/json'}
    url = app.config['SERVICES_URL'] + '/annotation'
    response = requests.post(url, auth=(token, ''), data=request.data, headers=headers)
    return response.text, response.status_code, dict(response.headers)


@app.route('/api/annotation/<string:id>', methods=['PUT'])
def put_annotation(id):
    token = get_login()
    headers = {'Content-Type': 'application/json'}
    url = app.config['SERVICES_URL'] + '/annotation/%s' % id
    response = requests.put(url, auth=(token, ''), data=request.data, headers=headers)
    return response.text, response.status_code


# old
@app.route('/api/array')
def array_proxy():
    response = requests.get(app.config['SERVICES_URL'] + '/arrays', params=request.args)
    # response = requests.get(app.config['SERVICES_URL'] + '/uframe/status/arrays', params=request.args)
    return response.text, response.status_code


@app.route('/api/uframe/status/arrays')
def status_arrays():
    response = requests.get(app.config['SERVICES_URL'] + '/uframe/status/arrays', params=request.args)
    return response.text, response.status_code


@app.route('/api/uframe/status/sites/<string:array_code>')
def status_sites(array_code):
    response = requests.get(app.config['SERVICES_URL'] + '/uframe/status/sites/%s' % array_code, params=request.args)
    return response.text, response.status_code


@app.route('/api/uframe/status/platforms/<string:array_code>')
def status_platforms(array_code):
    response = requests.get(app.config['SERVICES_URL'] + '/uframe/status/platforms/%s' % array_code, params=request.args)
    return response.text, response.status_code


@app.route('/api/uframe/status/instrument/<string:ref_des>')
def status_instrument(ref_des):
    response = requests.get(app.config['SERVICES_URL'] + '/uframe/status/instrument/%s' % ref_des, params=request.args)
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


# @app.route('/api/display_name')
# def display_name():
#     ref = request.args['reference_designator']
#     response = requests.get(app.config['SERVICES_URL'] + '/display_name'+"?reference_designator="+ref, params=request.args)
#     return response.text, response.status_code


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
    # print request.data
    response = requests.put(app.config['SERVICES_URL'] + '/uframe/assets/%s' % id, data=request.data)
    return response.text, response.status_code


@app.route('/api/asset_deployment/edit_phase_values', methods=['GET'])
@scope_required('asset_manager')
@login_required()
def asset_edit_phase_values():
    response = requests.get(app.config['SERVICES_URL'] + '/uframe/assets/edit_phase_values', data=request.data)
    select = create_html_select_from_list(json.loads(response.text)['values'])
    return select, response.status_code


@app.route('/api/asset_deployment/asset_type_values', methods=['GET'])
@scope_required('asset_manager')
@login_required()
def asset_types_values():
    response = requests.get(app.config['SERVICES_URL'] + '/uframe/assets/types/supported', data=request.data)
    select = create_html_select_from_list(json.loads(response.text)['asset_types'])
    print select
    return select, response.status_code


@app.route('/api/asset_deployment/ajax', methods=['POST'])
@scope_required('asset_manager')
@login_required()
def instrument_deployment_put_ajax():
    token = get_login()
    # print request.form
    # print request.data
    json_data = ''
    if (len(request.data) > 0):
        json_data = dot_to_json(json.loads(request.data))
    if (len(request.form) > 0):
        json_data = dot_to_json(json.loads(json.dumps(request.form.to_dict())))
    if len(json_data) > 0:
        clean_data = {k:v for k,v in json_data.iteritems() if (k != 'oper')}
        # print json_data
        # print clean_data
    else:
        return 'No operation type found in data!', 500

    # print 'eventId'
    # print clean_data['eventId']

    if 'oper' in json_data:
        operation_type = json_data['oper']
        # print operation_type
    else:
        return 'No operation type found in data!', 500

    if operation_type == 'edit':
        # print 'edit record'
        # print clean_data['eventId']
        # print app.config['SERVICES_URL'] + '/uframe/events/%s' % clean_data['eventId']
        print json.dumps(clean_data)
        response = requests.put(app.config['SERVICES_URL'] + '/uframe/assets/%s' % clean_data['id'], auth=(token, ''), data=json.dumps(clean_data))
        return response.text, response.status_code
        # return 'Edit record operation', 200

    if operation_type == 'add':
        # print 'add record'
        clean_data = {k:v for k,v in clean_data.iteritems() if (k != 'id' and k != 'lastModifiedTimestamp')}
        # print clean_data
        response = requests.post(app.config['SERVICES_URL'] + '/uframe/assets', auth=(token, ''), data=json.dumps(clean_data))
        return response.text, response.status_code
        # return 'Add record operation!', 200

    return 'No operation performed!', 200


def dot_to_json(a):
    output = {}
    for key, value in a.iteritems():
        path = key.split('.')
        if path[0] == 'json':
            path = path[1:]
        target = reduce(lambda d, k: d.setdefault(k, {}), path[:-1], output)
        target[path[-1]] = value
    return output


def create_html_select_from_list(the_values):
    output = "<select>"
    for value in the_values:
        output += '<option value="%s">%s</option>' % (value, value)
    output += "</select>"
    return output


@app.route('/api/asset_deployment', methods=['POST'])
@scope_required('asset_manager')
@login_required()
def instrument_deployment_post():
    # print request.data
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
    # print response.text
    return response.text, response.status_code


@app.route('/api/asset_events/<int:id>', methods=['PUT'])
@scope_required('asset_manager')
@login_required()
def asset_event_put(id):
    token = get_login()
    response = requests.put(app.config['SERVICES_URL'] + '/uframe/events/%s' % id, auth=(token, ''), data=request.data)
    return response.text, response.status_code


@app.route('/api/uframe/events/operational_status_values', methods=['GET'])
def get_operational_status_values():
    response = requests.get(app.config['SERVICES_URL'] + '/uframe/events/operational_status_values', params=request.args)
    select = create_html_select_from_list(json.loads(response.text)['operational_status_values'])
    return select, response.status_code


@app.route('/api/asset_events', methods=['POST'])
@scope_required('asset_manager')
@login_required()
def asset_event_post():
    token = get_login()
    # print request.form
    # print request.data
    json_data = ''
    if (len(request.data) > 0):
        json_data = dot_to_json(json.loads(request.data))
    if (len(request.form) > 0):
        json_data = dot_to_json(json.loads(json.dumps(request.form.to_dict())))
    if len(json_data) > 0:
        clean_data = {k:v for k,v in json_data.iteritems() if (k != 'oper' and k != 'id')}
        # print json_data
        # print clean_data
    else:
        return 'No operation type found in data!', 500

    # print 'eventId'
    # print clean_data['eventId']

    if 'oper' in json_data:
        operation_type = json_data['oper']
        # print operation_type
    else:
        return 'No operation type found in data!', 500

    if operation_type == 'edit':
        # print 'edit record'
        # print clean_data['eventId']
        # print app.config['SERVICES_URL'] + '/uframe/events/%s' % clean_data['eventId']
        # print json.dumps(clean_data)
        response = requests.put(app.config['SERVICES_URL'] + '/uframe/events/%s' % clean_data['eventId'], auth=(token, ''), data=json.dumps(clean_data))
        return response.text, response.status_code
        # return 'Edit record operation', 200

    if operation_type == 'add':
        # print 'add record'
        clean_data = {k:v for k,v in clean_data.iteritems() if (k != 'eventId' and k != 'lastModifiedTimestamp')}
        # print clean_data
        response = requests.post(app.config['SERVICES_URL'] + '/uframe/events', auth=(token, ''), data=json.dumps(clean_data))
        return response.text, response.status_code
        # return 'Add record operation!', 200

    return 'No operation performed!', 200



@app.route('/api/events', methods=['GET'])
def get_event_by_ref_des():
    response = requests.get(app.config['SERVICES_URL'] + '/uframe/events?ref_des=%s' % request.args.get('ref_des'), data=request.args)
    return response.text, response.status_code


@app.route('/opLog.html')
def op_log():
    return render_template('common/opLog.html', tracking=app.config['GOOGLE_ANALYTICS'])


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


@app.route('/api/cruises', methods=['GET'])
def get_cruises():
    response = requests.get(app.config['SERVICES_URL'] + '/uframe/cruises')
    return response.text, response.status_code


@app.route('/api/cruises/<string:eventId>/deployments', methods=['GET'])
def get_cruise_deployments(eventId):
    response = requests.get(app.config['SERVICES_URL'] + '/uframe/cruises/%s/deployments' % (eventId))
    return response.text, response.status_code


@app.route('/api/deployments/subsites', methods=['GET'])
def get_deployments_inv():
    response = requests.get(app.config['SERVICES_URL'] + '/uframe/deployments/inv')
    return response.text, response.status_code


@app.route('/api/deployments/<string:subsiteRd>/nodes', methods=['GET'])
def get_deployments_nodes(subsiteRd):
    response = requests.get(app.config['SERVICES_URL'] + '/uframe/deployments/inv/' + subsiteRd)
    return response.text, response.status_code


@app.route('/api/deployments/<string:subsiteRd>/<string:nodeRd>/sensors', methods=['GET'])
def get_deployments_sensors(subsiteRd, nodeRd):
    response = requests.get(app.config['SERVICES_URL'] + '/uframe/deployments/inv/' + subsiteRd + '/' + nodeRd)
    return response.text, response.status_code


@app.route('/api/deployments/<string:rd>', methods=['GET'])
def get_deployments_by_rd(rd):
    response = requests.get(app.config['SERVICES_URL'] + '/uframe/deployments/' + rd)
    return response.text, response.status_code


@app.route('/api/deployments/ajax', methods=['POST'])
@scope_required('asset_manager')
@login_required()
def deployment_post_ajax():
    token = get_login()
    # print request.form
    # print request.data
    json_data = ''
    if (len(request.data) > 0):
        json_data = dot_to_json(json.loads(request.data))
    if (len(request.form) > 0):
        json_data = dot_to_json(json.loads(json.dumps(request.form.to_dict())))
    if len(json_data) > 0:
        clean_data = {k:v for k,v in json_data.iteritems() if (k != 'oper')}
        # print json_data
        # print clean_data
    else:
        return 'No operation type found in data!', 500

    # print 'eventId'
    # print clean_data['eventId']

    if 'oper' in json_data:
        operation_type = json_data['oper']
        # print operation_type
    else:
        return 'No operation type found in data!', 500

    if operation_type == 'edit':
        # print 'edit record'
        # print clean_data['eventId']
        # print app.config['SERVICES_URL'] + '/uframe/events/%s' % clean_data['eventId']
        print json.dumps(clean_data)
        response = requests.put(app.config['SERVICES_URL'] + '/uframe/deployments/%s' % clean_data['id'], auth=(token, ''), data=json.dumps(clean_data))
        return response.text, response.status_code
        # return 'Edit record operation', 200

    if operation_type == 'add':
        # print 'add record'
        clean_data = {k:v for k,v in clean_data.iteritems() if (k != 'id' and k != 'lastModifiedTimestamp')}
        # print clean_data
        response = requests.post(app.config['SERVICES_URL'] + '/uframe/deployments', auth=(token, ''), data=json.dumps(clean_data))
        return response.text, response.status_code
        # return 'Add record operation!', 200

    return 'No operation performed!', 200
