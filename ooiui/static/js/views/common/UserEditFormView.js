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
    'click #submitButton' : 'submit',
    'click #closeButton' : 'close'
  },
  initialize: function() {
    var self = this;
    var userScopes = [];
    _.bindAll(this, "render", "submit");
    this.modalDialog = new ModalDialogView();
    this.scopes = new UserScopeCollection();
    this.scopes.fetch({
      success: function(collection, response, options) {
        userScopes = self.render();
      }
    });
  },
  close: function(e) {
    window.location = "/users/"
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
            if(userScopes.includes('user_admin')){
              window.location = "/users/";
            } else {
              window.location = "/user/edit/" + model.id;
            }
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
    var userModel = new UserModel();
    userModel.url = '/api/current_user';

    userModel.fetch({
      success: function(collection, response, options) {
        var scopes = response.scopes;
        self.userScopes = scopes;

        if(scopes.includes('user_admin')){
          $("#scope_div").show();
          $("#active_div").show();
        } else {
          $("#scope_div").hide();
          $("#active_div").hide();
        }
      },
      error:function(collection, response, options) {
        console.log('Error getting user data');
      }
    });

    this.$el.append(this.modalDialog.el);
    this.stickit();
  }
});
