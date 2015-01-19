"use strict";
/*
 * ooiui/static/js/views/common/ChartView.js
 * View definitions for charts
 *
 * Dependencies
 * Partials
 * - ooiui/static/js/partials/Chart.html
 * Libs
 * - ooiui/static/lib/underscore/underscore.js
 * - ooiui/static/lib/backbone/backbone.js
 * - ooiui/static/js/ooi.js
 *
 * Usage
 */

var FakeTableModel = Backbone.Model.extend({
  urlRoot: '#',
  defaults: {
    "team"         : "",
    "wlratio"      : "",
    "qb"           : "",
    "awesome_stat" : ""
  }
});

var FakeTableCollection = Backbone.Collection.extend({
  url: '/json/faketable.json',
  // url: '/api/faketable'
  parse: function(response, options) {
    var t = [];
    _.each(response.rows, function(row) {
      t.push({
        "team"         : row[0],
        "wlratio"      : row[1],
        "qb"           : row[2],
        "awesome_stat" : row[3]
        });
    });
    return t;
  }
});

