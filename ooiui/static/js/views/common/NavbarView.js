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
    'click #menu-toggle' : "menuToggle",
    'keyup #navSearch' : "keyPressEventHandler"
  },
  keyPressEventHandler : function(e){
    e.preventDefault(); // Prevent the #about
    if(e.keyCode == 13){
      this.navSearch(e.currentTarget.value);
    }
  },
  menuToggle: function(e) {
    e.preventDefault(); // Prevent the #about
    this.sidebarToggle();
  },
  navSearch: function(val) {
    var searchTerms = val;
    var win = window.open(location.protocol + "//" + location.host + "/data_access/?search=" + searchTerms, '_blank');
  },
  initialize: function(options) {
    _.bindAll(this, "render", "sidebarToggle", "navSearch");
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

    $('#wrapper').toggleClass('toggled');
    $('#page-controls').toggleClass('toggled');
    $('#tocFilterControls').toggleClass('toggled');
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
    this.$el.html(this.templates.navbar({user:null}));
    var pageURI = this.el.baseURI;
    if(pageURI.indexOf("streamingdata") > -1 || pageURI.indexOf("c2") > -1 || pageURI.indexOf("alerts") > -1 || pageURI.indexOf("dataadmin") > -1 || pageURI.indexOf("opLog") > -1){
      this.$el.find('#navbar-menus').prepend(this.templates.sidebar_toggle());
    }
    // Messages only appear to logged in users
    if(ooi.login.loggedIn()){
      //Here we will get the user so that we can access the scope and only show items they can access.
      var userModel = new UserModel();
      var self = this;
      userModel.fetch({
        url: '/api/current_user',
        success: function() {
          self.$el.find('#dropdownMenu1').toggle();
          self.$el.find('#dropdownMenuAM').toggle();
          self.$el.find('#navbar-menus').append(self.templates.logged_in_nav_items({user:userModel}));
        },
        error: function() {
          self.$el.find('#navbar-menus').append(self.templates.logged_in_nav_items({user:null}));
        }
      });
      this.$el.find('#current').hide();
      this.$el.find('#world-map').hide();
      //this.$el.find('#navbar-menus').append(this.messageView.el);
    }
    this.$el.find('#navbar-menus-right').append(this.dropdownUserView.el);

    if (!_.isUndefined(ooi.views.banner) && ooi.views.banner.checkStreaming()){
      this.$el.find('.navbar.navbar-fixed-top').addClass('news-active');
    }
  }
});
