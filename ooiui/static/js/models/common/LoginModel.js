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
        // Set the cookie with both the path for the entire site and expire option
        $.cookie('ooiusertoken', model.get('token'), {path: '/', expires: date});
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
  //passwordReset: function() {
  //  var self = this;
  //  return true;
  //},
  checkValidEmail: function(email) {
    var output = false;
    $.ajax('/api/user/check_valid_email?email='+email, {
      type: 'GET',
      dataType: 'json',
      timeout: 5000,
      async: false,
      success: function (resp) {
        // console.log('Success getting check valid email');
        // console.log(resp);
        if(resp.email !== undefined && resp.email !== ""){
          output = true
        }
      },

      error: function( req, status, err ) {
        console.log(req);
      }
    });
    return output;
  },
  loggedIn: function() {
    // console.log('loggedIn check');
    // console.log(this);
    // console.log(this.get('token') !== '');
    if(this.get('token') !== '') {
      return true;
    }
    return false;
  },
  logOut: function() {
    // Set the cookie to null and expire for all paths since $.cookieDelete is broken on some browsers
    $.cookie('ooiusertoken', null, { expires: -1, path: '/' });
    this.set(this.defaults);
    ooi.trigger('login:logout');
  },
  fetch: function() {
    // console.log('performing a fetch and here is your cookie:');
    // console.log($.cookie('ooiusertoken'));
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
