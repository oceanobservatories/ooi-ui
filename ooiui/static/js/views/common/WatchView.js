"use strict";
/*
* ooiui/static/js/views/common/ChartView.js
* View definitions for charts
*
* Dependencies
* Partials
* - ooiui/static/js/partials/Watch.html
* Libs
* - ooiui/static/lib/underscore/underscore.js
* - ooiui/static/lib/backbone/backbone.js
* - ooiui/static/js/ooi.js
* Models
* - ooiui/static/js/models/common/WatchModel.js
*
* Usage
*/

/*
 * The WatchView will render the watches from the collection as a list-group.
 */
var WatchView = Backbone.View.extend({
  events: {
    'click a': 'onClick'
  },
  initialize: function() {
    _.bindAll(this, "render", "onSync", "onClick");
    var self = this;
    // We create a comparator for the collection to use as a sorting mechanism.
    // We want to sort the collection by the end_time in reverse order.
    this.collection.comparator = function(model) {
      // We get the milliseconds since 1970-01-01 from parsing the end_time in
      // the model
      var d = model.getEndDate();
      if(d == null) { 
        // if we couldn't parse it, then just use the current timestamp.
        d = new Date(); 
      } else {
        d = new Date(d);
      }
      // Return -d so that the sort is reverse order.
      return -d;
    };
    // Whenever this collection is fetched, call this.onSync
    this.collection.on('sync', this.onSync);
  },
  onClick: function(e) {
    this.trigger('watch:click', $(e.target).closest('.watch-item').attr('data-id'));
  },
  /*
   * onSync is called whenver the collection is fetched successfully. This
   * allows us to re-render the view.
   */
  onSync: function() {
    console.log("On sync");
    this.render();
  },
  // comment
  template: JST['ooiui/static/js/partials/Watch.html'],
  render: function() {
    // Sort by the end date
    this.collection.sort();
    this.$el.html(this.template({collection: this.collection}));
  }
});
