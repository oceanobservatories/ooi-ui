"use strict";
/*
* ooiui/static/js/models/common/UserModel.js
* Model definition for a user
*
* Dependencies
* Libs
* - ooiui/static/lib/underscore/underscore.js
* - ooiui/static/lib/backbone/backbone.js
* - ooiui/static/js/ooi.js
*
* Usage
* var user = new UserModel();
* user.fetch({async:false});
* if(user.user_name != "") {
*   ...
* }
*/

var UserModel = Backbone.Model.extend({
  urlRoot: '/api/user',
  getFullName: function() {
    return this.get('first_name') + ' ' + this.get('last_name');
  },
  defaults: {
    active: false,
    email: "",
    first_name: "",
    id: null,
    last_name: "",
    organization_id: 9,
    other_organization: null,
    phone_alternate: null,
    phone_primary: null,
    role: null,
    user_id: "",
    scopes: [],
    user_name: "",
    email_opt_in: true
  }
});

var UserCollection = Backbone.Collection.extend({
  url: '/api/user',
  model: UserModel,
  parse: function(response) {
    if(response) {
      return response.users;
    }
    return [];
  }
});

var CountryModel = Backbone.Model.extend({
  urlRoot: '/api/countries',
  defaults: {
  }
});

var CountryCollection = Backbone.Collection.extend({
  url: '/api/countries',
  model: CountryModel,
  parse: function(response) {
    if(response) {
      return response;
    }
    return [];
  }
});

var StateModel = Backbone.Model.extend({
  urlRoot: '/api/states/US',
  defaults: {
  }
});

var StateCollection = Backbone.Collection.extend({
  url: '/api/states/US',
  model: StateModel,
  parse: function(response) {
    if(response) {
      return response;
    }
    return [];
  }
});
