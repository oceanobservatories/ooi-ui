"use strict";
/*
 * ooiui/static/js/views/aa/StatusAlertIconView.js
 */

var StatusAlertIconView = Backbone.View.extend({
  subviews:[],
  bindings: {
  },
  events: {    
  },
  initialize: function() {
    _.bindAll(this, "render");    
  },
  initialRender:function(){
    this.$el.html('<i class="fa fa-spinner fa-spin" style="margin-top:50px;margin-left:50%;font-size:90px;color:#337ab7;"> </i>');
  },
  template: JST['ooiui/static/js/partials/StatusAlertIconContainer.html'],
  add: function(model){    
    var subview = new StatusAlertIconItemView({
      model: model
    });
    this.subviews.push(subview);
    this.$el.find('.icon-list-container').append(subview.el);
  },
  render:function(options){
    var self = this;
    this.$el.html(this.template());    

    this.collection.each(function(model){
      self.add(model);
    });

  }     
});


var StatusAlertIconItemView = Backbone.View.extend({
  bindings: {
  },
  events: {    
  },
  initialize: function() {
    _.bindAll(this, "render");    
    this.render();
  },
  initialRender:function(){
    this.$el.html('<i class="fa fa-spinner fa-spin" style="margin-top:5px;margin-left:50%;font-size:10px;color:#337ab7;"> </i>');
  },
  template: JST['ooiui/static/js/partials/StatusAlertIconItem.html'],
  render:function(options){
    var self = this;   
    this.$el.html(this.template({model:self.model}));

    /*
    $('.platform-tile<%= asset %>').popover({
        trigger: "click",
        placement: "auto",
        html:true,
        content: function() {
            return $('#tilepopovercontent<%= asset %>').html();
        },
        title: function() {
            return $('#tilepopovertitle<%= asset %>').html();
        }
    });   
    */

  }     
});
