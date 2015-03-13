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
    url:" ",
    
    validation: {
        array: {
            required: true
        },
        Platform: {
            required: true
        },
        Instrument: {
            required: true
        },
        User: {
            required: true
        },
        OtherUser:{
            required: true
        },
        Name: {
            required: true
        },
        Priority: {
            required: true
        },
        Description:{
            required: true
        },
        Email: {
            required: true
        },
        Redmine: {
            required: true
        },
        PhoneCall:{
            required: true
        },
        TextMessage: {
            required: true
        },
        LogEvent:{
            required: true
        }




    }
});


