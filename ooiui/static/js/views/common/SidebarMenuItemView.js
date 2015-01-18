"use strict";
/*
 * ooiui/static/js/views/common/SidebarMenuItemView.js
 * SidebarMenuItemView
 *
 * Dependencies
 * Partials
 * - ooiui/static/js/partials/SidebarItem.html
 * Libs
 * - ooiui/static/lib/underscore/underscore.js
 * - ooiui/static/lib/backbone/backbone.js
 * Usage
 *
 */

var SidebarMenuItem = Backbone.View.extend({
  tagName: 'li',
  events: {
    'click' : 'toggle'
  },
  initialize: function() {
    this.render();
  },
  template: JST['ooiui/static/js/partials/SidebarItem.html'],
  toggle: function(e) {
    e.preventDefault();
    console.log('ugh');
    console.log(this.$el.find('.nav').first());
    this.$el.find('.nav').first().toggle('collapse');
    this.$el.find('.nav').first().toggleClass('collapse');
  },
  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    // collapse all da children
    this.$el.find('.nav').first().toggleClass('collapse');
  }
});

