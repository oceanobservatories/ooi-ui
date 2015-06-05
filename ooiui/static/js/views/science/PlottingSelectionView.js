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
  options : {
    itemid:null,
  },
  parentChild : {
                 "arrays":{"parent":null,"child":"moorings"},
                 "moorings":{"parent":"arrays","child":"platforms"},    
                 "platforms":{"parent":"moorings","child":"instruments"},                                   
                 "instruments":{"parent":"platforms","child":"streams"},
                 "streams":{"parent":"streams","child":"instruments"},
                 "parameters":{"parent":"instruments","child":"parameters"}
                 },    
  initialize: function(options) {    
    _.bindAll(this, "render");            
  },
  getSelectedRef : function(){
    var selectedRef= this.$el.find( "#instruments_id option:selected").val()        
    return selectedRef;
  },
  getSelectedStream: function(){
    var selectedType= this.$el.find( "#streams_id option:selected").attr("stream_type")  
    var selectedRef= this.$el.find( "#streams_id option:selected").val()      
    return selectedType+"_"+selectedRef;
  },
  getSelectedVars: function(filterModel,filterCollection){        
    var selectedParam = this.$el.find( "#parameters_id option:selected").val()          
    return selectedParam;
  },
  addFilter: function(filterModel,filterCollection){    
    var self = this;    

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
    var self = this;
    this.$el.html(this.template({}));   
    
    this.options.itemid = this.el.id
    var filterItems = Object.keys(self.dataCollection)

    for (var i = 0; i < filterItems.length; i++) {
      var filterModel = new FilterSelectionModel({        
        labelText : filterItems[i],
        parentItem : self.parentChild[filterItems[i]]['parent'],
        childItem : self.parentChild[filterItems[i]]['child'],
        itemid: this.options.itemid
      });           
      //add the sub here
      this.addFilter(filterModel,self.dataCollection[filterItems[i]]) 
    };

    this.$el.find('#parameters_id').parent().find('.dropdown-menu')
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
    var selected = options.selected;
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
        var selected_ids = [];        
        var selectedParam = this.$el.find( "#parameters_id ") 

        $(selectedParam).each(function(index){            
            selected.push([$(this).val()]);
            selected_ids.push([$(this).attr('pid')]);            
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
        
        var data_units = {}
        
        $.each( this.$el.find( "#parameters_id option:selected") , function( key, value ) {
          data_units[$(value).val()] = $(value).attr('data-subtext')
        });

        ooi.trigger('FilterSelectionView:onParameterSelection', {model: streamModel,itemid:this.el.id,data_units:data_units});
      }else if (currentItem == "streams"){ 

        var param_list = []
        var selectedStream = this.$el.find( "#streams_id option:selected")     
        var selectedRef = selectedStream.attr('sensor')

        var streamModel = new StreamModel({preferred_timestamp : "internal_timestamp",
                                           start : selectedStream.attr('start'),
                                           end : selectedStream.attr('end'),
                                           stream_name : selectedStream.attr("stream_type") + "_" + selectedStream.text(),                                           
                                           reference_designator:  selectedStream.attr("sensor"),
                                       })


        options.collection.each(function(model) {
          if (model.get('reference_designator') == selectedRef){
            //reset then build html
            var parameterhtml = ""
            for (var i = 0; i < model.get('instrument_parameters').length; i++) {     
              if (model.get('instrument_parameters')[i].stream == filterVal){
                var parameterItem = model.get('instrument_parameters')[i]                                       

                if (param_list.indexOf(parameterItem.particleKey) == -1){
                  parameterhtml+= "<option pid='"+parameterItem.pdId+"' data-subtext='"+parameterItem.units+"' >"+parameterItem.particleKey+"</option>"
                  param_list.push(parameterItem.particleKey);
                }
              }              
            }
            self.$el.find( "#parameters_id").html(parameterhtml)  
          }
        });

        

        this.$el.find( "#parameters_id" ).removeAttr("disabled");
        this.$el.find('.selectpicker').selectpicker('refresh');
        ooi.trigger('FilterSelectionView:onStreamSelection', {model:streamModel});
      }
      console.log("no more filter");
    }else if (childItem == "streams" || childItem == "parameters"){
      //this.$el.find( "#"+currentItem+"_id option").each(function(){$( this ).remove()});
      this.$el.find( "#streams_id").html("")
      this.$el.find( "#parameters_id").html("")

      var param_list = []

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

          self.$el.find( "#streams_id").html(streamhtml)        
        }
      });
      //remove disabled
      this.$el.find( "#streams_id" ).removeAttr("disabled");      
      //refresh
      this.$el.find('.selectpicker').selectpicker('refresh');
    }else{
      this.unFilterItems(options)
      //filter items
      this.$el.find( "#"+childItem+"_id option" ).each(function( index, obj ) {
        var childValue = $( this ).attr("filter").trim();                  
        var childCode = $( this ).attr(currentItem+"-code");  

        //if we selected a platform the subsequent items need to have their mooring checked, at platform is not unique
        if (currentItem == "platforms"){          
          var platchildCode = $( this ).attr(currentItem+"-code") + $( this ).attr("moorings-code"); 
          var plotfilterVal = $(selected).not("[disabled]").attr(currentItem+"-code") + $(selected).not("[disabled]").attr("moorings-code")

          if (plotfilterVal == platchildCode){                              
            $( this ).text(childValue)
          }
          else{
            $( this ).attr("disabled", true);
          }
        //normal filter  
        }else{
          if (filterVal == childCode){          
            //ITS GOOD!          
            $( this ).text(childValue)
            //console.log(newText)

            //self.$el.find( "#"+childItem+"_id").text(newText)
          }
          else{
            $( this ).attr("disabled", true);
          }  
        }

        
      });

      //remove disabled
      this.$el.find( "#"+childItem+"_id" ).removeAttr("disabled");

      //refresh
      console.log("filter called, refresh",childItem);
      this.$el.find('.selectpicker').selectpicker('refresh');
    }
  },  
});

var FilterSelectionView = Backbone.View.extend({ 
  collection: null,
  options : {
    itemid:null,
  },
  initallyDisabled: "disabled",
  tagName: "div",
  numberSelectable: 1,
  className:"plotting-selection",
  // className:"col-sm-2 plotting-selection",
  id:"ploting-selection",
    // style:"position:realtive width:100%",
  events: {
    'change .selectpicker' : 'onChange'
  },
  initialize: function(options) {
    _.bindAll(this, "render");
    this.options.itemid = options.itemid
  },
  template: JST['ooiui/static/js/partials/FilterPlottingSelection.html'],
  render: function() {
    console.log("FilterSelectionView render called");
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
    var selected = this.$el.find("option:selected");
    var text = this.$el.find("option:selected").text(); 
    var parent_item = self.model.get('parentItem'); 
    var child_item = self.model.get('childItem');
    //fire when the options is selected or unselected


    if (val === undefined){     
      ooi.trigger('FilterSelectionView:onUnSelect', {model: this.model,itemid:this.model.get('itemid')});
    }else{      
      ooi.trigger('FilterSelectionView:onSelect', {model: this.model, filter:text.trim(),filterValue:val, selected:selected, collection: this.collection,itemid:this.model.get('itemid')});
    }

  }
});
