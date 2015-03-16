"use strict";


var StatusUIIconView = Backbone.View.extend({

  initialize: function() {
    _.bindAll(this, "render");
    var self = this;
    self.render();
  },
  template: JST['ooiui/static/js/partials/StatusUIIcon.html'],
  render: function() {
    // this.$el.find('#asset');
  } 
});
