"use strict";

/*
 * header goes here"
 */

var LoginModel = Backbone.Model.extend({
  url: '/api/login',
  logIn: function() {
    var self = this;
    this.save(null, {
      async: false,
      success: function(model, response, options) {
        var date = new Date();
        date.setTime(date.getTime() + (model.get('expiration') * 1000));
        $.cookie('ooiusertoken', model.get('token'), {expires: date});
        ooi.trigger('login:success');
      },
      error: function(model, response, options) {
        console.error("ERROR");
        self.set({
          password: "",
          token: "",
          attempts: self.get('attempts') + 1
        });
        ooi.trigger('login:failure');
      }
    });
    return this;
  },
  loggedIn: function() {
    if(this.get('token') != '') {
      return true;
    }
    return false;
  },
  logOut: function() {
    $.removeCookie('ooiusertoken', { path: '/' });
    this.set(this.defaults);
    ooi.trigger('login:logout');
  },
  fetch: function() {
    var tokenString = $.cookie('ooiusertoken');
    if(typeof tokenString !== "undefined") {
      this.set("token", tokenString);
    }
    return this;
  },
  parse: function(response) {
    var expiration = response.expiration;
    return {
      login: this.get('login'),
      token: response.token,
      expiration: parseInt(response.expiration),
      password: "",
      attempts: 0 // on success reset attempts, we're logged in
    }
  },
  defaults: {
    login: "",
    password: "",
    token: "",
    expiration: "",
    attempts: 0
  }
});
