"use strict";


var StationPapaTechnicalDrawingView = Backbone.View.extend({

  initialize: function() {
    _.bindAll(this, "render");
    var self = this;
    self.render();
  },
  template: JST['ooiui/static/js/partials/landing/station_papa/StationPapaTechnicalDrawing.html'],
  render: function() {
    this.$el.html(this.template());
  } 
});
