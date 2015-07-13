"use strict";


var PioneerDeploymentScheduleView = Backbone.View.extend({

  initialize: function() {
    _.bindAll(this, "render");
    var self = this;
    self.render();
  },
  template: JST['ooiui/static/js/partials/landing/pioneer_array/PioneerDeploymentSchedule.html'],
  render: function() {
    this.$el.html(this.template());
  } 
});
