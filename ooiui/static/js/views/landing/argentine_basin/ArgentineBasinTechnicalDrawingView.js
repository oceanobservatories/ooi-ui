"use strict";


var ArgentineBasinTechnicalDrawingView = Backbone.View.extend({

  initialize: function() {
    _.bindAll(this, "render");
    var self = this;
    self.render();
  },
  template: JST['ooiui/static/js/partials/landing/argentine_basin/ArgentineBasinTechnicalDrawing.html'],
  render: function() {
    this.$el.html(this.template());
  } 
});
