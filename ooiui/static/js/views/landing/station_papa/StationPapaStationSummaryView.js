"use strict";


var StationPapaStationSummaryView = Backbone.View.extend({

  initialize: function() {
    _.bindAll(this, "render");
    var self = this;
    self.render();
  },
  template: JST['ooiui/static/js/partials/landing/station_papa/StationPapaStationSummary.html'],
  render: function() {
    this.$el.html(this.template());
  } 
});
