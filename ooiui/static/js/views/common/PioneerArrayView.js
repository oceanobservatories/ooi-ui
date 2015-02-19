"use strict";
/*
* ooiui/static/js/views/common/PioneerArrayView.js
* View definitions an accordion style for event views
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

var PioneerArrayView = Backbone.View.extend({

  initialize: function(options) {
    _.bindAll(this, "render");
    this.render();
  },

  template: JST['ooiui/static/js/partials/PioneerArray.html'],
  render: function() {
    this.$el.html(this.template());
  } 
});
