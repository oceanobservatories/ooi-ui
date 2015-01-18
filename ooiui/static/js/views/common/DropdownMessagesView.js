"use strict";
/*
 * ooiui/static/js/views/common/DropdownMessagesView.js
 * View definitions to render a dropdown of messages in the navbar
 *
 * Dependencies
 * Partials
 * - ooiui/static/js/partials/compiled/dropdown.js
 * Libs
 * - ooiui/static/lib/underscore/underscore.js
 * - ooiui/static/lib/backbone/backbone.js
 * Usage
 *   var messageView = new DropdownMessagesView({
 *     collection: new MessageCollection()
 *   });
 *   $('#navbar-right').prepend(messageView.el);
 */

var DropdownMessageView = Backbone.View.extend({
  tagName: "li",
  initialize: function() {
    _.bindAll(this, "render");
    this.render();
  },
  template: JST['ooiui/static/js/partials/DropdownMessage.html'],
  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
  }
});

var DropdownMessagesView = Backbone.View.extend({
  tagName: "li",
  className: "dropdown",
  add: function(model) {
    var modelView = new DropdownMessageView({model: model});
    this.$el.find('.dropdown-messages').prepend(modelView.el);
  },
  initialize: function() {
    _.bindAll(this, "render", "add");
    var self = this;
    this.collection.fetch({
      success: function(collection, response, options) {
        self.render();
      }
    });
  },
  template: JST['ooiui/static/js/partials/DropdownMessages.html'],
  render: function() {
    this.$el.html(this.template());
    this.collection.each(this.add);
  }
});

