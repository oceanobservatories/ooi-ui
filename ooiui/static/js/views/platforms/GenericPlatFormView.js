"use strict";
/*
 * ooiui/static/js/views/science/PlottingSelection.js
 * Builds a list of the arrays subsequent items
 *
 * Dependencies
 * CSS:
 * - ooiui/static/css/common/PlottingSelection.css
 * Partials:
 * - ooiui/static/js/partials/PlottingSelection.html
 * Libs
 * - ooiui/static/lib/underscore/underscore.js
 * - ooiui/static/lib/backbone/backbone.js
 * - ooiui/static/js/ooi.js
 * Usage
 */
var RowCollection = Backbone.Collection.extend()

var Row = Backbone.View.extend({
  tagName:'tbody', 
  initialize: function(){
    
    _.bindAll(this, "render");

    var self = this; 

    var rowCol = new RowCollection();

    rowCol.url ='../json/GP02HYPM.json';
    

    $.when(rowCol.fetch()).done(function(){
      self.render(rowCol);     
    });

  },

  template: JST['ooiui/static/js/partials/GenericPlatFormTable.html'],
  
  render: function(streams){
    console.log(streams);

    this.$el.html(this.template({collection:streams}));
    console.log(tableRow);
  }

});

var DataCollection = Backbone.Collection.extend()

var GenericPlatForm = Backbone.View.extend({
  

  initialize: function(options) {

    _.bindAll(this, "render");
    var self = this;

    this.options = options;

    this.collection = new DataCollection();
    this.collection.url ='json/sample_platform.json';

    var platforms = this.collection.fetch({
      success:function(collection,response, options){
        console.log('success');
        self.render();
      }
    });
    $.when(platforms).done(function(){
      console.log('done');
      for( var i = 0; i < self.collection.length; i++){
       console.log(i);   
      var row = new Row();

      self.$el.find("#GP02HYPM").append(row.el);
      }
    });

  },
    
  template: JST['ooiui/static/js/partials/GenericPlatForm.html'],

  render: function() {
    var self = this;
    console.log("render called GenPlatform");
    console.log(this.collection);

    this.$el.html(this.template({collection: this.collection}));


  }
});





