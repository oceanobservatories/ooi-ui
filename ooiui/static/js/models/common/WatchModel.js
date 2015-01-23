"use strict";
/*
* ooiui/static/js/views/common/WatchModel.js
* Model deffinition for watches
*
* Dependencies
* Libs
* - ooiui/static/lib/underscore/underscore.js
* - ooiui/static/lib/backbone/backbone.js
* - ooiui/static/lib/moment/moment.js
* - ooiui/static/js/ooi.js
* Usage
*/


var WatchModel = Backbone.Model.extend({
  urlRoot: "/api/watch",
  /*
   * getName returns either 'First Last's Watch' or General Watch if either the
   * first name or last name are undefined.
   */
  getName: function() {
    // Used to get the name of the watch
    var obj = this.toJSON();
    if(obj.user.first_name && obj.user.last_name) {
      return obj.user.first_name + ' ' + obj.user.last_name + "'s Watch";
    } 
    return "General Watch";
  },
  /*
   * getDates returns a properly formatted date in the local timezone. If both
   * start and end are defined it returns both dates together with a dash.
   * Example: January 22nd 2015, 6:52:49 pm - January 22nd 2015, 7:21:00 pm
   */
  getDates: function() {
    var obj = this.toJSON();
    var r = [];
    if(obj.start_time != null) {
      var d = Date.parse(obj.start_time);
      r.push(moment(d).format('MMMM Do YYYY, h:mm:ss a'));
    }
    if(obj.end_time != null) {
      r.push('-');
      var d = Date.parse(obj.end_time);
      r.push(moment(d).format('MMMM Do YYYY, h:mm:ss a'));
    }
    return r.join(' ');
  },
  /*
   * Returns the number of millseconds since 1970-01-01 and the start_time
   * timestamp
   */
  getStartDate: function() { 
    if(this.get('start_time')) {
      return Date.parse(this.get('start_time'));
    }
    return null;
  },
  /*
   * Returns the number of millseconds since 1970-01-01 and the end_time
   * timestamp
   */
  getEndDate: function() {
    if(this.get('end_time')) {
      return Date.parse(this.get('end_time'));
    }
    return null;
  },
  defaults: {
    start_time: "",
    end_time: "",
    user: {
    }
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
