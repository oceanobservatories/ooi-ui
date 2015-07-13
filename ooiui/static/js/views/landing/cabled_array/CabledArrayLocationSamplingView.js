"use strict";


var CabledArrayLocationSamplingView = Backbone.View.extend({

  initialize: function() {
    _.bindAll(this, "render");
    var self = this;
    self.render();
  },
  template: JST['ooiui/static/js/partials/landing/cabled_array/CabledArrayLocationSampling.html'],
  render: function() {
    this.$el.html(this.template());
  } 
});
