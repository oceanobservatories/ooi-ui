"use strict";
/*
 * ooiui/static/js/views/common/CamImageView.js
 *
 * Dependencies
 * - slick
 * Partials
 * -
 * Libs
 * - ooiui/static/lib/underscore/underscore.js
 * - ooiui/static/lib/backbone/backbone.js
 * Usage
 */

var CamImageView = Backbone.View.extend({
  className: 'cam-image-list',
  events: {

  },
  initialize: function() {
    _.bindAll(this, "render");
  },
  template: _.template('<div id="camImageGallery"> </div>'),
  add:function(subview){
    this.$el.find('#camImageGallery').append(subview.el);
  },
  render: function(options) {
    var self = this;
    this.$el.html(this.template(options));

    this.collection.each(function(model) {
      var subview = new CamImageItemView({
        model: model
      });
      self.add(subview);
    });

    this.$el.find('#camImageGallery').slick({
      infinite: true,
      lazyLoad: 'ondemand',
      speed: 500,
      slidesToShow: 5,
      slidesToScroll: 5
    });

  }
});

var CamImageItemView = Backbone.View.extend({
  className: 'cam-image-item',
  events: {
    "click a" : "itemClick"
  },
  initialize: function() {
    _.bindAll(this, "render","itemClick");
    this.render();
  },
  itemClick:function(evt){
    var self = this;
    evt.preventDefault();
    if (!_.isUndefined(self.model.get('url'))){
      var text = "<small>"+moment().utc(self.model.get("datetime")).format('YYYY-MM-DD')+"</small>"
      bootbox.dialog({
        title: "<h5>"+self.model.get("reference_designator")+"</h5>"+text,
        size:'large',
        message: "<a class='download-full-image' href='"+ self.model.get('url') +"' download='" + self.model.get('filename') +"' title='"+moment().utc(self.model.get("datetime")).format('YYYY-MM-DD')+"'><img height='100%' width='100%' src='" + self.model.get('url') + "'></a>",
        buttons: {
          success: {
            label: "Download Image",
            className: "btn-success",
            callback: function() {
              $(this).find('.download-full-image img').click();
              }
            },
          main: {
            label: "Close",
            className: "btn-default",
            callback: function() {
              //nothing and close
              }
            }
          }
      });
    }
  },
  template: JST['ooiui/static/js/partials/CamImageItem.html'],
  render: function(options) {
    this.$el.html(this.template({model:this.model}));
  }
});
