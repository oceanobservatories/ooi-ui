"use strict";
/*
 * ooiui/static/js/models/common/LogEntryComment.js
 * Model definition for Log Entry Comments
 */

var LogEntryCommentModel = Backbone.Model.extend({
  urlRoot: '/api/log_entry_comment',
  defaults: {
    comment: '',
    log_entry_id: null
  }
});

var LogEntryCommentCollection = Backbone.Model.extend({
  url: '/api/log_entry_comment',
  model: LogEntryCommentModel,
  parse: function(response) {
    if(response && response.log_entry_comments) {
      return response.log_entry_comments;
    }
    return [];
  }
});

