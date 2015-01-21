"use strict";
/*
 * ooiui/static/js/models/common/RoleModel.js
 * Model definitions for Roles
 *
 * Dependencies
 * Libs
 * - ooiui/static/lib/underscore/underscore.js
 * - ooiui/static/lib/backbone/backbone.js
 * - ooiui/static/js/ooi.js
 *
 * Usage
 */

var RoleModel = Backbone.Model.extend({
  urlRoot: "",
  sync: function(method, model, options) {
    if (method === 'read') {
      Backbone.sync(method, model, options);
    } else {
      console.error('You can not ' + method + ' the TodoItem model');
    }
  }
});


var Roles = Backbone.Collection.extend({
    url: "user_roles",
    model: RoleModel,
    parse: function(response) {
        console.log(response.user_roles);
        return response.user_roles;
    }
});
