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
    '#username' : 'user_name',
    '#first_name' : 'first_name',
    '#last_name' : 'last_name',
    '#primary_phone' : 'phone_primary',
    '#secondary_phone' : 'phone_alternate',
    '#email' : 'email',
    '#organization' : 'organization',
    '#active' : 'active',
    '#email_opt_in' : 'email_opt_in',
    '.scope_selection' : 'scopes'
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

    //Grey out portions that the user should not be able to edit.
    //Grey out the scope selection boxes.
    var user_scopes = this.model.get('scopes');
    for(var i = 0; i < user_scopes.length; i++){    
        var userScopeName = user_scopes[i]
        for(var j = 0; j < this.scopes.models.length; j++){
            if(userScopeName == this.scopes.models[j].get('scope_name')){
                //Here we know that the user has the required scope, so we will make sure it is not greyed out.
               this.$el.find('input.scope_selection').removeAttr('disabled', 'false');
            }
        };
    }
    //Grey out the username and admin role inputs
    var userHasAdmin = false;
    for(var i = 0; i < user_scopes.length; i++){
        console.log(user_scopes[i])
        if(user_scopes[i] == "user_admin"){
            userHasAdmin = true;
        }
    }i
    if(userHasAdmin == false){
        console.log('false');
        this.$el.find('input#account_enabled').attr('disabled', 'disabled');
        this.$el.find('input#username').attr('disabled', 'disabled');
    }


    this.model.attributes.scopes
    this.$el.append(this.modalDialog.el);
    this.stickit();
  }
});


