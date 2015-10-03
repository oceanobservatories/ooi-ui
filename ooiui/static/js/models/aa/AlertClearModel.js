"use strict";

/*
 *
 * ooiui/static/js/models/common/AlertClearModel.js
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

var AlertClearModel = Backbone.Model.extend({
  defaults: {
  },
  url:"/api/aa/clear_alert_alarm",

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
    event_type:{
      required: false
    },
    ack_by: {
      required: false
    }
  }
});


// Collection related to the acknowledged A&A in the system
var AlertClearCollection = Backbone.Collection.extend({
  model: AlertClearModel,
  url:"/api/aa/clear_alert_alarm"
});

