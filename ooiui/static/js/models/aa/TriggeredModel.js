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
  url:"/api/aa/triggered",
  parse: function(response, options) {            
    return response.alert_alarm      
  }
});


var StatusAlertModel = Backbone.Model.extend({
  defaults: {  
    count: 0,
    event_type: "",
    reference_designator:"",
    coordinates:[],
    asset_type:[]
  },  
  url:"#"
});  

//full collection of triggered alerts
var StatusAlertCollection = Backbone.Collection.extend({
  model: StatusAlertModel,
  url:"/api/aa/status",
  parse: function(response, options) {            
    return response.alert_alarm      
  },
  // in InventoryCollection
  sortByStatus: function (value) {
    if (value == "all"){
      var models = this.filter(function (model) {
        return model.get('event_type') != "unknown";
      });  
    }else{
      var models = this.filter(function (model) {
        return model.get('event_type') == value;
      }); 
    }
    return new StatusAlertCollection(models);;
  }  
});