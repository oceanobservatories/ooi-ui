"use strict";


var StatusUIItemView = Backbone.View.extend({

  initialize: function() {
    var self = this;
    this.initialRender(); 
    _.bindAll(this, "render");
  },
    initialRender: function() {
    this.$el.html('<i class="fa fa-spinner fa-spin" style="margin-left:50%;font-size:90px;"> </i>');
  },
  template: JST['ooiui/static/js/partials/StatusUIItem.html'],
  render: function() {
    var self = this;
    this.$el.html(this.template({model:this.model}));
  }
});
