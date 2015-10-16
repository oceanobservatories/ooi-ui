"use strict";
/*
 * ooiui/static/js/models/c2/MissionExecutiveModel.js
 */

var MissionExecutiveModel = Backbone.Model.extend({
  urlRoot: '#',
  defaults: {
    mission_id: 3,   
  }
});

var MissionExecutiveCollection = Backbone.Collection.extend({  
  url: '/api/c2/missions',
  model: MissionExecutiveModel,
  parse: function(response) {
    if(response) {
      return response.missions;
    } else {
      return [];
    }
  }
});