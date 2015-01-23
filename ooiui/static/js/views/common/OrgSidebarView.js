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

var OrgSidebarView = Backbone.View.extend({
  tagName: 'ul',
  className: 'nav sidebar-nav navbar-collapse',
  initialize: function() {
    _.bindAll(this, "render");
    var self = this;
    this.collection.fetch({
      success: function(collection, response, options) {
        self.render();
      }
    });
  },
  template: JST['ooiui/static/js/partials/OrgSidebar.html'],
  render: function() {
    this.$el.html(this.template({collection: this.collection}));
  }
});
