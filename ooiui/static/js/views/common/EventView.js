"use strict";
/*
* ooiui/static/js/views/common/EventView.js
* View definitions for charts
*
* Dependencies
* Partials
* - ooiui/static/js/partials/Event.html
* Libs
* - ooiui/static/lib/underscore/underscore.js
* - ooiui/static/lib/backbone/backbone.js
* - ooiui/static/js/ooi.js
* Models
* - ooiui/static/js/models/common/EventModel.js
*
* Usage
*/

var EventView = Backbone.View.extend({
  initialize: function() {
    _.bindAll(this, "render", "onSync");
    this.collection.comparator = function(model) {
      var d = new Date(Date.parse(model.get('event_time')));
      return -d;
    }
    this.collection.on('sync', this.onSync);
  },
  onSync: function() {
    this.render();
  },
  template: JST['ooiui/static/js/partials/Event.html'],
  render: function() {
    this.$el.html(this.template({collection: this.collection}));
  }
});
