"use strict";
/*
 * ooiui/static/js/views/science/StreamDownloadFormView.js
 * View Definition for DownloadFormView
 *
 * Dependencies
 * Partials
 * - ooiui/static/js/partials/DownloadFOrm.html
 * Libs
 * - ooiui/static/lib/underscore/underscore.js
 * - ooiui/static/lib/backbone/backbone.js
 * - ooiui/static/js/ooi.js
 * Usage
 */


var StreamDownloadFormView = Backbone.View.extend({
  events: {
  },
  initialize: function() {
    this.render();
  },
  failure: function() {
    console.log("this failure");
  },
  show: function() {
    this.$el.find('#download-modal').modal('show');
    return this;
  },
  hide: function() {
    this.$el.find('#download-modal').modal('hide');
    return this;
  },
  template: JST["ooiui/static/js/partials/StreamDownloadForm.html"],
  render: function() {
    this.$el.html(this.template({}));
  }
});
