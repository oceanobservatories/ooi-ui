"use strict";
/*
 * ooiui/static/js/models/common/MessageModel.js
 * Model definitions for simple messages
 *
 * Dependencies
 * Partials
 * - ooiui/static/js/partials/compiled/dropdown.js
 * Libs
 * - ooiui/static/lib/underscore/underscore.js
 * - ooiui/static/lib/backbone/backbone.js
 * Usage
 *   var messages = new MessageCollection();
 *   messages.fetch();
 *   messages.each(function(message) { ... });
 */
var TroubleTicketDropdownModel = Backbone.Model.extend({
  urlRoot: "/api/ticket/users",    
  defaults: {
    user_name: ""
  }
});

var TroubleTicketDropdownCollection = Backbone.Collection.extend({
  model: TroubleTicketDropdownModel,
  url: "/api/ticket/users",
  parse: function(response) {
    if (response && response){
        console.log(response.users[0])
      return _.map(response.users, function(u){return {user_name: u[0], user_id: u[1]};});
    }
    return []
  }
});

//var troubleticketdropdowncollection = new TroubleTicketDropdownCollection({
//    data: $.param({
//        project: "ooi-ui-api-testing"
//    })
//});
