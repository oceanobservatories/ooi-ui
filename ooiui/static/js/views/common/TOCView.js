"use strict";
/*
 * ooiui/static/js/views/common/TOCView.js
 * View definitions to build the table of contents
 *
 * Dependencies
 * Libs
 * - ooiui/static/lib/underscore/underscore.js
 * - ooiui/static/lib/backbone/backbone.js
 * - ooiui/static/js/ooi/RelationalModel.js
 * Usage
 *  var arrays = new ArrayCollection();
 *  var tocView = new TOCView({
 *      collection: arrays
 *  })
 */

/*
 * The TOCView acts as a ul tag with .nav .sidebar-nav .navbar-collapse
 * the first child is a search box, which is currently not hooked up to event
 * handling. The other children are the TOCItemView of each model in the
 * collection passed in. The collection is fetched on initialization.
 */
var TOCView = Backbone.View.extend({
  tagName: 'ul',
  className: 'nav sidebar-nav navbar-collapse',
  initialize: function() {
    _.bindAll(this, "render", "addItem");
    var self = this;
    this.collection.fetch({success: function(collection, response, options) {
      self.render();
    }});
  },
  template: JST['ooiui/static/js/partials/TOC.html'],
  addItem: function(view) {
    this.$el.append(view.el);
  },
  render: function() {
    var self = this;
    
    this.$el.html(this.template());
    this.collection.each(function(item) { 
      var itemView = new TOCItemView({model: item, level: 1});
      self.addItem(itemView);
    });
  }
});

var TOCItemView = Backbone.View.extend({
  tagName: 'li',
  events: {
    'click a' : 'toggle'
  },
  initialize: function(options) {
    if(options && options.level) {
      this.level = options.level;
    } else { 
      this.level = 1;
    }
    this.render();
  },
  template: JST['ooiui/static/js/partials/TOCItem.html'],
  getSubItems: function() {
    if(this.model && this.model.relation && this.model.relation.type == OOI.Relation.hasMany) {
      var collection = this.model[this.model.relation.key];
      var subItemView = new TOCSubItemView({
        collection: collection,
        level: (this.level + 1)
      });
      this.subItemView = subItemView;
      this.$el.append(this.subItemView.el);
    }
  },
  toggle: function(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    this.$el.children('ul').toggle('collapse');
    // Next level
    if(_.isUndefined(this.subItemView)) {
      this.getSubItems();
    }
  },
  render: function() {
    this.$el.html(this.template({data: this.model.toJSON()}));
  }
});

var TOCSubItemView = TOCView.extend({
  className: 'nav',
  initialize: function(options) {
    _.bindAll(this, "render", "addItem");
    if(options && options.level) {
      this.level = options.level;
    } else {
      this.level = 2;
    }
    if(this.level == 2) {
      this.$el.addClass('sidebar-nav-second-level');
    } else {
      this.$el.addClass('sidebar-nav-third-level');
    }
    var self = this;
    this.collection.fetch({success: function(collection, response, options) {
      self.render();
    }});
  },
  render: function() {
    var self = this;
    this.$el.empty();
    this.collection.each(function(item) { 
      var itemView = new TOCItemView({model: item, level: self.level});
      self.addItem(itemView);
    });
  }
});

