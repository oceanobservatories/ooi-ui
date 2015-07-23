"use strict";


var IrmingerSeaLocationSamplingView = Backbone.View.extend({

  initialize: function() {
    _.bindAll(this, "render");
    var self = this;
    self.render();
  },
  template: JST['ooiui/static/js/partials/landing/irminger_sea/IrmingerSeaLocationSampling.html'],
  render: function() {
    this.$el.html(this.template());
  } 
});
