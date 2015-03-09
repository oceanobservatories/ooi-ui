"use strict";


var SouthernOceanDetailedInfrastructureTablesView = Backbone.View.extend({

  initialize: function() {
    _.bindAll(this, "render");
    var self = this;
    self.render();
  },
  template: JST['ooiui/static/js/partials/SouthernOceanDetailedInfrastructureTables.html'],
  render: function() {
    this.$el.html(this.template());
  } 
});
