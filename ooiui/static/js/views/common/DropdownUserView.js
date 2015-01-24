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
      model: self.model,
    });
    $('body').append(loginview.el);
    loginview.isHidden = true; // allow the dialog to be hidden
    loginview.show();
  },
  logout: function() {
    this.model.logOut();
  },
  initialize: function() {
    _.bindAll(this, "render", "login", "logout");
    this.model.on('change', this.render);
    this.model.fetch();
    // The model won't actually update anything if we're not logged in, so
    // we'll have to call render manually.
    if(this.model.get('token')=='') {
      this.render();
    }
  },
  template: {
    loggedIn: JST['ooiui/static/js/partials/DropdownUserLoggedIn.html'],
    loggedOut: JST['ooiui/static/js/partials/DropdownUserLoggedOut.html']
  },
  render: function() {
    console.log("DropdownUserView render");
    if(this.model.loggedIn()) {
      this.$el.html(this.template.loggedIn());
    } else {
      this.$el.html(this.template.loggedOut());
    }
  }
});


