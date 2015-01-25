"use strict";
/*
* ooiui/static/js/models/common/EventModel.js
* View definitions for charts
*
* Dependencies
* Libs
* - ooiui/static/lib/underscore/underscore.js
* - ooiui/static/lib/backbone/backbone.js
* - ooiui/static/js/ooi.js
*
* Usage
*/

var EventModel = Backbone.Model.extend({
  urlRoot: '/api/operator_event',
  defaults: {
    watch_id: "",
    event_time: "",
    event_title: "",
    event_comment: "",
    event_type: {
      id: "",
      type_name: "",
      type_description: ""
    }
  }
});


var EventsCollection = Backbone.Collection.extend({
  url: '/api/operator_event',
  model: EventModel,
  parse: function(response) {
    if(response) {
      return response.operator_events;
    }
    return [];
  },
  fetch: function(options) {
    if(options && options.data) {
      Backbone.Collection.prototype.fetch.apply(this, arguments);
    } else {
      console.error("Calling fetch without specifying params");
    }
  }
});
