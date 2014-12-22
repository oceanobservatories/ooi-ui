/*
__author = 'Matt Campbell'
API List from ooiservices.
Requires current service running from ooi-ui-service
*/
/* TODO: Externalize this */
var BASE_URL = 'http://localhost:4000/';
var global = null;
// BEGIN INTERNAL FUNCTIONS */
function _getForm(url_val, callback) {
        jQuery.ajax({
             url: url_val,
             contentType: "application/javascript",
             dataType: 'jsonp',
             complete: function(jqXHR, status) {
                 //console.debug(status);
             },
             success: function (data) {
                result = JSON.stringify(data, null, 2);
                callback(result);
                console.debug('raw: ' + result);
             },
             error: function (jqXHR, status, error) {
                console.error(url_val, error);
             }
        });
    }
function _buildList(json_string) {
        var data = JSON.parse(json_string);

        //Build a simple json dictionary of only the ids
        var new_json = '[';
        for (var i=0; i<data.length; i++) {
            new_json += '{ "id" : "' + data[i].ref_id + '" , "name" : "' + data[i].display_name + '"},';
        }
        new_json = new_json.slice(0, -1);
        //Remove the trailing comma (,)
        new_json = new_json.substring(0, new_json.length-1) + "}]";

        console.debug('reformed:' + new_json);
        //var new_json = JSON.stringify(new_json);
        return new_json;
    }
// END INTERNAL FUNCTIONS */
// --------------------------- */
// BEGIN OBJECT RETURN FUNCTIONS */
function getArray (array_id) {
    var url_val = BASE_URL + "arrays/" + array_id;
    _getForm(url_val, function(result) {
        //Default behavior: return JSON.
        return result;
    });
}
function getPlatform (platform_id) {
    var url_val = BASE_URL + "platforms/" + platform_id;
    _getForm(url_val, function(result) {
        //Default behavior: return JSON.
        return result;
    });
}
function getInstrument (instrument_id) {
    var url_val = BASE_URL + "instruments/" + instrument_id;
    _getForm(url_val, function(result) {
        //Default behavior: return JSON.
        return result;
    });
}
function getPlatformDeployment (platform_id) {
    var url_val = BASE_URL + "platform_deployments/" + platform_id;
    _getForm(url_val, function(result) {
        //Default behavior: return JSON.
        return result;
    });
}
function getInstrumentDeployment (instrument_id) {
    var url_val = BASE_URL + "instrument_deployments/" + instrument_id;
    _getForm(url_val, function(result) {
        //Default behavior: return JSON.
        return result;
    });
}
function getStream (stream_id) {
    var url_val = BASE_URL + "streams/" + stream_id;
    _getForm(url_val, function(result) {
        //Default behavior: return JSON.
        return result;
    });
}
// END OBJECT RETURN FUNCTIONS */
// --------------------------- */
// BEGIN LIST RETURN FUNCTIONS */
function getArrayList (callback) {
    var url_val = BASE_URL + "arrays";
    _getForm(url_val, function(result) {
        callback(_buildList(result));
    });
}
function getPlatformList(callback) {
    var url_val = BASE_URL + "platforms";
    _getForm(url_val, function(result) {
        callback(_buildList(result));
    });
}
function getInstrumentList(callback) {
    var url_val = BASE_URL + "instruments";
    _getForm(url_val, function(result) {
        callback(_buildList(result));
    });
}
function getPlatformDeploymentList(callback) {
    var url_val = BASE_URL + "platform_deployments";
    _getForm(url_val, function(result) {
        callback(_buildList(result));
    });
}
function getInstrumentDeploymentList(callback) {
    var url_val = BASE_URL + "instrument_deployments";
    _getForm(url_val, function(result) {
        callback(_buildList(result));
    });
}
function getStreamList(callback) {
    var url_val = BASE_URL + "streams";
   _getForm(url_val, function(result) {
        callback(_buildList(result));
    });
}
function getPlatformListAtArray (array_id, callback) {
    var url_val = BASE_URL + "platforms?array_code=" + array_id;
   _getForm(url_val, function(result) {
        callback(_buildList(result));
    });
}
function getInstrumentListAtPlatform (platform_id, callback) {
   var url_val = BASE_URL + "instruments?platform_id=" + platform_id;
    _getForm(url_val, function(result) {
        callback(_buildList(result));
    });
}
function getPlatformDeploymentListAtArray (array_id, callback) {
    var url_val = BASE_URL + "platform_deployments?array_code=" + array_id;
   _getForm(url_val, function(result) {
        callback(_buildList(result));
    });
}
function getInstrumentDeploymentListAtPlatformDeployment (platform_id, callback) {
   var url_val = BASE_URL + "instrument_deployments?platform_deployment_code=" + platform_id;
    _getForm(url_val, function(result) {
        callback(_buildList(result));
    });
}
function getStreamListAtInstrument (stream_id, callback) {
   var url_val = BASE_URL + "streams?instrument_id=" + stream_id;
     _getForm(url_val, function(result) {
        callback(_buildList(result));
    });
}
// END LIST RETURN FUNCTIONS */