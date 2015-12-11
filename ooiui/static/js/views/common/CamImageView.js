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
  },
  initialize: function() {
    _.bindAll(this, "render");
    this.render();
  },
  template: JST['ooiui/static/js/partials/CamImageItem.html'],
  render: function(options) {
    this.$el.html(this.template({model:this.model}));
  }
});
