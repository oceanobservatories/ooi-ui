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
    /* The server may return a 204 and an empty resonse if this happense
     * response will be undefined so what we do is return an empty list which
     * ultimately winds up becoming an empty collection, which looks and
     * behaves like a normal collection but won't break code.
     */
    if(response) {
      return response.watches; // We actually got a response
    }
    return []; // Server return a 204 (EMPTY)
  }
});
