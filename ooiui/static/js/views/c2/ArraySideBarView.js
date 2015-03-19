"use strict";
/*
* ooiui/static/js/views/c2/ArraySideBarView.js
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
 * The OrgSidebarView should be bound to a
 * <div id="sidebar-wrapper" class="navbar-default">. This View will render
 * nav-style links for each organization in the collection passed in as an
 * option.
 */
var ArraySidebarView = Backbone.View.extend({
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
    // Get the array id from the tag attribute data-id
    //var array_id = parseInt($(event.target).attr('data-id'));
    var array_id = $(event.target).attr('data-id');
    // Publish a new method array:click with the array_id
    this.render();
    this.selectArray(array_id);
  },
  /*
   * During initialization of this view we fetch the collection and render when
   * it's complete.
   */
 initialize: function(options) {
    _.bindAll(this, "render");
    var self = this;
    this.collection.fetch({
      success: function(collection, response, options) {
        console.log('success');
        // If the fetch was successful, then we render
        self.render();
        var refdes = ooi.models.platformModel.get('reference_designator');
        if(refdes && refdes != '' && refdes != null) {
          self.selectArray(refdes)
        }
      }
    });
  },
  selectArray: function(array_id) {
    console.log('In selectArray:' + array_id);
    this.$el.find("[data-id='" + array_id + "']").parent().toggleClass('selected');
    //ooi.trigger('array:click', array_id);
    console.log('After ooi.trigger:' + array_id);
  },
  template: JST['ooiui/static/js/partials/ArraySideBar.html'],
  render: function(array_id) {
    this.$el.html(this.template({collection: this.collection}));
  }
});
