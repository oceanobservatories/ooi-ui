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
        array: "default",
        Instrument: "default",
        Platform: "default"
    },
    url:"/alert",
    
    validation: {
        array: {
            required:true 
        },
        Platform: {
            required: false
        },
        Instrument: {
            required: false
        },
        User: {
            required: false
        },
        OtherUser:{
            required: false
        },
        Name: {
            required: false
        },
        Priority: {
            required: false
        },
        Description:{
            required: false
        },
        Email: {
            required: false
        },
        Redmine: {
            required: false
        },
        PhoneCall:{
            required:true 
        },
        TextMessage: {
            required: false
        },
        LogEvent:{
            required: false
        }
    }
});


//full collection of alerts
var AlertsFullCollection = Backbone.Collection.extend({
    model: AlertModel,
    url:"/api/aa/arrays"
});

