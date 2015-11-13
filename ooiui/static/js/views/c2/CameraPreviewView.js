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
    if ('url' in options){
      this.url = options.url;
    }
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

    var conf = {
        key:       "0b4de3d21001075717cd59494ae84e5a",
        source: {
          hls:         this.url,
          poster:      'http://policy.oceanleadership.org/wp-content/uploads/OceanLeadershipLogo_NoTagline_CMYK.jpg'
        }
    };
    var player = bitdash("player").setup(conf);


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
