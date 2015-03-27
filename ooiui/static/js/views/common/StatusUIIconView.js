"use strict";


var StatusUIIconView = Backbone.View.extend({
  subviews : [],
  initialize: function() {
    _.bindAll(this, "render");
    this.initialRender();
    this.collection.fetch({reset: true});
    var self = this;
    this.listenTo(this.collection, 'reset',function(){
      console.log('listen to collection');
      console.log(this.collection);
      self.render();
    });
  },
    initialRender: function() {
    console.log("Plot should be a spinner");
    this.$el.html('<i class="fa fa-spinner fa-spin" style="margin-left:50%;font-size:90px;"> </i>');
  },
  add: function(subview) {
    subview.render();
    this.subviews.push(subview);
    this.$el.find('#alert-container').append(subview.el);
  },
  template: JST['ooiui/static/js/partials/StatusUIIcon.html'],
  render: function() {
    var self = this;
    this.$el.html(this.template());
    this.collection.each(function(model) { 
      var subview = new StatusUIItemView({
        model: model
      });
      self.add(subview);
    });
  }
})
