"use strict";
/*
 * ooiui/static/js/models/common/NavbarView.js
 * View definitions to build the navbar
 *
 * Dependencies
 * Libs
 * - ooiui/static/lib/underscore/underscore.js
 * - ooiui/static/lib/backbone/backbone.js
 * - ooiui/static/js/ooi.js
 * Usage
 */

var NavbarView = Backbone.View.extend({
  initialize: function() {
    _.bindAll(this, "render");
    this.messageView = new DropdownMessagesView({
      collection: new MessageCollection()
    });
    this.dropdownUserView = new DropdownUserView();
    this.render();
  },
  template: JST['ooiui/static/js/partials/Navbar.html'],
  render: function() {
    this.$el.html(this.template());
    this.$el.find('#navbar-right').prepend(this.messageView.el);
    this.$el.find('#navbar-right').append(this.dropdownUserView.el);
  }
});





