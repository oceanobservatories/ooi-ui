/*
__author = 'Matt Campbell'

API List from ooiservices.

Requires current service running from ooi-ui-service
*/

/* TODO: Externalize this */
var BASE_URL = 'http://localhost:4000/';
function getForm(url_val, callback) {
    jQuery.ajax({
         type: "GET",
         url: url_val,
         contentType: "application/javascript; charset=utf-8",
         dataType: "jsonp",
         success: function (data) {
            result = JSON.stringify(data, null, 2);
            callback(result);
         },
         error: function (jqXHR, status) {
            return document.write(jqXHR.responseText);
         }
    });
}
function getArray (array_id) {
    var url_val = BASE_URL + "arrays/" + array_id;
    getForm(url_val, function(result) {
        //Default behavior: return JSON.
        return result;
    });

}
function getArrayList () {
    var url_val = BASE_URL + "arrays";
    getForm(url_val, function(result) {
        return result;
    }
}
function getPlatform (platform_id) {
    var url_val = BASE_URL + "platforms/" + platform_id;
    getForm(url_val, function(result) {
        //Default behavior: return JSON.
        return result;
    });
}
function getPlatformList() {
    var url_val = BASE_URL + "platforms";
    getForm(url_val, function(result) {
        return result;
    }
}
function getInstrument (instrument_id) {
    var url_val = BASE_URL + "instruments/" + instrument_id;
    getForm(url_val, function(result) {
        //Default behavior: return JSON.
        return result;
    });
}
function getInstrumentList () {
    var url_val = BASE_URL + "instruments";
    getForm(url_val, function(result) {
        return result;
    }
}
function getStream (stream_id) {
    var url_val = BASE_URL + "streams/" + stream_id;
    getForm(url_val, function(result) {
        //Default behavior: return JSON.
        return result;
    });
}
function getStreamList () {
    var url_val = BASE_URL + "streams";
    getForm(url_val, function(result) {
        return result;
    }
}
function getPlatformsAtArray (array_id) {
    var url_val = BASE_URL + "platforms?array_id=" + array_id;
    getForm(url_val, function(result) {
        //Default behavior: return JSON.
        return result;
    });
}
function getInstrumentsAtPlatform (platform_id) {
   var url_val = BASE_URL + "instruments?platform_id=" + platform_id;
   getForm(url_val, function(result) {
       //Default behavior: return JSON.
        return result;
    });
}
