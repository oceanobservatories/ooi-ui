/*
__author = 'Matt Campbell'
API List from ooiservices.
Requires current service running from ooi-ui-service
*/
/* TODO: Externalize this */
var BASE_URL = 'http://localhost:4000/';
var jsonMimeType = "application/json;charset=UTF-8";
//Helper function to do the GET
function _getForm(url_val, callback) {
    jQuery.ajax({
         url: url_val,
         dataType: 'jsonp',
         complete: function(jqXHR, status) {
             console.debug(status);
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
//Helper function for building lists.
function _buildList(json_string) {
    var data = JSON.parse(json_string);
    //Build a simple json dictionary of only the ids
    var new_json = '[';
    for (var i=0; i<data.length; i++) {
        new_json += '{ "id" : "' + data[i].id + '" },';
    }
    new_json = new_json.slice(0, -1);
    //Remove the trailing comma (,)
    new_json = new_json.substring(0, new_json.length-1) + "}]";
    console.debug('reformed:' + new_json);
    return JSON.stringify(new_json);
}
function getArray (array_id) {
    var url_val = BASE_URL + "arrays/" + array_id;
    _getForm(url_val, function(result) {
        //Default behavior: return JSON.
        return result;
    });
}
function getArrayList () {
    var url_val = BASE_URL + "arrays";
    _getForm(url_val, function(result) {
        //Return a list of id
        return _buildList(result);
    });
}
function getPlatform (platform_id) {
    var url_val = BASE_URL + "platforms/" + platform_id;
    _getForm(url_val, function(result) {
        //Default behavior: return JSON.
        return result;
    });
}
function getPlatformList() {
    var url_val = BASE_URL + "platforms";
    _getForm(url_val, function(result) {
        //Return a list of id
        return _buildList(result);
    });
}
function getInstrument (instrument_id) {
    var url_val = BASE_URL + "instruments/" + instrument_id;
    _getForm(url_val, function(result) {
        //Default behavior: return JSON.
        return result;
    });
}
function getInstrumentList () {
    var url_val = BASE_URL + "instruments";
    _getForm(url_val, function(result) {
        //Return a list of id
        return _buildList(result);
    });
}
function getStream (stream_id) {
    var url_val = BASE_URL + "streams/" + stream_id;
    _getForm(url_val, function(result) {
        //Default behavior: return JSON.
        return result;
    });
}
function getStreamList () {
    var url_val = BASE_URL + "streams";
    _getForm(url_val, function(result) {
        //Return a list of id
        return _buildList(result);
    });
}
function getPlatformListAtArray (array_id) {
    var url_val = BASE_URL + "platforms?array_id=" + array_id;
    _getForm(url_val, function(result) {
        //Return a list of platforms at a specified array
        return _buildList(result);
    });
}
function getInstrumentListAtPlatform (platform_id) {
   var url_val = BASE_URL + "instruments?platform_id=" + platform_id;
    _getForm(url_val, function(result) {
        //Return a list of instruments at specified platform
        return _buildList(result);
    });
}
