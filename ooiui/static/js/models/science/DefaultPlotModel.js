"use strict";
/*
 * ooiui/static/js/models/science/DefaultPlotModel.js
 * Model definitions for the default plots
 *
 * Dependencies
 * Partials
 * Libs
 * Usage
 */


var DefaultPlotModel = Backbone.Model.extend({
  urlRoot: '#',
  defaults: {
    title: null,
    instrument: null,
    plotType: [],
  }
});


var DefaultPlotCollection = Backbone.Collection.extend({
  url: "/json/default_plot_collection.json",
  model: DefaultPlotModel,
  parse: function(response, options) {
    return response.defaults;
  }
});


