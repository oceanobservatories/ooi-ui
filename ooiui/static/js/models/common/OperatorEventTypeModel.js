"use strict";
/*
 * ooiui/static/js/models/common/OperatorEventTypeModel.js
 * Model definition for Operator Event Types
 *
 * Dependencies
 * Libs
 * - ooiui/static/lib/underscore/underscore.js
 * - ooiui/static/lib/backbone/backbone.js
 * - ooiui/static/js/ooi.js
 *
 * Usage
 */

var OperatorEventTypeModel = Backbone.Model.extend({
  urlRoot: '/api/operator_event_type',
  defaults: {
    "id": "",
    "type_description": "",
    "type_name": ""
  }
});

var OperatorEventTypeCollection = Backbone.Collection.extend({
  url: '/api/operator_event_type',
  model: OperatorEventTypeModel,
  parse: function(response) {
    if(response) {
      return response.operator_event_types;
    }
    return [];
  }
});
