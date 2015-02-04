"use strict";
/*
* ooiui/static/js/models/common/UserScopeModel.js
* Model definition for a user scope
*
* Dependencies
* Libs
* - ooiui/static/lib/underscore/underscore.js
* - ooiui/static/lib/backbone/backbone.js
* - ooiui/static/js/ooi.js
*
* Usage
*/

var UserScope = Backbone.Model.extend({
  urlRoot: '/api/user_scope',
  defaults: {
    scope_name: ""
  }
});

var UserScopeCollection = Backbone.Collection.extend({
  model: UserScope,
  url: '/api/user_scope',
  parse: function(response) {
    if(response) {
      return response.user_scopes;
    }
    return [];
  }
});
