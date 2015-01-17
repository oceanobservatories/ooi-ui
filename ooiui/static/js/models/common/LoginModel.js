"use strict";

/*
 * header goes here"
 */

var LoginModel = Backbone.Model.extend({
  url: '/api/login',
  fetch: function() {
    var tokenString = $.cookie('ooiusertoken');
    if(typeof tokenString !== "undefined") {
      var login = tokenString.split(":")[0];
      var token = tokenString.split(":")[1];
      this.set("login", login);
      this.set("token", token);
      console.log("Set token");
    }
  },
  defaults: {
    login: "",
    password: "",
    token: ""
  }
});



