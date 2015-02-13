"use strict";
/*
 * ooiui/static/js/views/common/ModalFormView.js
 * View Definition for Generic ModalFormViews
 *
 * Dependencies
 * Partials
 * - ooiui/static/js/partials/ModalForm.html
 * Libs
 * - ooiui/static/lib/underscore/underscore.js
 * - ooiui/static/lib/backbone/backbone.js
 * - ooiui/static/js/ooi.js
 * Usage
 */

var ModalFormView = Backbone.View.extend({
  events: {
  },
  initialize: function() {
    this.render();
  },
  show: function(options) {
    this.$el.find('.modal').modal('show');
    return this;
  },
  hide: function() {
    this.$el.find('.modal').modal('hide');
    return this;
  },
  template: JST["ooiui/static/js/partials/ModalForm.html"],
  render: function() {
    this.$el.html(this.template());
  }
});
