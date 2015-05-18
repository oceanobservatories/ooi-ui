"use strict";
/*
 * ooiui/static/js/views/common/LogSearchView.js
 */

var LogSearchView = Backbone.View.extend({
  events: {
    'input #log-search' : 'onInput'
  },
  onInput: function(e) {
    this.trigger('onInput', this.$el.find('#log-search').val());
  },
  template: JST['ooiui/static/js/partials/LogSearch.html'],
  render: function() {
    this.$el.html(this.template());
    return this;
  }
});
