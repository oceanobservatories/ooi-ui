"use strict";
/*
 * ooiui/static/js/views/common/DropdownUserView.js
 * View definitions to render a dropdown of user options
 *
 * Dependencies
 * Partials
 * - ooiui/static/js/partials/compiled/dropdown.js
 * Libs
 * - ooiui/static/lib/underscore/underscore.js
 * - ooiui/static/lib/backbone/backbone.js
 * Usage
 *   var messageView = new DropdownMessagesView({
 *     collection: new MessageCollection()
 *   });
 *   $('#navbar-right').prepend(messageView.el);
 */

var DropdownUserView = Backbone.View.extend({
  tagName: 'li',
  className: 'dropdown',
  id: 'dropdownUser',
  events: {
    'click #login' : 'login',
    'click #logout' : 'logout'
  },
  login: function() {
    var self = this;
    var loginview = new LoginView({
      model: new LoginModel(),
      success: function() {
        self.render(); // re-render with new logged-in context
      }
    });
    $('body').append(loginview.el);
    loginview.show();
  },
  logout: function() {
    OOI.LogOut();
    this.render();
  },
  initialize: function() {
    _.bindAll(this, "render", "login", "logout");
    this.render();
  },
  template: {
    loggedIn: JST['ooiui/static/js/partials/DropdownUserLoggedIn.html'],
    loggedOut: JST['ooiui/static/js/partials/DropdownUserLoggedOut.html']
  },
  render: function() {
    if(!OOI.LoggedIn()) {
      this.$el.html(this.template.loggedOut());
    } else {
      this.$el.html(this.template.loggedIn());
    }
  }
});


