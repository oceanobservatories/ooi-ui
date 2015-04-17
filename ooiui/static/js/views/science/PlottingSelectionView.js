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

var PlottingSelectionView = Backbone.View.extend({ 
  filterSubviews:[],
  dataCollection: {},
  parentChild : {
                 "arrays":{"parent":null,"child":"moorings"},
                 "moorings":{"parent":"arrays","child":"platforms"},
                 "platforms":{"parent":"platforms","child":"instruments"},
                 "instruments":{"parent":"platforms","child":"streams"},
                 "streams":{"parent":"streams","child":"instruments"},
                 "parameters":{"parent":"instruments","child":"parameters"}
                 },    
  initialize: function() {
    _.bindAll(this, "render");     
  },
  addFilter: function(filterModel,filterCollection){    
    if (filterModel.get('labelText') == "arrays"){
      var subview = new FilterSelectionView({        
        model: filterModel,
        collection: filterCollection
      });
      subview.initallyDisabled = ""
    }else{
      var subview = new FilterSelectionView({
        model: filterModel,
        collection: filterCollection
      });
    }
    subview.render();
    this.filterSubviews.push(subview);

    this.$el.find('.filter-selection-body').append(subview.el);
  },
  template: JST['ooiui/static/js/partials/PlottingSelection.html'],
  render: function() {
    console.log("render called");
    var self = this;
    this.$el.html(this.template({}));   
    
    var filterItems = Object.keys(self.dataCollection)

    for (var i = 0; i < filterItems.length; i++) {
      var filterModel = new FilterSelectionModel({        
        labelText : filterItems[i],
        parentItem : self.parentChild[filterItems[i]]['parent'],
        childItem : self.parentChild[filterItems[i]]['child']
      });      
      //add the sub here
      this.addFilter(filterModel,self.dataCollection[filterItems[i]]) 
    };

  },
  unFilterItems: function(options) {
    var self = this;
    var childItem = options.model.get("childItem") ;
    var currentItem =  options.model.get("labelText") ;
    var filterItem =  options.filter ;
    var filterVal = options.filterValue;

    if (currentItem == "streams" || currentItem == "parameters"){
      //no more need to filter
      console.log("no more filter");
    }else if (childItem == "streams" || childItem == "parameters"){
      
    }else{

      //unfilter items
      this.$el.find( "#"+childItem+"_id option" ).each(function( index, obj ) {
        $( this ).removeAttr("disabled");
      });
      //add disabled back
      this.$el.find( "#"+childItem+"_id" ).attr("disabled", true);
      
      //refresh
      $('.selectpicker').selectpicker('refresh');
      console.log("un:filter called, refresh");
    }
  },
  filterItems: function(options) {
    var self = this;
    var childItem = options.model.get("childItem") ;
    var currentItem =  options.model.get("labelText") ;
    var filterItem =  options.filter ;
    var filterVal = options.filterValue;

    if (currentItem == "streams" || currentItem == "parameters"){
      //no more need to filter
      console.log("no more filter");
    }else if (childItem == "streams" || childItem == "parameters"){
      //this.$el.find( "#"+currentItem+"_id option").each(function(){$( this ).remove()});
      this.$el.find( "#streams_id").html("")
      this.$el.find( "#parameters_id").html("")

      options.collection.each(function(model) {
        if (model.get('reference_designator') == filterVal){
          //reset then build html
          var streamhtml = ""
          var parameterhtml = ""
          for (var i = 0; i < model.get(childItem).length; i++) {            
              var streamTextValue = model.get('streams')[i]['stream']
              var streamSubText = model.get('streams')[i]['method']
              var parameterTextValue = model.get('instrument_parameters')[i]
              var parameterSubText = ""                    

            streamhtml+= "<option data-subtext='"+streamSubText+"' >"+streamTextValue+"</option>"
            parameterhtml+= "<option data-subtext='"+streamSubText+"' >"+parameterTextValue+"</option>"
          };
          self.$el.find( "#streams_id").html(streamhtml)         
          self.$el.find( "#parameters_id").html(parameterhtml)         
        }
      });
      //remove disabled
      this.$el.find( "#streams_id" ).removeAttr("disabled");
      this.$el.find( "#parameters_id" ).removeAttr("disabled");
      //refresh
      $('.selectpicker').selectpicker('refresh');
    }else{
      this.unFilterItems(options)
      //filter items
      this.$el.find( "#"+childItem+"_id option" ).each(function( index, obj ) {
        var childValue = $( this ).attr("filter").trim();          

        var childCode = $( this ).attr(currentItem+"-code");                    
        if (filterVal == childCode){
          //ITS GOOD!
        }
        else{
          $( this ).attr("disabled", true);
        }
      });

      //remove disabled
      this.$el.find( "#"+childItem+"_id" ).removeAttr("disabled");

      //refresh
      console.log("filter called, refresh",childItem);
      $('.selectpicker').selectpicker('refresh');
    }
  },  
});

var FilterSelectionView = Backbone.View.extend({ 
  collection: null,
  initallyDisabled: "disabled",
  tagName: "div",
  className:"col-sm-2",
  events: {
    'change .selectpicker' : 'onChange'
  },
  initialize: function(options) {
    _.bindAll(this, "render");
  },
  template: JST['ooiui/static/js/partials/FilterPlottingSelection.html'],
  render: function() {
    console.log("render called");
    var self = this;   

    this.$el.html(this.template({isDisabled:self.initallyDisabled,
                                 labelText:self.model.get('labelText'),
                                 model:self.model,
                                 collection:self.collection})); 
    //setup the picker
    this.$el.find('.selectpicker').selectpicker();
  },
  onChange: function() {
    var self = this;
    var val = this.$el.find("option:selected").val(); 
    var text = this.$el.find("option:selected").text(); 
    var parent_item = self.model.get('parentItem'); 
    var child_item = self.model.get('childItem');
    //fire when the options is selected or unselected
    if (val === undefined){     
      ooi.trigger('FilterSelectionView:onUnSelect', {model: this.model});
    }else{      
      ooi.trigger('FilterSelectionView:onSelect', {model: this.model, filter:text.trim(),filterValue:val, collection: this.collection});
    }

  }
});