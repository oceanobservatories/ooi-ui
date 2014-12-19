/*
__author = 'Matt Campbell'
Table of contents generator for OOI.
Requires: ooiservice.js included
*/
function _loadStreams(refId) {
    getStreamListAtInstrument (refId, function(result) {
        var data = JSON.parse(result);
        //Build a simple <li> element, where there is a onclick even.
        var unordered_list = '<ul id="stream-container">';
        for (var i = 0; i < data.length; i++) {
            unordered_list += '<li id="stream-list" onclick="">' + data[i].id + '</li>';
        }
        unordered_list += '</ul>';
        document.getElementById('stream').innerHTML = 'For: ' + refId + ' ' + unordered_list;
    });
}

function _loadInstruments(refId) {
    getInstrumentDeploymentListAtPlatformDeployment(refId, function(result) {
        var data = JSON.parse(result);
        //Build a simple <li> element, where there is a onclick even.
        var unordered_list = '<ul id="instrument-container">';
        for (var i = 0; i < data.length; i++) {
            unordered_list += '<li id="platform-list" onclick="_loadStreams(\'' + data[i].id + '\')">' + data[i].id + '</li>';
        }
        unordered_list += '</ul>';
        document.getElementById('instruments').innerHTML = 'For: ' + refId + ' ' + unordered_list;
    });
}

function _loadPlatforms(refId) {
    getPlatformDeploymentListAtArray(refId, function(result) {
        var data = JSON.parse(result);
        //Build a simple <li> element, where there is a onclick even.
        var unordered_list = '<ul id="platform-container">';
        for (var i = 0; i < data.length; i++) {
            unordered_list += '<li id="platform-list" onclick="_loadInstruments(\'' + data[i].id + '\')">' + data[i].id + '</li>';
        }
        unordered_list += '</ul>';
        document.getElementById('platforms').innerHTML = 'For: ' + refId + ' ' + unordered_list;
    });
}

function BuildTOCMenu() {
    //TODO: Use the return to build a <li><a> of links
    getArrayList(function(result) {
        var data = JSON.parse(result);
        //Build a simple <li> element, where there is a onclick even.
        var unordered_list = '<ul id="toc-container">';
        for (var i = 0; i < data.length; i++) {
            unordered_list += '<li id="nav-item" onclick="_loadPlatforms(\'' + data[i].id + '\')">' + data[i].name + '( ' + data[i].id + ' )</li>';
        }
        unordered_list += '</ul>';
        document.getElementById('arrays').innerHTML = unordered_list;
    });
}