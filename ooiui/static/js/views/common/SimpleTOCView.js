"use strict";
/*
 * ooiui/static/js/views/common/SimpleTOCView.js
 * View definitions to build the table of contents
 *
 * Dependencies
 * Libs
 * - ooiui/static/lib/underscore/underscore.js
 * - ooiui/static/lib/backbone/backbone.js
 * - ooiui/static/js/ooi.js
 */


var SimpleTOCView = Backbone.View.extend({
  parentCollection: null,
  childCollection: null,
  subviews : [],
  events: {   
    'keyup #search-filter' : 'filterToc'
  },
  add: function(arrayModel) {
    var self = this;
    //filter the collection
    var search = arrayModel.get('array_code')   
    var filtered = self.childCollection.byRef(search)

    var subview = new ArrayItemView({
      model: arrayModel,
      collection: filtered
    });
    this.subviews.push(subview);
    this.$el.find('ul').append(subview.el);
  },

  render: function() {
    var self = this;   
    if (self.childCollection !=null && self.parentCollection !=null){
      this.$el.html(this.template());
      this.parentCollection.each(function(arrayModel){
        self.add(arrayModel);
      });
    }
  },

  filterToc: function(){
    var self = this
  },
  initialize: function(){
    _.bindAll(this, "render", "add","filterToc");
    this.initialRender();
  },
  template: JST['ooiui/static/js/partials/TOC.html'],
  initialRender: function() {
    this.$el.html('<i class="fa fa-spinner fa-spin" style="margin-top:50px;margin-left:50%;font-size:90px;"> </i>');
  },
});

//--------------------------------------------------------------------------------
//  NestedItemView
//--------------------------------------------------------------------------------

var NestedItemView = Backbone.View.extend({
  level: 2,
  add: function(subview) {
    this.subviews.push(subview);
    this.$el.append(subview.el);
  },
  tagName: 'ul',
  className: 'nav',
  toggle: function() {    
    this.$el.collapse('toggle');    
    if (this.$el.parent().first().find('.toc-arrow').hasClass("fa-rotate-270")){
        this.$el.parent().first().find('.toc-arrow').removeClass("fa-rotate-270"); 
    }
    else{
        this.$el.parent().first().find('.toc-arrow').addClass("fa-rotate-270");  
    }

  },
  initialize: function(options) {
    if(options && options.level) {
      this.level = options.level;
    }
    this.subviews = [];
    this.render();
  },
  render: function(){
    if(this.level == 2) {
      this.$el.toggleClass('sidebar-nav-second-level');
    } else if(this.level == 3) {
      this.$el.toggleClass('sidebar-nav-third-level');
    } else if(this.level == 4) {
      this.$el.toggleClass('sidebar-nav-third-level');
    }
    this.$el.collapse('show');
  }
});

//--------------------------------------------------------------------------------
//  ArrayItemView
//--------------------------------------------------------------------------------

var ArrayItemView = Backbone.View.extend({  
  className: "panel panel-default",
  subview:[],
  platformList: {},
  initialize: function() {
    this.nestedView = new NestedItemView();
    this.model.set('reference_designator', this.model.get('array_code'));
    this.render();
  },
  onClick: function(e) {    
    e.preventDefault();
    e.stopPropagation();
    ooi.trigger('arrayItemView:arraySelect', this.model);
    //this.toggle();
  },
  template: JST['ooiui/static/js/partials/TOCParentItem.html'],
  render: function(){
    var self = this;
    this.$el.html(this.template({data: this.model,type:'array',collectionLength:1}));    
    self.renderPlatforms();
  },
  renderPlatforms: function() {
    var self = this;
    var total = 0;
    this.collection.each(function(model){            
      //if ("coordinates" in model.attributes){        
        var display_name = model.get('assetInfo')['name'] || "";            
        //only show platforms for now
        if(display_name.indexOf('-') >= 0) {
          if (display_name in self.platformList){
            //nothing!
            self.platformList[display_name].push(model.get('assetId'))
          }else{
            self.add(model)   
            total+=1    
            self.platformList[display_name]=[]
            self.platformList[display_name].push(model.get('assetId'))
          }
        }  
      //}
    });
    this.$el.find(".badge").text(total)
  },
  toggle: function() {
    //this.$el.parent().find('.collapse').collapse('hide');
    //this.$el.find('.collapse').collapse('toggle');
  },
  add: function(platformModel){  
    platformModel.set('display_name',platformModel.get('assetInfo')['name'])  
    var subview = new PlatformDeploymentItemView({
      model: platformModel,
      
    });
    
    this.$el.append(subview.el);
  },
  events: {
    'click .panel-title' : 'onClick' 
  }
});

//--------------------------------------------------------------------------------
//  PlatformDeploymentItemView
//--------------------------------------------------------------------------------

var PlatformDeploymentItemView = Backbone.View.extend({
  tagName:'li',
  events: {
    'click' : 'onClick' 
  },
  initialize: function(){
    var self = this;
    _.bindAll(this, "render", "onClick");
    this.nestedView = new NestedItemView({
      level: 3
    });
    this.modifyDisplayName();
    this.render();
  },
  modifyDisplayName: function() {
    var self = this;
    var display_name = this.model.get('display_name') || "";
    //check for station
    if(display_name.indexOf('-') >= 0) {
      var items = display_name.split(' - ');
      //this.model.set('display_name', items[items.length - 1]);
      this.model.set('display_name', display_name);
      self.platformType = "child";
    } else {      
      this.$el.toggleClass('parent-platform');
      self.platformType = "parent-platform";      
    }
  },
  onClick: function(e) { 
    console.log("platform")  
    ooi.trigger('platformDeploymentItemView:platformSelect', this.model); 
  },  
  template: JST['ooiui/static/js/partials/ArrayItem.html'],
  render: function(){
    var self = this;
    console.log(self.platformType)
    this.$el.html(this.template({data: this.model,type:'parent-platform'}));
  }  
});