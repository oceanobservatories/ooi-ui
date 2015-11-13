"use strict";

/*
 *
 * ooiui/static/js/models/common/RetireModel.js
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

var RetireModel = Backbone.Model.extend({
  defaults: {
    id: null
  },
  url:"/api/aa/delete_alert_alarm_definition",

  validation: {
    id: {
      required: false
    }
  }
});


// Collection related to the acknowledged A&A in the system
var RetireCollection = Backbone.Collection.extend({
  model: RetireModel,
  url:"/api/aa/delete_alert_alarm_definition"
});

