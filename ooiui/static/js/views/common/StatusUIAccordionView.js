"use strict";

var StatusUIAccordionView = Backbone.View.extend({
  initialize: function() {
    var self = this;
    _.bindAll(this, "render");
    this.render();
  },
  
  template: JST['ooiui/static/js/partials/StatusUIAccordion.html'],
  render: function() {
    var self = this;
    this.$el.html(this.template({model:this.model}));
  }
});

