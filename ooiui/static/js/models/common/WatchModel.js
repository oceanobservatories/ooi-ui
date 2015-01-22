"use strict";
/*
* ooiui/static/js/views/common/WatchModel.js
* Model deffinition for watches
*
* Dependencies
* Libs
* - ooiui/static/lib/underscore/underscore.js
* - ooiui/static/lib/backbone/backbone.js
* - ooiui/static/js/ooi.js
*
* Usage
*/


var WatchModel = Backbone.Model.extend({
  urlRoot: "/api/watch",
  defaults: {
    start_time: "",
    end_time: ""
  }
});

var Watches = Backbone.Collection.extend({
  url: "/api/watch",
  model: WatchModel,
  parse: function(response) {
    return response.watches;
  }
});
