"use strict";
/*
 * ooiui/static/js/views/common/UserEditFormView.js
 * View definitions for User Editing
 *
 * Dependencies
 * Libs
 * - ooiui/static/lib/underscore/underscore.js
 * - ooiui/static/lib/backbone/backbone.js
 * - ooiui/static/js/ooi.js
 *
 * Usage
 */

var UserEditFormView = Backbone.View.extend({
  bindings: {
    '#first_name' : 'first_name',
    '#last_name' : 'last_name',
    '#phone_primary' : 'phone_primary',
    '#phone_alternate' : 'phone_alternate',
    '#email' : 'email',
    '#organization' : 'organization',
    '#active' : 'active',
    '#email_opt_in' : 'email_opt_in',
    '.scope_selection' : 'scopes',
    '#other_organization' : 'other_organization',
    '#vocation' : 'vocation',
    '#country' : 'country',
    '#state' : 'state'
  },
  events: {
   'click #submitButton' : 'submit'
  },
  initialize: function() {
    var self = this;
    _.bindAll(this, "render", "submit");
    this.modalDialog = new ModalDialogView();
    this.scopes = new UserScopeCollection();
    this.scopes.fetch({
      success: function(collection, response, options) {
        self.render();
      }
    });
  },
  submit: function(e) {
    var self = this;
    e.preventDefault();
    this.model.save(null, {
      success: function(model, response) {
        self.modalDialog.show({
          message: "User successfully updated",
          type: "success",
          ack: function() {
            window.location = "/"
          }
        });
      },
      error: function(model, response) {
        try {
          var errMessage = JSON.parse(response.responseText).error;
        } catch(err) {
          console.error(err);
          var errMessage = "Unable to submit user";
        }
        self.modalDialog.show({
          message: errMessage,
          type: "danger"
        });
        console.error(model);
        console.error(response.responseText);
      }
    });
  },
  template: JST['ooiui/static/js/partials/UserEditForm.html'],
  render: function() {
    this.$el.html(this.template({scopes: this.scopes}));
    // Only allow scope modification if
    if(this.model.attributes.scopes.includes('user_admin')){
      this.$el.find("#scope_div").show();
      this.$el.find("#active_div").show();
    } else {
      this.$el.find("#scope_div").hide();
      this.$el.find("#active_div").hide();
    }
    this.$el.append(this.modalDialog.el);
    this.stickit();
  }
});
