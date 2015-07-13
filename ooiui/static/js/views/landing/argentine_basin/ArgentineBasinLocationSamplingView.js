"use strict";


var ArgentineBasinLocationSamplingView = Backbone.View.extend({

  initialize: function() {
    _.bindAll(this, "render");
    var self = this;
    self.render();
  },
  template: JST['ooiui/static/js/partials/landing/argentine_basin/ArgentineBasinLocationSampling.html'],
  render: function() {
    this.$el.html(this.template());
  } 
});
