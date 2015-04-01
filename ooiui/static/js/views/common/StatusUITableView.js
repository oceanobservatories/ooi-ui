"use strict";


var StatusUITableView = Backbone.View.extend({
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
