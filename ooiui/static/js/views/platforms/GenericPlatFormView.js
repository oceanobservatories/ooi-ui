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
    this.render();
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
  
  render: function(){
    this.$el.html(this.template({model:this.model}));
  }

});

var FilteredCollection = Backbone.Collection.extend()

var GenericPlatForm = Backbone.View.extend({
  
  initialize: function(options) {
    _.bindAll(this, "render","addTableRows");
    var self = this;

    if(options && options.platform){
      this.platform = options.platform;
    }

    this.collection = new StreamCollection();

//------------------------- EXAMPLE ONLY---------------------
    this.collection.url ='/api/uframe/stream?search=GP02HYPM';
//------------------------- EXAMPLE ONLY---------------------

    var platforms = this.collection.fetch({
      success:function(collection,response, options){
        console.log('success');
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
          model : model
        });

        var tableID = model.get("reference_designator").substring(0,14);

        self.$el.find("#"+ tableID).append(row.el);
      });
  },
    
  template: JST['ooiui/static/js/partials/GenericPlatForm.html'],

  render: function() {
    var self = this;

     var instrumentTableNames = _.uniq(this.collection.pluck("reference_designator_first14chars"));

     var filtered = new FilteredCollection;

     for( var i = 0 ; i < instrumentTableNames.length ; i++){
      var instrument = this.collection.findWhere({ reference_designator_first14chars : instrumentTableNames[i]});
       
      filtered.add(instrument);
     }
     
    this.$el.html(this.template({collection:filtered, platform: this.platform}));

  }
});





