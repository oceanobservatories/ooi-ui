"use strict";
/*
 * ooiui/static/js/models/c2/ArrayAbstractModel.js
 * Model definitions for C2 array abstract
 *
 * Dependencies
 * Libs
 * - ooiui/static/lib/underscore/underscore.js
 * - ooiui/static/lib/backbone/backbone.js
 * Usage
 *
 * http://localhost:4000/c2/array/CP/abstract
{
  "abstract": {
    "array_id": 3,
    "display_name": "Coastal Pioneer",
    "operational_status": "Online",
    "reference_designator": "CP"
  }
}
 */

var ArrayAbstractModel = Backbone.Model.extend({
  urlRoot: '/api/c2/array/CP/abstract',
  defaults: {
    array_id: 3,
    display_name: "Coastal Pioneer",
    operational_status: "Unknown",
    reference_designator: "CP"
    }
});

var ArrayAbstractCollection = Backbone.Collection.extend({
  url: function() {
    return this.document.url() + '/api/c2/array/CP/abstract';
  },
  model: ArrayAbstractModel,
  parse: function(response) {
    if(response) {
      return response.abstract;
    } else {
      return [];
    }
  }
});