"use strict";
/*
 * ooiui/static/js/models/common/troubleTicketAssigneeeModel.js
 * Model definition for Ticket Assignee
 *
 * Dependencies
 * Libs
 * - ooiui/static/lib/underscore/underscore.js
 * - ooiui/static/lib/backbone/backbone.js
 * - ooiui/static/js/ooi.js
 *
 * Usage
 */

var TroubelTicketAssigneeModel = Backbone.Model.extend({
  // urlRoot: '/api/operator_event_type',
  urlRoot: '/api/trouble_ticket_assignee',
  defaults: {
    "id": "",
    "assignee_name": ""
  }
});

var TroubelTicketAssigneeCollection = Backbone.Collection.extend({
  url: '/api/trouble_ticket_assignee',
  // url: '/api/operator_event_type',
  model: TroubelTicketAssigneeModel,
  parse: function(response) {
    if(response) {
      return response.trouble_ticket_assignee;
    }
    return [];
  }
});
