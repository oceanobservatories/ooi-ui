"use strict";


var SouthernOceanView = Backbone.View.extend({

  initialize: function() {
    _.bindAll(this, "render");
    var self = this;
    self.render();
  },
  template: JST['ooiui/static/js/partials/SouthernOcean.html'],
  render: function() {
    this.$el.html(this.template());
  } 
});
