/*
__author = 'Matt Campbell'

API List from ooiservices.

Requires current service running from ooi-ui-service
*/
var BASE_URL = 'http://localhost:4000/';
function getForm(url_val, callback) {
    jQuery.ajax({
         type: "GET",
         url: url_val,
         contentType: "application/json; charset=utf-8",
         dataType: "json",
         success: function (data) {
            result = JSON.stringify(data, null, 2);
            callback(result);
         },
         error: function (jqXHR, status) {
            return document.write(jqXHR.responseText);
         }
    });
}
function getArrays () {
    var url_val = BASE_URL + "array";
    getForm(url_val, function(result) {
        //Default behavior: return JSON.
        return result;
    });

}
function getPlatform (platform_id) {
    var url_val = BASE_URL + "platform/" + platform_id;
    getForm(url_val, function(result) {
        //Default behavior: return JSON.
        return result;
    });
}
function getInstrument (instrument_id) {
    var url_val = BASE_URL + "instrument/" + instrument_id;
    getForm(url_val, function(result) {
        //Default behavior: return JSON.
        return result;
    });
}
function getPlatformsAtArray (array_id) {
    var url_val = BASE_URL + "platform?array_id=" + array_id;
    getForm(url_val, function(result) {
        //Default behavior: return JSON.
        return result;
    });
}
function getInstrumentsAtPlatform (platform_id) {
   var url_val = BASE_URL + "instrument?platform_id=" + platform_id;
   getForm(url_val, function(result) {
       //Default behavior: return JSON.
        return result;
    });
}