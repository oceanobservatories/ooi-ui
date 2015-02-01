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
  events: {
    'click #menu-toggle' : "menuToggle"
  },
  menuToggle: function(e) { 
    e.preventDefault(); // Prevent the #about
    this.sidebarToggle();
  },
  initialize: function(options) {
    _.bindAll(this, "render", "sidebarToggle");
    if(ooi.login.loggedIn()) {
      this.messageView = new DropdownMessagesView({
        collection: new MessageCollection()
      });
    }
    this.dropdownUserView = new DropdownUserView({
      model: ooi.login
    });
    this.render();
  },
  sidebarToggle: function() {
    $("#wrapper").toggleClass("toggled");
    if($('#collapse-button').hasClass('fa-caret-left')) {
      $('#collapse-button').removeClass('fa-caret-left');
      $('#collapse-button').addClass('fa-caret-right');
    } else {
      $('#collapse-button').removeClass('fa-caret-right');
      $('#collapse-button').addClass('fa-caret-left');
    }
  },
  template: JST['ooiui/static/js/partials/Navbar.html'],
  render: function() {
    this.$el.html(this.template());
    if(ooi.login.loggedIn()) {
      this.$el.find('#navbar-right').prepend(this.messageView.el);
    }
    this.$el.find('#navbar-right').append(this.dropdownUserView.el);
  }
});





