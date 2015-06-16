"use strict";
/*
 * ooiui/static/js/views/common/TOCView.js
 * View definitions to build the table of contents
 *
 * Dependencies
 * Libs
 * - ooiui/static/lib/underscore/underscore.js
 * - ooiui/static/lib/backbone/backbone.js
 * - ooiui/static/js/ooi.js
 */


var TOCView = Backbone.View.extend({
  events: {   
    'keyup #search-filter' : 'filterToc'
  },  
  initialize: function(){
    _.bindAll(this, "render","add","filterToc");
    this.subviews = [];    
    this.arrayViews = [];    

    this.dataIndent = {"mooring":1, "platform":2, "instrument":3}
    this.initalRender();
    //this.listenTo(this.collection, "reset", this.render);
  },
  initalRender: function(){
     this.$el.html('<i class="fa fa-spinner fa-spin" style="margin-top:15%;margin-left:50%;font-size:90px;"> </i>');
  },
  getArrayCode: function(model){
    var array_code = model.get('mooring_code').substr(0,2)
    return array_code
  },
  add: function(model){
    var self = this;

    var array_body = this.$el.find('#array_'+this.getArrayCode(model)+"_body") 

    var current = parseInt(this.$el.find('#array_'+this.getArrayCode(model)+"_badge").text())  
    this.$el.find('#array_'+this.getArrayCode(model)+"_badge").text(current+1) 
    

    var key_list = Object.keys(this.dataIndent);    

    $(key_list).each(function(index,key) {      
      var key_body = self.$el.find('#'+key+'_'+model.get(key+'_code')+"_body")       
     
      if (key_body.length ==1){

      }else{
        //create a new one
        //console.log("need to create the item")
        //add to the right place
        var sub_name = model.get(key+'_display_name');
        var sub_id = key+"_"+model.get(key+'_code')+"_body";
        var sub_level  = self.dataIndent[key];

        if (sub_name.length < 1){
          sub_name = model.get(key+'_code')
        }     

        if (sub_level == 2){
          try {
              if (model.get(key+'_code') == "xxxxx"){
                console.log(model)
                sub_name+= ": "+model.get(key+'_code')
              }else{
                var parseIntValue = parseInt(model.get(key+'_code').match(/[0-9]+/)[0], 10);
                sub_name+= ": "+parseIntValue
              }
          }catch (e) {
            console.log("error",e,model.get(key+'_code'))
          }
          
        }  

        var subview = new NestedTocItemView({
          model: model,          
          level: sub_level,
          display_name: sub_name,
          sub_id: sub_id,          
          key: key,
          stream_list:model.get('streams'),
          variable_list:model.get('instrument_parameters')
        });
        self.subviews.push(subview);        
        subview.render();   
        
        if (key == "mooring"){
          array_body.append(subview.el)  
        }else if (key == "platform"){
          self.$el.find('#mooring_'+model.get('mooring_code')+"_body").append(subview.el)
        }else if (key == "instrument"){                    
          self.$el.find('#mooring_'+model.get('mooring_code')+"_body " + '#platform_'+model.get('platform_code')+"_body").append(subview.el)
        }  
        subview=null;      
      }
      
    });

    //self.$el.find('#instrument_'+model.get('reference_designator')+"_body").append(subview.el);
  },
  filterToc: function(){
    var self = this
  },
  template: JST['ooiui/static/js/partials/TOC.html'],
  renderArrays: function(){
    var self = this;
    this.arrayCollection.each(function(model){
      var arrayview = new ArrayItemView({
        model: model
      });      
      self.$el.find('#array-accordion').append(arrayview.el);
    });
  },
  render: function(){
    var self = this;
    this.$el.html(this.template());
    //render the arrays
    self.renderArrays();
    this.$el.find('[data-toggle="tooltip"]').tooltip();
      
    this.collection.each(function(model){        
      self.add(model);
    }); 

  }
});

var ArrayItemView = Backbone.View.extend({  
  className:"panel panel-default",
  id:"array_accordion",
  role:"tablist",  
  events:{
    'click a' : 'onClick',
  },
  initialize: function(options) {
    this.render();
  },
  onClick: function(e) {    
    //e.preventDefault();
    //e.stopPropagation();
    ooi.trigger('arrayItemView:arraySelect', this.model);
  },
  template: JST['ooiui/static/js/partials/ArrayItem.html'],
  render: function(){
    this.$el.html(this.template({model: this.model}));
  }
})


//--------------------------------------------------------------------------------
//  NestedItemView
//--------------------------------------------------------------------------------

var NestedTocItemView = Backbone.View.extend({  
  display_name:"",
  sub_id: "",
  level:1,
  key:"", 
  events:{
    'click a' : 'onClick',
  },
  stream_list:[],
  variable_list:[],
  initialize: function(options) {
    var self = this;
    if(options && options.level && options.key) {
      self.level = options.level;
      self.key = options.key;
    }
    if(options && options.display_name) {
      self.display_name = options.display_name;
    }
    if(options && options.sub_id) {
      self.sub_id = options.sub_id;
    } 
    if(options && options.stream_list) {
      self.stream_list = options.stream_list;
    }
    if(options && options.variable_list) {
      self.variable_list = options.variable_list;
    }
    
  },  
  template: JST['ooiui/static/js/partials/NestedTocItem.html'],
  onClick: function(e) {
    e.stopPropagation();    
    this.toggle(e);
    if(this.level == 1){
      ooi.trigger('platformDeploymentItemView:platformSelect', this.model);  
    }
    else if(this.level ==2){
      ooi.trigger('InstrumentItemView:instrumentSelect', this.model);
    }
    else if(this.level ==3){
      console.log(this.model); 
    }
  },
  toggle: function(e) {    
    var self = this
    
    var current = this.$el.find("ul a #"+(self.level)+"_icon")
    this.$el.find('#'+self.sub_id).collapse('toggle')

    if (current.hasClass("fa-rotate-90")){
        current.removeClass("fa-rotate-90"); 
        //this.$el.find("ul ."+(self.level+1)+"_item_content").removeClass("in")
    }
    else{
        current.addClass("fa-rotate-90");  
        //this.$el.find("ul ."+(self.level+1)+"_item_content").addClass("in")
    }

    if (self.level ==3 ){
      self.instrumentSelect();
    }

  },
  instrumentSelect: function(){
    ooi.trigger('InstrumentItemView:instrumentSelect', this.model);
  },
  render: function(){
    var self = this;
    var plottingLink = ""
    if(this.level == 3) {      
      var mooring = self.model.get('mooring_code')
      var array = mooring.substr(0,2)      
      var platform = self.model.get('platform_code')      
      var ref = self.model.get('reference_designator')
      plottingLink = array+"/"+mooring+"/"+platform+"/"+ref
      var plottingLink = window.location.protocol + '//' + window.location.host+"/plotting/"+plottingLink
    }

    self.$el.html(self.template({plottingLink:plottingLink,display_name: self.display_name,sub_id : self.sub_id, key:self.key ,level: self.level}));
    
    if(this.level == 1) {
      self.$el.toggleClass('sidebar-nav-first-level');
      //this.$el.collapse('show');
    } else if(this.level == 2) {
      self.$el.toggleClass('sidebar-nav-second-level');
      //self.$el.find(self.key+"_item_content").addClass("collapse") 
    } else if(this.level == 3) {
      self.$el.toggleClass('sidebar-nav-third-level');
      self.$el.find(self.key+"_item_content").addClass("collapse")
      //add popover
    }    
  }
});