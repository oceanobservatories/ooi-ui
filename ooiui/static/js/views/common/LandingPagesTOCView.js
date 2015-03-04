"use strict";
/*
* ooiui/static/js/views/common/LandingPagesTOC.js
* View definitions for charts
*
* Dependencies
* Libs
* - ooiui/static/lib/underscore/underscore.js
* - ooiui/static/lib/backbone/backbone.js
* - ooiui/static/js/ooi.js
* Models
* - ooiui/static/js/models/common/OrganizationModel.js
*
* Usage
*/

/*
 * The LandingPagesTOC should be bound to a
 * <div id="sidebar-wrapper" class="navbar-default">. This View will render
 * nav-style links for each organization in the collection passed in as an
 * option.
 */
var LandingPagesTOC = Backbone.View.extend({
  // The el will be a <ul> tag
  tagName: 'ul',
  // <ul class="nav sidebar-nav navbar-collapse">
  className: 'nav sidebar-nav navbar-collapse',
  /*
   * During initialization of this view we fetch the collection and render when
   * it's complete.
   */
  initialize: function(options) {
    _.bindAll(this, "render");
    var self = this;
    this.collection.fetch({
      success: function(collection, options) {
        // If the fetch was successful, then we render
        self.render();
      }
    });
  },
  template: JST['ooiui/static/js/partials/LandingPagesTOC.html'],
  render: function() {
    this.$el.html(this.template({collection: this.collection}));
  }
});
