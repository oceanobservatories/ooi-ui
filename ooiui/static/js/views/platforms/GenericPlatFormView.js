"use strict";
/*
 * ooiui/static/js/views/platforms/GenericPlatForm.js
 * Builds a list of the arrays subsequent items
 *
 * Dependencies
 * CSS:
 * Partials:
 * - ooiui/static/js/partials/GenericPlatForm.html
 * - ooiui/static/js/partials/GenericPlatFormTable.html
 * Libs
 * - ooiui/static/lib/underscore/underscore.js
 * - ooiui/static/lib/backbone/backbone.js
 * - ooiui/static/js/ooi.js
 * Usage
 */



var TableRowStreamCollection = Backbone.Collection.extend()

var Row = Backbone.View.extend({
  tagName:'tbody', 
  events: {
    'click': 'onClick'

  },

  initialize: function(options){
    _.bindAll(this, "render");
    var self = this; 

    //if(options && options.instrument){ 

    //  var instrument = options.instrument;

    //  var streamCollection = new StreamCollection();

    //  $.when(streamCollection.fetch({data: instrument})).done(function(){
    //    self.render(streamCollection);     
    //  });
    //} 

    this.collection = new TableRowStreamCollection();
    this.collection.url ='../json/GP02HYPM.json';
    $.when(this.collection.fetch()).done(function(){
      self.render(self.collection);     
    });
  },

  onClick: function(event){

    var reference_designator = $(event.target.parentNode.id);
    var innerText = $(event.target);
    var isPlot = innerText.context.innerText;

    if(isPlot == "plot"){
      console.log(reference_designator.selector);
    }

  },

  template: JST['ooiui/static/js/partials/GenericPlatFormTable.html'],
  
  render: function(streams){

    this.$el.html(this.template({collection:streams}));
  }

});

var PlatformCollection = Backbone.Collection.extend()

var GenericPlatForm = Backbone.View.extend({
  
  initialize: function(options) {
    _.bindAll(this, "render","addTableRows");
    var self = this;

   // if(options && options.instruments){
   //   var instrument = options.instrument;
   //   var PlatformCollection = new PlatformCollection();  
   //   platformCollection.fetch({
   //     success:function(collection,response, options){
   //       self.render();
   //     }
   //   });
   //   $.when(platformCollection).done(function(){
   //     self.addTableRows();
   //   });
   // }

    this.collection = new PlatformCollection();
    this.collection.url ='json/sample_platform.json';

    var platforms = this.collection.fetch({
      success:function(collection,response, options){
        self.render();
      }
    });
    $.when(platforms).done(function(){
      self.addTableRows();
    });
  },

  addTableRows: function(){
      var self = this;
      this.collection.each(function(model){

        var row = new Row({
          instrument : model.get("reference_designator")
        });

        self.$el.find("#"+ model.get("reference_designator")).append(row.el);
      });
  },
    
  template: JST['ooiui/static/js/partials/GenericPlatForm.html'],

  render: function() {
    var self = this;

     var platforms = ["endurance", "papa", "cabled", "pioneer","argentine","irminger", "southern"];

     function getRandomInt(min, max){
       var ind =  Math.floor(Math.random() * (max-min+ 1)) + min;
       return platforms[ind];
     }
    
     var array = getRandomInt(0, platforms.length-1); 

     console.log(array); 
    // pass in the option instead of array
    this.$el.html(this.template({collection: this.collection, platform: array}));

  }
});





