"use strict";


var SouthernOceanDetailedInfrastructureTablesView = Backbone.View.extend({

  initialize: function() {
    _.bindAll(this, "render");
    var self = this;
    self.render();
  },
  template: JST['ooiui/static/js/partials/landing/southern_ocean/SouthernOceanDetailedInfrastructureTables.html'],
  render: function() {
    this.$el.html(this.template());
  } 
});
