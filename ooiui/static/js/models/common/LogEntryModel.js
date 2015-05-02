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
    organization_id: ''
  }
});

var LogEntryCollection = Backbone.Collection.extend({
  url: '/api/log_entry',
  model: LogEntryModel,
  parse: function(response) {
    if(response && response.log_entries) {
      return response.log_entries;
    }
    return [];
  }
});
