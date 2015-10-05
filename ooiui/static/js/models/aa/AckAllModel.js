"use strict";

/*
 *
 * ooiui/static/js/models/common/AckAllModel.js
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

var AckAllModel = Backbone.Model.extend({
  defaults: {
  },
  url:"/api/aa/ack_alert_alarm_definition",

  validation: {
    id: {
      required: false
    }
  }
});


// Collection related to the acknowledged A&A in the system
var AckAllCollection = Backbone.Collection.extend({
  model: AckAllModel,
  url:"/api/aa/ack_alert_alarm_definition"
});

