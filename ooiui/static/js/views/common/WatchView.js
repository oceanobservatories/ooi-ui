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
    console.log("fethching colleciton");
    this.render();
  },
  template: JST['ooiui/static/js/partials/OpLog.html'],
  render: function() {
    console.log("render called");
    // this.collection.each(function(model) {
    //   this.$el.append("<div>" + this.model.get("title") + "</div>")
    // }
    this.$el.html(this.template());
  }
});
