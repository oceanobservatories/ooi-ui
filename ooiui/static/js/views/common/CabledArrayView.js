"use strict";

var CabledArrayView = Backbone.View.extend({

  initialize: function() {
    _.bindAll(this, "render");
    var self = this;
    self.render();
  },
  template: JST['ooiui/static/js/partials/CabledArray.html'],
  render: function() {
    this.$el.html(this.template());
  } 
});
