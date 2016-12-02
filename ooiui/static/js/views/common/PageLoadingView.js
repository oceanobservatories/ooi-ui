"use strict";

var PageLoadingView = Backbone.View.extend({
  initialize: function(options) {
    this.options = options;
    _.bindAll(this, "render");
    this.render();
  },

  template: JST['ooiui/static/js/partials/PageLoading.html'],

  render: function() {
    //console.log('Adding page loading whirlygig');
    this.$el.html(this.template);
    //this.$el.find('#loadingHolder').append(this.template);
  }
});

