"use strict"
var AssetTabelFooterView = Backbone.View.extend({
  initialize: function(options) {
    this.options = options;
    _.bindAll(this, "render");
    this.render();
  },
  
  templates: {
    footer: JST['ooiui/static/js/partials/AssetTabelFooter.html']
  },

  render: function() {
    this.$el.html(this.templates.footer());
  }
});

