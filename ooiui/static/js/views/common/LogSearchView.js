"use strict";
/*
 * ooiui/static/js/views/common/LogSearchView.js
 */

var LogSearchView = Backbone.View.extend({
  template: JST['ooiui/static/js/partials/LogSearch.html'],
  render: function() {
    this.$el.html(this.template());
    return this;
  }
});
