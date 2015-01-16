"use strict";

/*
 * header goes here"
 */

var LoginModel = Backbone.Model.extend({
  url: '/api/login',
  defaults: {
    login: "",
    password: ""
  }
});



