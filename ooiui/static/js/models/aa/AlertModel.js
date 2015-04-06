"use strict";

/*
 * 
 * ooiui/static/js/models/common/AlertModel.js
 * Validation model for Alerts and Alarms Page.
 *
 * Dependencies
 * Partials
 * - ooiui/static/js/partials/compiled/alertPage.js
 * Libs
 * - ooiui/static/lib/underscore/underscore.js
 * - ooiui/static/lib/backbone/backbone.js
 * Usage
 * 
 */

var AlertModel = Backbone.Model.extend({
    defaults: {
        //uframe_event_id: "default",
        //dreference_designator: "default"
    },
    url:"/api/aa/alerts",
    
    validation: {
        reference_designator: {
            required: false
        },
        array_name: {
            required: false
        },
        platform_name:{
            required: false
        },
        instrument_name: {
            required: false
        },
        instrument_parameter: {
            required: false
        },
        operator:{
            required: false
        },
        values: {
            required: false
        },
        created_time: {
            required: false
        },
        priority:{
            required:true 
        },
        active: {
            required: false
        },
        description:{
            required: false
        }
    }
});

var TriggeredAlertModel = Backbone.Model.extend({
    defaults: {
        uframe_event_id: "default",
        reference_designator: "default"
    },
    url:"/api/aa/alerts",
    
    validation: {
        reference_designator: {
            required: false
        },
        system_event_definition_id: {
            required: false
        },
        event_time:{
            required: false
        },
        event_response: {
            required: false
        },
        event_type: {
            required: false
        },
        operator:{
            required: false
        },
        values: {
            required: false
        },
        created_time: {
            required: false
        },
        priority:{
            required:true 
        },
        active: {
            required: false
        },
        description:{
            required: false
        }
    }
});


//full collection of alerts
var AlertsFullCollection = Backbone.Collection.extend({
    model: AlertModel,
    url:"/api/aa/alerts"
});


//Todo
var InstrumentFieldList = Backbone.Collection.extend({
    model: AlertModel,
    url:"/api/c2/instrument/CP02PMCO-WFP01-05-PARADK000/streams",
    parse: function(response, options) {
      if(response.streams){
        return response.streams['fields'];
      }
      else{
        return response
      }
    }
});

