"use strict";
/*
 * ooiui/static/js/models/science/PlotTimeModel.js
 * Model definition for Start and end time of plotting
 */



var PlotTimeModel = Backbone.Model.extend({
    urlRoot: '/api/array',
    defaults: {
        start_date: null,
        end_date: null
    }
});
