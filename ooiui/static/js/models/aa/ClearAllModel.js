"use strict";

/*
 *
 * ooiui/static/js/models/common/ClearAllModel.js
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

var ClearAllModel = Backbone.Model.extend({
  defaults: {
  },
  url:"/api/aa/resolve_alert_alarm_definition",

  validation: {
    id: {
      required: false
    },
    resolved_comment: {
      required: false
    }
  }
});


// Collection related to the acknowledged A&A in the system
var ClearAllCollection = Backbone.Collection.extend({
  model: ClearAllModel,
  url:"/api/aa/resolve_alert_alarm_definition"
});

