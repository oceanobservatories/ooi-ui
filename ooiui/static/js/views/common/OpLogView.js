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

var OpLogView = Backbone.View.extend({
  className: "panel",
  initialize: function(options) {
    _.bindAll(this, "render");
    if(options && options.heading && options.body) {
      this.renderOptions = options;
    } else {
      this.renderOptions = {
        heading: "Panel Heading",
        body: "<i>Panel Body</i>",
      }
    }
    this.render();
  },
  template: JST['ooiui/static/js/partials/OpLog.html'],
  render: function() {
    this.$el.html(this.template(this.renderOptions));
  }
})
