"use strict";
/*
* ooiui/static/js/views/common/newEventView.js
* Model definitions for Arrays
*
* Dependencies
* Partials
* - ooiui/static/js/partials/newEventForm.html
* Libs
* - ooiui/static/lib/underscore/underscore.js
* - ooiui/static/lib/backbone/backbone.js
* - ooiui/static/js/ooi.js
* Usage
*/


var NewEvent = Backbone.View.extend({
  events: {
    'click #btnNewEvent' : "newEvent",
    'keyup #passInput' : "keyUp",
    'keypress #passInput' : 'keyPress',
    'hidden.bs.modal' : 'hidden'
  },
  initialize: function(params) {
    _.bindAll(this, "render", "newEvent", "show", "hide", "keyPress");
    if(!params) {
      params = {}
    }
    /* Gives us the ability to specify successful behavior after logging in */
    /* bind this.success = params.success */
    if(typeof params.success === "function") {
      this.success = params.success.bind(this);
    }
    if(typeof params.failure === "function") {
      console.log("failure defined");
      this.failure = params.failure.bind(this);
    }
    if(typeof params.hidden === "function") {
      console.log("hidden defined");
      this.hidden = params.hidden.bind(this);
    }
    // We want to look at the cookies for the token
    this.model.fetch();
    if(this.model.get('token') == "") {
      // Need to prompt for newEvent since we don't have a current token
      this.render();
    } else {
      this.success();
    }
    this.attempts = 0; // Keep track of attempts
    this.isHidden = false; // Initially keep retrying
  },
  newEvent: function(e) {
    var self = this;
    e.preventDefault();
    this.model.set({
      newEvent: $('#NewEventInput').val(),
      password: $('#passInput').val()
    });

    this.model.newEvent();
    console.log(this);
    // If newEvent was successful and we have a token
    if(this.model.get('token') != '') {
      console.log("success");
      this.hide();
      this.success();
    } else {
      console.log("no bueno amigo");
      this.attempts++;
      this.$el.find('.lgn-message').html('Username or Password are incorrect');
      this.failure();
    }
  },
  hidden: function(e) {
    console.log("hidden");
  },
  /* Called when the user is successfully authenticated */
  success: function() {
    console.log("Success");
  },
  failure: function() {
    console.log("this failure");
  },
  show: function() {
    if(this.attempts >= 1) {
      this.$el.find('.newEvent-message').html('John Doe');
    }
    $('#newEventModal').modal('show');
    return this;
  },
  hide: function() {
    console.log("hide was called");
    this.isHidden = true;
    $('#newEventModal').modal('hide');
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
  keyPress: function(e) {
    if(e.which == 13) {
      console.log(this);
      this.newEvent(e);
    }
  },
  template: JST["ooiui/static/js/partials/newEvent.html"],
  render: function() {
    this.$el.html(this.template({}));
  }
});
