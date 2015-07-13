"use strict";


var StationPapaDetailedInfrastructureTablesView = Backbone.View.extend({

  initialize: function() {
    _.bindAll(this, "render");
    var self = this;
    self.render();
  },
  template: JST['ooiui/static/js/partials/landing/station_papa/StationPapaDetailedInfrastructureTables.html'],
  render: function() {
    this.$el.html(this.template());
  } 
});
