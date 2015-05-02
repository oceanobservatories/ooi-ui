"use strict";
/*
 * ooiui/static/js/models/common/LogEntryModel.js
 * Model definition for Log Entries
 */

var LogEntryModel = Backbone.Model.extend({
  urlRoot: '/api/log_entry',
  defaults: {
    log_entry_type: '',
    entry_title: '',
    entry_description: '',
    entry_time: null,
    organization_id: ''
  },
  getDate: function() {
    var isoString = this.get('entry_time');
    var dateObj = new Date(isoString);
    return dateObj;
  },
  getUserName: function() {
    var first = this.get('user').first_name;
    var last = this.get('user').last_name;
    return [last, first].join(', ');
  }
});

var LogEntryCollection = Backbone.Collection.extend({
  url: '/api/log_entry',
  model: LogEntryModel,
  offset: 0,
  limit: 20,
  endOfCollection: false,
  reset: function() {
    this.offset = 0;
    this.limit = 20;
    console.log("Custom reset");
    Backbone.Collection.prototype.reset.apply(this, arguments);
  },
  parse: function(response) {
    if(response && response.log_entries) {
      return response.log_entries;
    }
    this.endOfCollection = true;
    return [];
  }
});
