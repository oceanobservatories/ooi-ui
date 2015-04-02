"use strict";

var StatusUIItemView = Backbone.View.extend({
  tagName: "div",
  className: "platform-tile",

  initialize: function() {
    var self = this;
    _.bindAll(this, "render");
  },
    
  template: JST['ooiui/static/js/partials/StatusUIItem.html'],
  render: function() {
    var self = this;
    this.$el.html(this.template({model:this.model}));
  }
});
