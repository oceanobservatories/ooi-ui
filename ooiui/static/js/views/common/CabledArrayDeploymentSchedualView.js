"use strict";


var CabledArrayDeploymentSchedualView = Backbone.View.extend({

  initialize: function() {
    _.bindAll(this, "render");
    var self = this;
    self.render();
  },
  template: JST['ooiui/static/js/partials/CabledArrayDeploymentSchedual.html'],
  render: function() {
    this.$el.html(this.template());
  } 
});
