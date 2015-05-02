"use strict";
/*
 * ooiui/static/js/views/common/TimelineNewItemView.js
 */

var TimelineNewItemView = TimelineItemView.extend({
  events: {
    'click #new-entry-submit' : 'onSubmit'
  },
  template: JST['ooiui/static/js/partials/TimelineNewItem.html'],
  onSubmit: function() {
    var model = new LogEntryModel({
      log_entry_type: 'INFO',
      entry_title: this.$el.find('#new-entry-title').text(),
      entry_description: this.$el.find('#new-entry-description').text()
    });
    ooi.trigger('timelinenewitem:submit', model);
  },
  render: function() {
    this.$el.html(this.template());
    this.$el.find('#new-entry-title').editable();
    this.$el.find('#new-entry-description').editable();
    return this;
  }
});

