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
  getSelectedVars: function(filterModel,filterCollection){        
    var selectedParam = this.$el.find( "#parameters_id option:selected").val()        
    return selectedParam;
  },
  addFilter: function(filterModel,filterCollection){    
    if (filterModel.get('labelText') == "arrays"){
      var subview = new FilterSelectionView({        
        model: filterModel,
        collection: filterCollection
      });
      subview.initallyDisabled = ""
    }else if(filterModel.get('labelText') == "parameters"){
      var subview = new FilterSelectionView({        
        model: filterModel,
        collection: filterCollection
      });
      subview.numberSelectable = 6
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

    this.$el.find('#parameters_id .dropdown-menu').addClass("pull-right")

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
      if (currentItem == "parameters"){
        var selectedStream = this.$el.find( "#streams_id option:selected")        
        var selectedParam = this.$el.find( "#parameters_id option:selected")     
        
        var selected = [];
        $(selectedParam).each(function(index){
            selected.push([$(this).val()]);
        });

        var streamModel = new StreamModel({preferred_timestamp : "internal_timestamp",
                                           start : selectedStream.attr('start'),
                                           end : selectedStream.attr('end'),
                                           stream_name : selectedStream.attr("stream_type") + "_" + selectedStream.text(),
                                           display_name : "",
                                           xvariable : ["time"],
                                           yvariable : selected,
                                           variables_shape : {filterVal:"float"},
                                           reference_designator:  selectedStream.attr("sensor"),
                                       })
        
        ooi.trigger('FilterSelectionView:onParameterSelection', {model: streamModel});
      }else if (currentItem == "streams"){        
        /*
        var selectedStream = this.$el.find( "#streams_id option:selected")   
        var streamModel = new StreamModel({preferred_timestamp : "internal_timestamp",
                                           start : selectedStream.attr('start'),
                                           end : selectedStream.attr('end'),
                                           stream_name : selectedStream.attr("stream_type") + "_" + selectedStream.text(),                                           
                                           reference_designator:  selectedStream.attr("sensor"),
        })   
        ooi.trigger('FilterSelectionView:onStreamSelection', {model: streamModel});  
        */
      }
      console.log("no more filter");
    }else if (childItem == "streams" || childItem == "parameters"){
      //this.$el.find( "#"+currentItem+"_id option").each(function(){$( this ).remove()});
      this.$el.find( "#streams_id").html("")
      this.$el.find( "#parameters_id").html("")

      options.collection.each(function(model) {
        if (model.get('reference_designator') == filterVal){
          //reset then build html
          var streamhtml = ""          
          for (var i = 0; i < model.get(childItem).length; i++) {            
            //add the contents for the stream info
            var streamTextValue = model.get('streams')[i]['stream']
            var streamSubText = model.get('streams')[i]['method']  
            var start = model.get('streams')[i]['beginTime']                            
            var end = model.get('streams')[i]['endTime']            
            var sensor = model.get('streams')[i]['sensor']    

            streamhtml+= "<option sensor='"+sensor+"' stream_type='"+streamSubText+"' start='"+start+"' end='"+end+"' data-subtext='"+streamSubText+"' >"+streamTextValue+"</option>"            
          };

          //params
          var parameterhtml = ""
          for (var i = 0; i < model.get('instrument_parameters').length; i++) {
            var parameterTextValue = model.get('instrument_parameters')[i]           
            var parameterSubText = ""    
            parameterhtml+= "<option data-subtext='"+streamSubText+"' >"+parameterTextValue+"</option>"
          };
          //set them
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
          var newText = childValue.split(filterItem)[1].trim();
          newText = newText.replace("-","")
          newText = newText.trim();

          $( this ).text(newText)
          console.log(newText)
          //self.$el.find( "#"+childItem+"_id").text(newText)
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
  numberSelectable: 1,
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

    this.$el.html(this.template({numberSelectable: self.numberSelectable,
                                 isDisabled:self.initallyDisabled,
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