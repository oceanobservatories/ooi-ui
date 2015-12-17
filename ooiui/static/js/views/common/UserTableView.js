"use strict";
/*
 * ooiui/static/js/views/common/UserTableView.js
 * View definitions to build a table view of users
 *
 * Dependencies
 * Partials:
 * - ooiui/static/js/partials/UserTable.html
 * - ooiui/static/js/partials/UserTableItem.html
 * Libs
 * - ooiui/static/lib/underscore/underscore.js
 * - ooiui/static/lib/backbone/backbone.js
 * - ooiui/static/js/ooi.js
 * Usage
 */


var UserTableView = Backbone.View.extend({
  columns: [
      {
        name : 'email',
        label : 'Email'
      },
      {
        name : 'first_name',
        label : 'First Name'
      },
      {
        name : 'last_name',
        label : 'Last Name'
      },
      {
        name : 'organization',
        label : 'Organization'
      },
      {
        name : 'role',
        label : 'Role'
      },
      {
        name : 'email',
        label : 'Email'
      },
      {
        name : 'active',
        label : 'Is Active'
      }
  ],
  initialize: function() {
    _.bindAll(this, "render");
    this.listenTo(this.collection, 'reset', this.render);
  },
  template: JST['ooiui/static/js/partials/UserTable.html'],
  render: function() {
    var self = this;
    this.$el.html(this.template({collection: this.collection, columns: this.columns}));
    this.collection.each(function(model) {
      var userTableItemView = new UserTableItemView({
        columns: self.columns,
        model: model
      });
      self.$el.find('tbody').append(userTableItemView.el);
    });
  }
});

var UserTableItemView = Backbone.View.extend({
  tagName: 'tr',
  events: {
    'click' : 'onClick'
  },
  initialize: function(options) {
    _.bindAll(this, "render", "onClick");
    if(options && options.columns) {
      this.columns = options.columns;
    }
    this.listenTo(this.model, 'change', this.render);
    this.render();
  },
  onClick: function(event) {
    event.stopPropagation();
    window.location = '/user/edit/' + this.model.get('id');
  },
  template: JST['ooiui/static/js/partials/UserTableItem.html'],
  render: function() {
    this.$el.html(this.template({model: this.model, columns: this.columns}));
  }
});
