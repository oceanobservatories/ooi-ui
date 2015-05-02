"use strict";
/*
 * ooiui/static/js/views/common/TimelineView.js
 */

var TimelineView = Backbone.View.extend({
  events: {
    'click #new-entry-btn' : 'onNewEntry'
  },
  subviews: [],
  template: this.JST['ooiui/static/js/partials/Timeline.html'],
  addItem: function(model) {
    var subview = new TimelineItemView({model: model});
    subview.render();
    this.$el.find('#cd-timeline').append(subview.el);
    this.subviews.push(subview);
  },
  onNewEntry: function(e) {
    var subview = new TimelineNewItemView();
    subview.render();
    this.$el.find('.cd-timeline-initial-block').after(subview.el);
  },
  render: function() {
    var self = this;
    this.$el.html(this.template());

    $(window).on('scroll', function() {
      var $timeline_block = self.$el.find('.cd-timeline-block');
      var $last_block = $timeline_block.last();
      if($last_block.offset().top <= $(window).scrollTop() + $(window).height()) {
        self.trigger('endOfPage');
      }
    });
    return this;
  }
});
