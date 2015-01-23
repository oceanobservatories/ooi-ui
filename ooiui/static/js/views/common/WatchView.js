"use strict";
/*
* ooiui/static/js/views/common/ChartView.js
* View definitions for charts
*
* Dependencies
* Libs
* - ooiui/static/lib/underscore/underscore.js
* - ooiui/static/lib/backbone/backbone.js
* - ooiui/static/js/ooi.js
*
* Usage
*/

var WatchView = Backbone.View.extend({
  initialize: function() {
    _.bindAll(this, "render");
    var self = this;
    this.collection.comparator = function(model) {
      var d = model.getEndDate();
      if(d == null) { 
        d = new Date(); 
      } else {
        d = new Date(d);
      }

      return -d;
    };
    this.collection.fetch({
      success: function(collection, response, options) {
        self.render();
      }
    });
  },
  template: JST['ooiui/static/js/partials/OpLog.html'],
  render: function() {
    // Sort by the end date
    this.collection.sort();
    this.$el.html(this.template({collection: this.collection}));
  }
});
