"use strict";
/*
 * ooiui/static/js/views/common/LogEntryView.js
 */

var LogEntryView = Backbone.View.extend({
  template: JST['ooiui/static/js/partials/LogEntry.html'],
  render: function() {
    this.$el.html(this.template());
    return this;
  }
});
