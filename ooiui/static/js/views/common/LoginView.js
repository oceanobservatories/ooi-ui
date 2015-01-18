"use strict";


var LoginView = Backbone.View.extend({
  events: {
    'click #btnLogin' : "login",
    'keyup #passInput' : "keyUp"
  },
  initialize: function(params) {
    /* Gives us the ability to specify successful behavior after logging in */
    /* bind this.success = params.success */
    if(typeof params.success === "function") {
      this.success = params.success.bind("this");
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
        self.hide();
        self.failure();
      }
    });
  },
  /* Called when the user is successfully authenticated */
  success: function() {
    console.log("Success");
  },
  failure: function() {
    this.$el.html(JST['ooiui/static/js/partials/Alert.html']({
      type: "danger",
      title: "Error",
      message: "Invalid Username or Password"
    }));
  },
  show: function() {
    $('#loginModal').modal('show');
    return this;
  },
  hide: function() {
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

