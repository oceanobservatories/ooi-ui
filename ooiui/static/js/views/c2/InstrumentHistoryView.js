"use strict";
/*
* ooiui/static/js/views/c2/InstrumentHistoryView.js
* View definitions for charts
*
* Dependencies
* Libs
* - ooiui/static/lib/underscore/underscore.js
* - ooiui/static/lib/backbone/backbone.js
* - ooiui/static/js/ooi.js
* Models
*
* Usage
*/

var InstrumentHistoryView = Backbone.View.extend({
  tagName: 'div',
  // <ul class="nav sidebar-nav navbar-collapse">
  className: '',
  events: {
  },
  /*
   * When one of the links are clicked we trigger this method which gets the
   * data-id attribute in the tag and publishes a new event org:click with the
   * model_id as the parameter.
   */
  onClick: function(event) {
  },
  /*
   * During initialization of this view we fetch the collection and render when
   * it's complete.
   */
 initialize: function(options) {
    _.bindAll(this, "render");
    this.$el.html('');
    var self = this;
    self.render();
  },

  /*
  Clicking the table of contents of Arrays
  */
  selectHistory: function(array_id) {
  },


  render: function() {
    var treedata = [];
    for(var obj in this.collection){
      var node = {};
      node['label'] = obj.toUpperCase();
      var nodechildren = [];
      for(var i in this.collection[obj][0]){
        nodechildren.push({'label':this.collection[obj][0][i].msg});
      }
      node['children'] = nodechildren;
      treedata.push(node);
    }
    $('#instrument_history_tree').tree({
        data: treedata,
        autoOpen: true,
        dragAndDrop: false,
        closedIcon: $('<i class="fa fa-arrow-circle-right">'),
        openedIcon: $('<i class="fa fa-arrow-circle-down">')
    });
  }
});
