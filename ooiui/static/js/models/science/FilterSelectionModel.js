"use strict";
/*
 * ooiui/static/js/models/science/FilterSelectionModel.js
 * Model definition for filter
 *
 * Dependencies
 * Partials
 * Libs
 * - ooiui/static/lib/underscore/underscore.js
 * - ooiui/static/lib/backbone/backbone.js
 * Usage
 */

var FilterSelectionModel = Backbone.Model.extend({
  defaults: {
    labelText: "",
    id: "",
    className: "",
    childItem:"",
    parentItem:""
  }
});