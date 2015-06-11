"use strict";
/*
* ooiui/static/js/views/common/PlatformStatusView.js
*
* Dependencies
* Libs
* - ooiui/static/lib/underscore/underscore.js
* - ooiui/static/lib/backbone/backbone.js
* - ooiui/static/js/ooi.js
* Models
* - ooiui/static/js/models/common/PlatformStatusModel.js
*
* Usage
*/

/*
 * The OrgSidebarView should be bound to a
 * <div id="sidebar-wrapper" class="navbar-default">. This View will render
 * nav-style links for each organization in the collection passed in as an
 * option.
 */
var PlatformStatusView = Backbone.View.extend({
  // The el will be a <ul> tag
  tagName: 'ul',
  // <ul class="nav sidebar-nav navbar-collapse">
  className: 'nav sidebar-nav navbar-collapse',
  events: {
    'click a' : 'onClick'
  },
  /*
   * When one of the links are clicked we trigger this method which gets the
   * data-id attribute in the tag and publishes a new event org:click with the
   * model_id as the parameter.
   */
  onClick: function(event) {
    //prevent double request
    event.preventDefault();
    // Get the model id from the tag attribute data-id
    var model_id = $(event.target).attr('data-id');
    console.log('Platform onClick: ' + model_id);
    // Publish a new method platformnav:click with the model_id
    this.render();
    this.selectPlatform(model_id);
  },
  /*
   * During initialization of this view we fetch the collection and render when
   * it's complete.
   */
  initialize: function(options) {
    _.bindAll(this, "render", "onSync", "selectPlatform");
    this.listenTo(this.collection, "sync", this.onSync);
  },
  onSync: function() {
    this.render();
  },
  selectPlatform: function(refdes) {
    //this.$el.find("[data-id='" + refdes + "']").parent().toggleClass('selected');
    ooi.trigger('platformnav:click', refdes);
  },
  template: JST['ooiui/static/js/partials/PlatformStatus.html'],
  render: function() {
    this.$el.html(this.template({collection: this.collection}));
  }
});
