"use strict";
/*
 * ooiui/static/js/views/common/TimelineItemCommentView.js
 */

var TimelineItemCommentView = Backbone.View.extend({
  events: {
    'click .delete-comment' : 'onDelete'
  },
  initialize: function() {
    _.bindAll(this, 'onDelete');
  },
  onDelete: function(e) {
    var self = this;
    var response = this.model.destroy({
      success: function() {
        self.$el.html('');
      }
    });
  },
  template: JST['ooiui/static/js/partials/TimelineItemComment.html'],
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
    console.log(ooi.models.userModel.attributes);
    this.$el.html(this.template({
      comment: this.model.get('comment'),
      author: this.model.get('user').name,
      owner: (this.model.get('user').id == ooi.models.userModel.get('id') || ooi.models.userModel.get('scopes').indexOf('user_admin') >= 0),
      dateStr: this.getDateString(new Date(this.model.get('comment_time')))
    }));
  }
});

