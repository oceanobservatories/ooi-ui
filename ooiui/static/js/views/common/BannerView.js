"use strict"
var BannerView = Backbone.View.extend({
  initialize: function(options) {
    _.bindAll(this, "render");
    this.render();
  },
  
  templates: {
    banner: JST['ooiui/static/js/partials/Banner.html']
  },

  render: function() {
    this.$el.html(this.templates.banner());
  }
});

