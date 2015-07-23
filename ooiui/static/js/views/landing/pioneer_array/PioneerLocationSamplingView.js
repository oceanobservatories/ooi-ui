"use strict";


var PioneerLocationSamplingView = Backbone.View.extend({

  initialize: function() {
    _.bindAll(this, "render");
    var self = this;
    self.render();
  },
  template: JST['ooiui/static/js/partials/landing/pioneer_array/PioneerLocationSampling.html'],
  render: function() {
    this.$el.html(this.template());
  } 
});
