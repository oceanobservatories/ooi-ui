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

var TriggeredModel = Backbone.Model.extend({
  defaults: {
    //uframe_event_id: "default",
    //dreference_designator: "default"
  },
  //url:"/api/aa/triggered",
  url:"#",
  validation: {
    id: {
      required: false
    },
    system_event_definition_id: {
      required: false
    },
    uframe_event_id: {
      required: false
    },
    uframe_filter_id: {
      required: false
    },
    event_time: {
      required: false
    },
    event_type:{
      required: false
    },
    event_response: {
      required: false
    },
    method: {
      required: false
    },
    deployment: {
      required: false
    },
    acknowledged: {
      required: false
    },
    ack_by: {
      required: false
    },
    ts_acknowledged: {
      required: false
    },
    ticket_id: {
      required: false
    },
    escalated: {
      required: false
    },
    ts_escalated: {
      required: false
    },
    timestamp: {
      required: false
    },
    ts_start: {
      required: false
    }
  }
});


//full collection of triggered alerts
var TriggeredFullCollection = Backbone.Collection.extend({
  model: TriggeredModel,
  url:"/json/sample_alert_from_uframe.json",
  parse: function(response, options) {            
    return response.alert_alarm      
  }
});

