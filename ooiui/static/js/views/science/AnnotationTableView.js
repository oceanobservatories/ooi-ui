"use strict";
/*
 * ooiui/static/js/views/science/AnnotationTableView.js
 * View definitions to build a table view of streams
 *
 * Dependencies
 * CSS:
 * - ooiui/static/css/common/AnnotationTableView.css
 * Partials:
 * - ooiui/static/js/partials/AnnotationTable.html
 * - ooiui/static/js/partials/AnnotationTableItem.html
 * Libs
 * - ooiui/static/lib/underscore/underscore.js
 * - ooiui/static/lib/backbone/backbone.js
 * - ooiui/static/js/ooi.js
 * Usage
 */

/* Example annotation record
{
  "@class": ".AnnotationRecord",
  "annotation": "Create annotation for SSRSPACC-F10NA-F10-8",
  "beginDT": 1491412013000,
  "endDT": 1492468785000,
  "exclusionFlag": false,
  "id": 81,
  "method": "streamed",
  "node": "F10NA",
  "parameters": [],
  "qcFlag": null,
  "sensor": "F10-8",
  "source": "admin@ooi.rutgers.edu",
  "stream": "shore_station_force_10_network_port_data",
  "subsite": "SSRSPACC"
}
*/

var AnnotationTableView = Backbone.View.extend({
  className: "annotationTableView",
  events:{
    "click #addAnnotation"   : "onAddClick"
  },
  columns: [
      {
        name : 'actions',
        label : 'Actions'
      },
      {
        name : 'subsite',
        label : 'Subsite'
      },
      {
        name : 'node',
        label : 'Node'
      },
      {
        name : 'sensor',
        label : 'Sensor'
      },
      {
        name : 'method',
        label : 'Method'
      },
      {
        name : 'stream',
        label : 'Stream'
      },
      {
        name : 'parameters',
        label : 'Parameters'
      },
      {
        name : 'beginDT',
        label : 'Start Date'
      },
      {
        name : 'endDT',
        label : 'End Date'
      },
      {
        name : 'qcFlag',
        label : 'QC Flag'
      },
      {
        name : 'annotation',
        label : 'Annotation'
      },
      {
        name : 'id',
        label : 'Annotation ID' // The uframe ID
      },
      {
        name : 'exclusionFlag',
        label : 'Exclude Data?'
      },
      {
        name : 'source',
        label : 'UserID'
      },
      {
        name : 'referenceDesignator',
        label : 'Reference Designator'
      },
      {
        name : 'stream_name',
        label : 'Stream Name'
      }
  ],
  initialize: function() {
    _.bindAll(this, "render");
  },
  template: JST['ooiui/static/js/partials/AnnotationTable.html'],
  onAddClick: function(event) {
    event.stopPropagation();
    ooi.trigger('AnnotationTableView:onAddClick');
  },
  emptyRender:function(){
    this.$el.html('<h5>Please Select an instrument</h5>');
  },
  render: function() {
    var self = this;
    this.collection.sortByField('beginDT', 'ascending');
    this.$el.html(this.template({collection: this.collection, columns: this.columns, user: ooi.models.userModel.attributes}));

    this.collection.each(function(model, i) {
      model.set('ui_id',i);

      var streamTableItemView = new AnnotationTableItemView({
        columns: self.columns,
        model: model
      });
      // console.log('Adding annotation entry.');
      // console.log(model);
      self.$el.find('tbody').append(streamTableItemView.el);
    });
  }
});

var AnnotationTableItemView = Backbone.View.extend({
  tagName: 'tr',
  events: {
    'click #editAnnotation' : 'onClick',
    'click #deleteAnnotation' : 'onClickDelete'
  },
  initialize: function(options) {
    if(options && options.columns) {
      this.columns = options.columns;
    }
    this.listenTo(this.model, 'change', this.render);
    this.render();
  },
  onClick: function(event) {
    event.stopPropagation();
    ooi.trigger('AnnotationTableItemView:onClick', this.model);
  },
  onClickDelete: function(event) {
    // event.stopPropagation();
    var self = this;
    event.preventDefault();
    this.model.destroy({
      success: function() {
        ooi.trigger('AnnotationTableItemView:onClickDelete', self.model);
      }
    });
  },
  template: JST['ooiui/static/js/partials/AnnotationTableItem.html'],
  render: function() {
    this.$el.html(this.template({model: this.model, columns: this.columns, user: ooi.models.userModel.attributes}));
  }
});

