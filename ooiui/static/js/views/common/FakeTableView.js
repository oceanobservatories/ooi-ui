"use strict";
/*
 * ooiui/static/js/views/common/FakeTableView.js
 * View definitions for a fake table data view
 *
 * Dependencies
 * Partials
 * - ooiui/static/js/partials/FakeTable.html
 * Libs
 * - ooiui/static/lib/underscore/underscore.js
 * - ooiui/static/lib/backbone/backbone.js
 * - ooiui/static/js/ooi.js
 * Usage
 */


// Takes a collection as a configuration option
var FakeTableView = Backbone.View.extend({
  initialize: function() {
    _.bindAll(this, "render");
    var self = this;
    console.log("Fetching collection");
    this.collection.fetch({
      success: function(collection, response, options) {
        self.render();
      }
    });
  },
  template: JST['ooiui/static/js/partials/FakeTable.html'],
  render: function() {
    console.log("render called");
    this.$el.html(this.template({collection: this.collection}));
  }
});
