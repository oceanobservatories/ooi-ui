"use strict";
/*
 * ooiui/static/js/views/common/PanelView.js
 * View definitions to build the navbar
 *
 * Dependencies
 * Libs
 * - ooiui/static/lib/underscore/underscore.js
 * - ooiui/static/lib/backbone/backbone.js
 * - ooiui/static/js/ooi.js
 * Usage
 */


var PanelView = Backbone.View.extend({
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
  template: JST['ooiui/static/js/partials/Panel.html'],
  render: function() {
    this.$el.html(this.template(this.renderOptions));
  }
});
