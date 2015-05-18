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
    var search = arrayModel.get('array_code');
    var filtered = self.childCollection.byRef(search);

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
    this.$el.html('<i class="fa fa-spinner fa-spin" style="margin-top:50px;margin-left:50%;font-size:90px;color:#337ab7;"> </i>');
  }
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

var BaseTOCView = Backbone.View.extend({
  platformItemList: [],
  getPlatformRef: function(ref_res,isMoas) {     
    if (isMoas){
      var platform_ref = ref_res.split("-");
      platform_ref = platform_ref.slice(0,2).join("-");
      return platform_ref
    }else{
      var platform_ref = ref_res.split("-");
      platform_ref = platform_ref[0];
      return platform_ref
    }
  },
  getShortName: function(longName) { 
    var shortName = longName.split("-");
    shortName = shortName.slice(1);
    shortName = shortName.join("-");
    return shortName
  },
  modifyDisplayName: function(current,parent) {
    var self = this;  
    var splitName = current.split(parent);  
    if (splitName.length >1){
      var splitName = splitName[1].substring(3);
      return splitName
    }else{
      return current
    }
  }, 
  isMOAS:function(ref_des){
    var isMOAS = ((ref_des.match(new RegExp("MOAS", "g")) || []).length);  
    if (isMOAS > 0){
      isMOAS = 1;
    }
    return isMOAS
  },
  isMOASInstrument:function(ref_des){
    var isMOASInstrument = ((ref_des.match(new RegExp("-", "g")) || []).length); 
    if (isMOASInstrument > 1){
      isMOASInstrument = 1;
    }else{
      isMOASInstrument = 0;
    }
    return isMOASInstrument
  },
  isParent:function(platformModel){
    var self = this;
    var isMOAS = self.isMOAS(platformModel.get('ref_des'));
    var isMOASInstrument = self.isMOASInstrument(platformModel.get('ref_des'));
    var ref_des = platformModel.get('ref_des');
    var display_name = platformModel.get('display_name') || platformModel.get('ref_des');

    //what is it were adding?
    if (isMOAS){
      //is moas              
      if(isMOASInstrument) {
        //child   
        return 0            
      }else{   
        //parent  
        return 1         
      }      
    }else if(ref_des.indexOf('-') >= 0) {      
      //child
      return 0
    } else { 
      //parent 
      return 1          
    }
  }
});

//--------------------------------------------------------------------------------
//  ArrayItemView
//--------------------------------------------------------------------------------

var ArrayItemView = BaseTOCView.extend({  
  className: "panel panel-default",
  subview:[],
  platformList: [],
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
    //collection for parents
    var total_parents = 0;    
    this.collection.each(function(model){            
      //if ref res not already added      
        var ref_des = model.get('ref_des'); 
        if (self.isParent(model)){
          if (self.platformList.indexOf(ref_des) == -1){
            self.add(model,"parent-platform");
            total_parents+=1;
            self.platformList.push(ref_des)
          }        
        }
    });

    //collection for children
    var total_child = 0;   
    this.collection.each(function(model){            
      //if ref res not already added      
        var ref_des = model.get('ref_des');            
        if (!self.isParent(model)){
          if (self.platformList.indexOf(ref_des) == -1){
            self.add(model,"child");
            total_child+=1;
            self.platformList.push(ref_des)
          }
        }
    });

    this.$el.find("#parentBadge").text(total_parents);
    this.$el.find("#childBadge").text(total_child)
  },
  toggle: function() {
    //this.$el.parent().find('.collapse').collapse('hide');
    //this.$el.find('.collapse').collapse('toggle');
  },
  add: function(platformModel,level_type){  
    var self = this;
    platformModel.set('display_name',platformModel.get('assetInfo')['name']);

    
    //if child----------------------------------------
    if (level_type == "child"){
      var platformRes = self.getPlatformRef(platformModel.get('ref_des'),this.isMOAS(platformModel.get('ref_des')));
      var parent = this.$el.find('#'+platformRes+'_contents');
      
      var parent_text = this.$el.find('#'+platformRes+'_title').attr("displayname");
      var display_name = platformModel.get("display_name");

      if ((typeof(parent_text) !== 'undefined') && (parent_text !== null) && (parent_text.length>0)) { 
          if ((typeof(display_name) !== 'undefined') && (display_name !== null) && (display_name.length>0)) { 
            platformModel.set("display_name",self.modifyDisplayName(display_name,parent_text));         
          }else{
            platformModel.set("display_name","Undefined");
          }
                    
          //if it exists add it!
          var subview = new InstrumentView({
            model: platformModel,
          });
          parent.append(subview.el); 
      }else{
        console.log("unknown...",platformModel.get('display_name'),platformModel.get('ref_des'))
      }

    //if parent just add the platform
    }else if ("parent-platform"){
      var subview = new PlatformDeploymentItemView({
        model: platformModel
      });
      //add the platform 
      self.platformItemList.push(platformModel.get('ref_des'));
      this.$el.append(subview.el);
    }    
  },
  events: {
    'click .panel-title' : 'onClick' 
  }
});

//--------------------------------------------------------------------------------
//  PlatformDeploymentItemView
//--------------------------------------------------------------------------------

var PlatformDeploymentItemView = BaseTOCView.extend({
  platformType: "parent-platform",
  tagName:'li',
  events: {
    'click' : 'onClick' 
  },
  initialize: function(){
    var self = this;
    _.bindAll(this, "render", "onClick");
    this.render();    
  },
  onClick: function(e) { 
    console.log("platform");
    ooi.trigger('platformDeploymentItemView:platformSelect', this.model); 
  },  
  template: JST['ooiui/static/js/partials/PlatformItem.html'],
  render: function(){
    var self = this;    
    this.$el.html(this.template({data: this.model,type:self.platformType}));
  }
});


var InstrumentView = BaseTOCView.extend({
    platformType: "child",
    tagName:'li',
    events: {
      'click' : 'onClick' 
    },
    initialize: function(){
      var self = this;
      _.bindAll(this, "render", "onClick");  
      this.render();    
    },
    onClick: function(e) { 
      console.log("instrument");
      ooi.trigger('InstrumentItemView:instrumentSelect', this.model); 
    },  
    template: JST['ooiui/static/js/partials/InstrumentItem.html'],
    render: function(){
      var self = this;    
      this.$el.html(this.template({data: this.model,type:self.platformType}));
    }
});
