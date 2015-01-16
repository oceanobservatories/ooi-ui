"use strict";


var LoginView = Backbone.View.extend({
  el: $('#loginView'),
  events: {
    'click #btnLogin' : "login"
  },
  initialize: function() {
    console.log("Login View is initialized");
    _.bindAll(this, "render", "login");
    this.render();
  },
  login: function(e) {
    e.preventDefault();
    var data = {
      login: $('#usrInput').val(),
      password: $('#passInput').val()
    };
    this.model.save(data, {
      success: function(model, response) {
        window.location = "/signup"
      },
      error: function(model, response) {
        alert("Failed to login");
      }
    });
  },
  template: JST["ooiui/static/js/partials/loginForm.html"],
  render: function() {
    this.$el.html(this.template({}));
    $('#passInput').keyup(function(){
    if ($(this).val() == '') { //Check to see if there is any text entered
         //If there is no text within the input then disable the button
         $('.enableOnInput').prop('disabled', true);
       } else {
         //If there is text in the input, then enable the button
         $('.enableOnInput').prop('disabled', false);
       }
     });
  }
});

