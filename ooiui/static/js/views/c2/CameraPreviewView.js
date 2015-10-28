"use strict";
/*
 * ooiui/static/js/views/c2/CameraPreviewView.js
 */

var CameraPreviewView = Backbone.View.extend({
  bindings: {
  },
  events: {
    
  },
  initialize: function(options) {
    _.bindAll(this, "render");
    this.initialRender();
  },
  initialRender:function(){
    this.$el.html('<i class="fa fa-spinner fa-spin" style="margin-top:50px;margin-left:50%;font-size:90px;color:#337ab7;"> </i>');
  },
  template: JST['ooiui/static/js/partials/CameraPreview.html'],
  render:function(options){
    var self = this;
    this.$el.html(this.template());
  }
});




var CameraControlsView = Backbone.View.extend({
  bindings: {
  },
  events: {
    
  },
  initialize: function(options) {
    _.bindAll(this, "render");
    this.initialRender();
  },
  initialRender:function(){
    this.$el.html('<i class="fa fa-spinner fa-spin" style="margin-top:50px;margin-left:50%;font-size:90px;color:#337ab7;"> </i>');
  },
  template: JST['ooiui/static/js/partials/CameraControls.html'],
  render:function(options){
    var self = this;
    this.$el.html(this.template());
  }
});