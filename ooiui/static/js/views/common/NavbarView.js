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
    ooi.trigger('NavbarView:sidebarToggle');

    //Remove event listener on menu toggle.
    var sidebar = $("#sidebar-wrapper").children().length;
    if (sidebar == 0) {
        this.undelegateEvents();
    }
    },
  templates: {
    navbar: JST['ooiui/static/js/partials/Navbar.html'],
    sidebar_toggle: JST['ooiui/static/js/partials/MenuToggle.html'],
    logged_in_nav_items: JST['ooiui/static/js/partials/LoggedInNavItems.html']
  },
  render: function() {
    this.$el.html(this.templates.navbar());
    this.$el.find('#navbar-menus').prepend(this.templates.sidebar_toggle());
    // Messages only appear to logged in users
    if(ooi.login.loggedIn()) {
        this.$el.find('#navbar-menus').append(this.templates.logged_in_nav_items());
        this.$el.find('#current').hide();
        this.$el.find('#world-map').hide();
        //this.$el.find('#navbar-menus').append(this.messageView.el);
    }
    this.$el.find('#navbar-menus-right').append(this.dropdownUserView.el);
  }
});
