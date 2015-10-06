"use strict";
/*
* ooiui/static/js/views/common/ChartView.js
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
var OrgSidebarView = Backbone.View.extend({
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
    var model_id = parseInt($(event.target).attr('data-id'));
    // Publish a new method org:click with the model_id
    this.render();
    this.selectOrg(model_id);
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
        // If the fetch was successful, then we render
        self.render();
        var organization_id = ooi.models.userModel.get('organization_id');
        if(organization_id && organization_id != '' && organization_id != null) {
          self.selectOrg(organization_id)
        }
      }
    });
  },
  selectOrg: function(org_id) {
      this.$el.find("[data-id='" + org_id + "']").parent().toggleClass('selected');
      this.$el.find("[data-id='" + org_id + "']").css("font-weight","bold");
    ooi.trigger('org:click', org_id);
  },
  template: JST['ooiui/static/js/partials/OrgSidebar.html'],
  render: function() {
    this.$el.html(this.template({collection: this.collection}));
  }
});
