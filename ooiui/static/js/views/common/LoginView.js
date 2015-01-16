"use strict";


var LoginView = Backbone.View.extend({
  el: $('#loginView'),
  initialize: function() {
    console.log("Login View is initialized");
    _.bindAll(this, "render");
    this.render();
  },
  template: JST["ooiui/static/js/partials/loginForm.html"],
  render: function() {
    console.log("render this");
    console.log(this.model.toJSON());
    this.$el.html(this.template({}));
  }
});

