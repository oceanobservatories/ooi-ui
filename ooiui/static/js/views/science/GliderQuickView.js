"use strict";
/*
 * ooiui/static/js/views/science/GliderQuickView.js
 * Glider Quick view - view glider tracks
 *
 * Dependencies
 * Partials
 * - ooiui/static/js/partials/GliderQuickView.html
 * Libs
 * - ooiui/static/lib/underscore/underscore.js
 * - ooiui/static/lib/backbone/backbone.js
 * Author
 *  ABird
 */

var GliderQuickParentView = Backbone.View.extend({
  className : "glider-quick-view-container",
  events: {
  },
  initialize: function() {
     _.bindAll(this, 'render', 'derender');
      this.$el.css({
          'opacity': 0,
          'transition': 'opacity .2s'
      });
  },
  render: function() {
        // if there isn't an underlying model, just render the template w/o it.
        if (this.model) {
            this.$el.html(this.template({model:this.model}));
        } else {
            this.$el.html(this.template());
        }
        this.$el.css({
            'opacity': 1
        });
        return this;
  },
  derender: function() {
        this.remove();
        this.unbind();
        if (this.model)
            this.model.off();
    }
});

//panel container
var GliderQuickBtnView = GliderQuickParentView.extend({
    gliderQuickView: null,
    events: {
        'click': 'click'
    },
    className: 'gliderBtnContainer',
    template: _.template('<button type="button"' +
                                 'class="btn"' +
                                 'data-toggle="modal"' +
                                 'data-target="#gliderStatus">Glider Quick View</button>'),
    click: function(e) {
        e.preventDefault();
        L.DomEvent.disableClickPropagation(this.el);
        //console.log(this.gliderQuickView);
        this.gliderQuickView = new GliderQuickView({collection: this.collection});
        // render out this entire view.
        this.gliderQuickView.render();
        this.gliderQuickView.renderEach();
    }
});

//panel container
var GliderQuickView = GliderQuickParentView.extend({
    className:"glider-quick-view-panel",
    events: {
        'click .btn-close': 'close',
        'click td': 'clickItem',
    },
    template: JST["ooiui/static/js/partials/GliderQuickView.html"],
    renderEach: function() {
      var self = this;
      self.collection.each(function(gliderModel) {
        if (gliderModel.get('track')){
          self.$el.find('.table-rows').append((new GliderQuickItemView({model:gliderModel})).render().el);
        }
      });
    },
    clickItem:function(e){
      //e.preventDefault();
      L.DomEvent.disableClickPropagation(this.el);
      L.DomEvent.stopPropagation(this.el);
    },
    close: function() {
        this.derender();
    },
    render: function() {
      var self = this;
      this.$el.html(this.template());
      this.$el.css({
            'opacity': 0.9
      });

      $('#map').append(this.el);
    }
});


var GliderQuickItemView = GliderQuickParentView.extend({
    /*  each stream is handled with this view.
     */
    tagName: 'tr',
    template: JST["ooiui/static/js/partials/GliderQuickItemView.html"]
});

