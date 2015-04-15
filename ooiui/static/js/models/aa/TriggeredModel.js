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
    url:"/api/aa/triggered",
    
    validation: {
        event_response: {
            required: false
        },
        event_time: {
            required: false
        },
        event_type:{
            required: false
        },
        instrument_name: {
            required: false
        },
        system_event_definition_id: {
            required: false
        }
    }
});


//full collection of triggered alerts
var TriggeredFullCollection = Backbone.Collection.extend({
    model: TriggeredModel,
    url:"/api/aa/triggered"
});

