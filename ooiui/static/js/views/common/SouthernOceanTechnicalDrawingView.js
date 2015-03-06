"use strict";


var SouthernOceanTechnicalDrawingView = Backbone.View.extend({

  initialize: function() {
    _.bindAll(this, "render");
    var self = this;
    self.render();
  },
  template: JST['ooiui/static/js/partials/SouthernOceanTechnicalDrawing.html'],
  render: function() {
    this.$el.html(this.template());
  } 
});
