"use strict";


var TroubleTicketView = Backbone.View.extend({

  initialize: function() {
    _.bindAll(this, "render");
    console.log("binded");
    this.render();
  },
  template: JST['ooiui/static/js/partials/TroubleTicket.html'],

  render: function() {
    console.log('helo');
    this.$el.html(this.template());
  }
});
