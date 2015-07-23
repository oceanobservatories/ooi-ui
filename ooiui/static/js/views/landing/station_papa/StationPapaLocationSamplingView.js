"use strict";


var StationPapaLocationSamplingView = Backbone.View.extend({

  initialize: function() {
    _.bindAll(this, "render");
    var self = this;
    self.render();
  },
  template: JST['ooiui/static/js/partials/landing/station_papa/StationPapaLocationSampling.html'],
  render: function() {
    this.$el.html(this.template());
  } 
});
