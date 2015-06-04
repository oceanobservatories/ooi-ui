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
      model: self.model,
    });
    $('body').append(loginview.el);
    loginview.isHidden = true; // allow the dialog to be hidden
    loginview.show();
  },
  logout: function() {
    this.model.logOut();
    window.location.replace("/");
  },
  initialize: function() {
    var self = this;
    _.bindAll(this, "render", "login", "logout");
    if(this.model.loggedIn()) {
      this.userModel = new UserModel();
      this.userModel.fetch({
        url: '/api/current_user',
        success: function() {
          self.renderLoggedIn();
        },
        error: function() {
          self.renderLoggedOut();
        }
      });
    } else {
      this.renderLoggedOut();
    }
  },
  template: {
    loggedIn: JST['ooiui/static/js/partials/DropdownUserLoggedIn.html'],
    loggedOut: JST['ooiui/static/js/partials/DropdownUserLoggedOut.html']
  },
  renderLoggedIn: function() {
    this.$el.html(this.template.loggedIn({user: this.userModel}));
  },
  renderLoggedOut: function() {
      this.$el.html(this.template.loggedOut());
  }
});
