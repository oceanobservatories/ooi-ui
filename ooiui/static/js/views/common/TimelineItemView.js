"use strict";
/*
 * ooiui/static/js/views/common/TimelineView.js
 */

var TimelineItemView = Backbone.View.extend({
  className: 'cd-timeline-block',
  events: {
    'click .cd-read-more' : 'showComments'
  },
  initialize: function(options) {
    _.bindAll(this, 'showComments');
  },
  templates: {
    timelineItem: this.JST['ooiui/static/js/partials/TimelineItem.html'],
    timelineComment: this.JST['ooiui/static/js/partials/TimelineItemComment.html']
  },
  showComments: function(e) {
    e.preventDefault();
    console.log("oi");
    for(var i=0; i<4; i++) {
      this.$el.append(this.templates.timelineComment());
    }
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

