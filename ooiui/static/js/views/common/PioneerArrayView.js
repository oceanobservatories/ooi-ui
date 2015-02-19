"use strict";


var PioneerArrayView = Backbone.View.extend({

  initialize: function(options) {
    _.bindAll(this, "render");
    this.render();


  },
  template: JST['ooiui/static/js/partials/PioneerArray.html'],
  render: function() {
    this.$el.html(this.template());
  } 
});
