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


//used for the metadata about a param
var AlertMetadataModel = Backbone.Model.extend({
    url:"#", 
    defaults:{
        fillValue: "", //number in str format
        particleKey: "",  //param name
        pdId: "",    //id for the param
        shape: "", //shape type
        stream: "", //stream name        
        type: "",   //param type
        units: "",  //param units
        unsigned: false   //not sure....
    }    
});    

//holds the return of the collection
var AlertMetadataCollection = Backbone.Collection.extend({            
    model:AlertMetadataModel,
    stream_model: null,
    url: function(){        
        return "/alerts/get_instrument_metadata/"+this.stream_model.get('reference_designator')+"/"+this.stream_model.get('stream_name');
    },      
    parse: function(response, options) {            
        return response.stream_metadata      
    }
});    


//alert model
var AlertModel = Backbone.Model.extend({
    defaults: {        
    },
    url:"/api/aa/alerts",    
    validation: {
        uframe_filter_id:{
            required: false
        },
        uframe_event_id:{
            required: false
        },
        active: {
            required: false
        },
        array_name: {
            required: false
        },
        description:{
            required: false
        },
        event_type:{
            required: false  
        },
        high_value:{
            required: false  
        },
        instrument_name: {
            required: false
        },
        instrument_parameter: {
            required: false
        },
        instrument_parameter_pdid: {
            required: false
        },
        low_value:{
            required: false  
        },
        operator:{
            required: false
        },
        platform_name:{
            required: false
        },
        reference_designator: {
            required: false
        },             
        severity:{
            required: false
        },                
        stream: {
            required: false
        },        
        escalate_on:{
            required:false 
        },
        escalate_boundary:{
            required:false 
        },
        use_email:{
            required:false 
        },
        use_log:{
            required:false 
        },
        use_phone:{
            required:false 
        },
        use_redmine:{
            required:false 
        },
        use_sms:{
            required:false 
        },
        user_id: {
            required:false 
        }
    }
});

//full collection of alerts
var AlertsFullCollection = Backbone.Collection.extend({
    model: AlertModel,
    url:"/api/aa/alerts"
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
            required: true 
        },
        active: {
            required: false
        },
        description:{
            required: false
        }
    }
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

