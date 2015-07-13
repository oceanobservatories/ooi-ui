"use strict";


var SouthernOceanDeploymentView = Backbone.View.extend({

  initialize: function() {
    _.bindAll(this, "render");
    var self = this;
    self.render();
  },
  template: JST['ooiui/static/js/partials/landing/southern_ocean/SouthernOceanDeployment.html'],
  render: function() {
    this.$el.html(this.template());
  } 
});
