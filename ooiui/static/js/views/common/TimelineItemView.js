"use strict";
/*
 * ooiui/static/js/views/common/TimelineView.js
 */

var TimelineItemView = Backbone.View.extend({
  className: 'cd-timeline-block',
  events: {
    'click .show-comments' : 'showComments',
    'click .new-comment' : 'newComment',
    'click .delete-entry' : 'deleteEntry',
    'click .edit-entry' : 'editEntry',
    'click .save-entry' : 'saveEntry'
  },
  initialize: function(options) {
    _.bindAll(this, 'showComments', 'newComment', 'displayComments', 'deleteEntry', 'editEntry', 'renderEdit', 'saveEntry');
  },
  templates: {
    timelineItem: JST['ooiui/static/js/partials/TimelineItem.html'],
    timelineEditItem: JST['ooiui/static/js/partials/TimelineEditItem.html'],
    timelineNewComment: JST['ooiui/static/js/partials/TimelineNewItemComment.html']
  },
  showComments: function(e) {
    var self = this;
    e.preventDefault();
    this.displayComments();
  },
  displayComments: function() {
    var self = this;
    /* Clear the comments first */
    this.render();
    var comments = new LogEntryCommentCollection();
    var commentFetch = comments.fetch({
      data: {
        log_entry_id: this.model.get('id')
      }
    });
    $.when(commentFetch).done(function() {
      console.log(comments);
      comments.each(function(commentModel) {
        var subview = new TimelineItemCommentView({model: commentModel});
        subview.render();
        self.$el.append(subview.el);
        self.subviews.push(subview);
      });
    });
  },
  deleteEntry: function(e) {
    var self = this;
    e.preventDefault();
    this.model.destroy({
      success: function() {
        self.$el.html('');
      }
    });
  },
  editEntry: function(e) {
    var self = this;
    e.preventDefault();
    this.renderEdit();
  },
  saveEntry: function(e) {
    var self = this;
    console.log("Attempting to save");
    this.model.set('entry_title', this.$el.find('#entry-title').text());
    this.model.set('entry_description', this.$el.find('#entry-description').text());
    var response = this.model.save();
    $.when(response).done(function() {
      self.render();
    });
  },
  subviews: [],
  newComment: function(e) {
    var self = this;
    this.displayComments();
    this.$el.find('.cd-timeline-box').after(this.templates.timelineNewComment());
    this.$el.find('#new-comment').editable();
    this.$el.find('#new-comment').on('save', function(e, params) {
      var logEntryComment = new LogEntryCommentModel({
        comment: params.newValue,
        log_entry_id: self.model.get('id')
      });
      var saveAction = logEntryComment.save();
      $.when(saveAction).done(function() {
        self.$el.find('.editable-comment').remove();
        self.displayComments();
      });
    });
  },
  getDateString: function(dateObj) {
    var now = new Date();
    var diff = (now - dateObj) / 1000.0; // Difference in seconds
    diff = diff / 3600; // difference in hours
    if(diff > 24) {
      return moment(dateObj).format('MMMM Do YYYY, h:mm:ss a');
    }
    return moment(dateObj).fromNow();
  },
  render: function() {
    var converter = new Showdown.converter();
    this.$el.html(this.templates.timelineItem({
      owner: (this.model.get('user').id == ooi.models.userModel.get('id') || ooi.models.userModel.get('scopes').indexOf('user_admin') >= 0),
      name: this.model.getUserName(),
      title: this.model.get('entry_title'),
      description: converter.makeHtml(this.model.get('entry_description')),
      dateString: this.getDateString(this.model.getDate())
    }));
    return this;
  },
  renderEdit: function() {
    console.log(this.templates);
    this.$el.html(this.templates.timelineEditItem({
      owner: (this.model.get('user').id == ooi.models.userModel.get('id') || ooi.models.userModel.get('scopes').indexOf('user_admin') >= 0),
      name: this.model.getUserName(),
      title: this.model.get('entry_title'),
      description: this.model.get('entry_description'),
      dateString: this.getDateString(this.model.getDate())
    }));
    this.$el.find('#entry-title').editable();
    this.$el.find('#entry-description').editable();
    return this;
  },
});

