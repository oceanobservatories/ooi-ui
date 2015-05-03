"use strict";
/*
 * ooiui/static/js/views/common/TimelineView.js
 */

var TimelineItemView = Backbone.View.extend({
  className: 'cd-timeline-block',
  events: {
    'click .show-comments' : 'showComments',
    'click .new-comment' : 'newComment',
  },
  initialize: function(options) {
    _.bindAll(this, 'showComments', 'newComment', 'displayComments');
  },
  templates: {
    timelineItem: JST['ooiui/static/js/partials/TimelineItem.html'],
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
    this.$el.html(this.templates.timelineItem({
      name: this.model.getUserName(),
      title: this.model.get('entry_title'),
      description: this.model.get('entry_description'),
      dateString: this.getDateString(this.model.getDate())
    }));
    return this;
  }
});

