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

    this.dataIndent = {"platform":1, "mooring":2, "instrument":3}
    this.initalRender();
    //this.listenTo(this.collection, "reset", this.render);
  },
  initalRender: function(){
     this.$el.html('<i class="fa fa-spinner fa-spin" style="margin-top:15%;margin-left:50%;font-size:90px;"> </i>');
  },
  getArrayCode: function(model){
    var array_code = model.get('platform_code').substr(0,2)
    return array_code
  },
  add: function(model){
    var self = this;

    var array_body = this.$el.find('#array_'+this.getArrayCode(model)+"_body") 
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

        var subview = new NestedTocItemView({
          level: sub_level,
          display_name: sub_name,
          sub_id: sub_id,          
          key: key,
        });
        self.subviews.push(subview);        
        subview.render();   
        
        if (key == "platform"){
          array_body.append(subview.el)  
        }else if (key == "mooring"){
          self.$el.find('#platform_'+model.get('platform_code')+"_body").append(subview.el)
        }else if (key == "instrument"){                    
          self.$el.find('#platform_'+model.get('platform_code')+"_body "+'#mooring_'+model.get('mooring_code')+"_body").append(subview.el)
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
    this.$el.find('[data-toggle="tooltip"]').tooltip()

    console.log(this.collection.length)    
    this.collection.each(function(model){        
      self.add(model);
    });
  }
});

var ArrayItemView = Backbone.View.extend({  
  className:"panel panel-default",
  id:"array_accordion",
  role:"tablist",  
  initialize: function(options) {
    this.render();
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
    
  },  
  template: JST['ooiui/static/js/partials/NestedTocItem.html'],
  onClick: function(e) {
    e.stopPropagation();
    e.preventDefault();    
    this.toggle(e);
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

  },
  render: function(){
    var self = this;
    self.$el.html(self.template({display_name: self.display_name,sub_id : self.sub_id, key:self.key ,level: self.level}));
    
    if(this.level == 1) {
      self.$el.toggleClass('sidebar-nav-first-level');
      //this.$el.collapse('show');
    } else if(this.level == 2) {
      self.$el.toggleClass('sidebar-nav-second-level');
      //self.$el.find(self.key+"_item_content").addClass("collapse") 
    } else if(this.level == 3) {
      self.$el.toggleClass('sidebar-nav-third-level');
      self.$el.find(self.key+"_item_content").addClass("collapse")
    }
    
    
  }
});
