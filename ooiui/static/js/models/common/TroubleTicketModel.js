"use strict";
/*
 * ooiui/static/js/models/common/TroubleTicketModel.js
 * Model definition for Trouble Ticket Creation
 *
 * Dependencies
 * Libs
 * NEED HELP HERE
 * - ooiui/static/lib/underscore/underscore.js
 * - ooiui/static/lib/backbone/backbone.js
 * - ooiui/static/js/ooi.js
 *
 * Usage
 */

var TroubleTicketModel = Backbone.Model.extend({
  urlRoot: '/api/ticket',
  defaults: {
    "project_id": "ocean-observatory",
    "subject": "",
    "due_date": null,
    "description": null,
    "priority_id": null,
    "assigned": 83,
  },
  validation: {  
    assigned:{
      required: true,
      msg: 'Assignee is required'
    },
    description:{
      required:true
    },
    due_date:{
      required: false
    },
      priority_id:{
      required: false,
      msg: 'Priority is required'

    },
    subject:{
      required:true
    }
  }
  
});
