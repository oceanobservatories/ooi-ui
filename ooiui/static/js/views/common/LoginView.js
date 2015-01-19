"use strict";
/*
 * ooiui/static/js/views/common/LoginView.js
 * Model definitions for Arrays
 *
 * Dependencies
 * Partials
 * - ooiui/static/js/partials/LoginForm.html
 * Libs
 * - ooiui/static/lib/underscore/underscore.js
 * - ooiui/static/lib/backbone/backbone.js
 * - ooiui/static/js/ooi.js
 * Usage
 */


var LoginView = Backbone.View.extend({
  events: {
    'click #btnLogin' : "login",
    'keyup #passInput' : "keyUp",
    'hidden.bs.modal' : 'hidden'
  },
  initialize: function(params) {
    if(!params) {
      params = {}
    }
    /* Gives us the ability to specify successful behavior after logging in */
    /* bind this.success = params.success */
    if(typeof params.success === "function") {
      this.success = params.success.bind("this");
    }
    if(typeof params.failure === "function") {
      console.log("failure defined");
      this.failure = params.failure.bind("this");
    }
    _.bindAll(this, "render", "login", "show", "hide");
    // We want to look at the cookies for the token
    this.model.fetch();
    if(this.model.get('token') == "") {
      // Need to prompt for login since we don't have a current token
      this.render();
    } else {
      this.success();
    }
    this.attempts = 0; // Keep track of attempts
    this.isHidden = false; // Initially keep retrying
  },
  login: function(e) {
    var self = this;
    e.preventDefault();
    var data = {
      login: $('#usrInput').val(),
      password: $('#passInput').val()
    };
    this.model.save(data, {
      success: function(model, response) {
        var tokenString = model.get("login") + ":" + response.token;
        $.cookie("ooiusertoken", tokenString);
        self.model.fetch();
        self.hide();
        self.success();
      },
      error: function(model, response) {
        self.attempts++; // Increment the attempts
        self.hide();
        self.failure();
      }
    });
  },
  hidden: function(e) {
    console.log(this.isHidden);
    if(!OOI.LoggedIn() && !this.isHidden) {
      this.show();
    }
  },
  /* Called when the user is successfully authenticated */
  success: function() {
    console.log("Success");
  },
  failure: function() {
  },
  show: function() {
    if(this.attempts == 1) {
      this.$el.find('.lgn-message').html('Username or Password are incorrect');
    }
    $('#loginModal').modal('show');
    return this;
  },
  hide: function() {
    this.isHidden = true;
    $('#loginModal').modal('hide');
    return this;
  },
  keyUp: function(e) {
    if($(e.target).val() == '') {
       //If there is no text within the input then disable the button
       this.$el.find('.enableOnInput').prop('disabled', true);
     } else {
       //If there is text in the input, then enable the button
       this.$el.find('.enableOnInput').prop('disabled', false);
     }
  },
  template: JST["ooiui/static/js/partials/loginForm.html"],
  render: function() {
    this.$el.html(this.template({}));
  }
});

