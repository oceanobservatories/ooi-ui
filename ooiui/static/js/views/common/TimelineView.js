"use strict";
/*
 * ooiui/static/js/views/common/TimelineView.js
 */

var TimelineView = Backbone.View.extend({
  template: this.JST['ooiui/static/js/partials/Timeline.html'],
  render: function() {
    this.$el.html(this.template());
  }
});
