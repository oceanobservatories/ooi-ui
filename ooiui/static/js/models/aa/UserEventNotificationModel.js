"use strict";

/*
 *
 * ooiui/static/js/models/common/UserEventNotificationModel.js
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


//alert model
var UserEventNotificationModel = Backbone.Model.extend({
    defaults: {
    },
    url:"/api/aa/user_event_notifications",
    validation: {
        system_event_definition_id:{
            required: false
        },
        user_id:{
            required: false
        },
        use_email: {
            required: false
        },
        use_redmine: {
            required: false
        },
        use_phone:{
            required: false
        },
        use_log:{
            required: false
        },
        use_sms:{
            required: false
        }
    }
});

//full collection of alerts
var UserEventNotificationFullCollection = Backbone.Collection.extend({
    model: UserEventNotificationModel,
    url:"/api/aa/user_event_notifications",
    parse: function(response, options) {
        return response.notifications
  }
});


