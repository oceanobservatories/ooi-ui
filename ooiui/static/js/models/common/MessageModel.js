"use strict";
/*
 * ooiui/static/js/models/common/MessageModel.js
 * Model definitions for simple messages
 *
 * Dependencies
 * Partials
 * - ooiui/static/js/partials/compiled/dropdown.js
 * Libs
 * - ooiui/static/lib/underscore/underscore.js
 * - ooiui/static/lib/backbone/backbone.js
 * Usage
 *   var messages = new MessageCollection();
 *   messages.fetch();
 *   messages.each(function(message) { ... });
 */
var MessageModel = Backbone.Model.extend({
  url: "/api/message",
  defaults: {
    author: "",
    message: "",
    date: ""
  }
});
var MessageCollection = Backbone.Collection.extend({
  model: MessageModel,
  url: "/json/messages.json",
  parse: function(response, options) {
    return response.objects
  }
});

