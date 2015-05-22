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
  initialRender: function() {
    this.$el.html('<i class="fa fa-spinner fa-spin" style="margin-top:50px;margin-left:50%;font-size:90px;color:#337ab7;"> </i>');
  },
  add: function(arrayModel){
    
    var subview = new ArrayItemView({
      model: arrayModel
    });
    this.subviews.push(subview);
    this.$el.find('ul').append(subview.el);
  },
  filterToc: function(){
    var self = this
  },
  initialize: function(){
    _.bindAll(this, "render", "add","filterToc");
    this.subviews = [];
    this.initialRender();
    this.listenTo(this.collection, "reset", this.render);
  },
  template: JST['ooiui/static/js/partials/TOC.html'],
  render: function(){
    var self = this;
    this.$el.html(this.template());
    this.collection.each(function(arrayModel){
      self.add(arrayModel);
    });
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

//--------------------------------------------------------------------------------
//  ArrayItemView
//--------------------------------------------------------------------------------

var ArrayItemView = Backbone.View.extend({  
  tagName: 'li',
  initialize: function() {
    this.nestedView = new NestedItemView();
    this.model.set('reference_designator', this.model.get('array_code'));
    this.render();
  },
  onClick: function(e) {
    var self = this;
    var target = $(e.target);

    e.preventDefault();
    e.stopPropagation();
    if(this.model.platformDeployments.length == 0) {      
      target.find('.toc-arrow').addClass("fa-rotate-270"); 
      target.prepend("<i class='fa fa-spinner fa-spin s'></i>"); 
      target.prop( "disabled", true );
      self.tg = target;
      this.model.platformDeployments.fetch({
        success: function(collection, response, options) {
          //save more than one request
          //if(self.el.childElementCount == 2){
            self.renderPlatforms(); 
            self.tg.prop( "disabled", false );
            self.tg.find(".s").remove();
          //}
        },
        reset: true
      });
    } else {
      this.nestedView.toggle();
      
    }
    ooi.trigger('arrayItemView:arraySelect', this.model);
  },
  template: JST['ooiui/static/js/partials/ArrayItem.html'],
  render: function(){
    var self = this;
    //console.log(self.platformType)
    this.$el.html(this.template({data: this.model}));
  },
  renderPlatforms: function() {
    var self = this;
    
    this.$el.find(".badge").text(this.model.platformDeployments.length)
    //this.$el.find(".badge").toggleClass("hidden")

    this.model.platformDeployments.each(function(platformModel,i,list){      
      self.add(platformModel);
    });
    this.$el.append(this.nestedView.el);
  },
  add: function(platformModel){    
    var subview = new PlatformDeploymentItemView({
      model: platformModel
    });
    //console.log(platformModel)
    //search for ref deg, and modify the top level parent
    var ref_deg = platformModel.attributes.ref_des
    //console.log(ref_deg)
    if (subview.platformType == "parent-platform" &&ref_deg!=null){
      var platformDeploymentsSubset = this.model.platformDeployments.filter(function(model) { 
        if(model.attributes.ref_des){
          return _.any([model.attributes.ref_des], function(v) {
          //return _.any([model.attributes.reference_designator], function(v) {
            var vv = v.search(ref_deg)!= -1;;          
            return vv
          });
        }                
      });
      //update the badge
      subview.$el.find(".badge").text(platformDeploymentsSubset.length-1)
      //subview.$el.find(".badge").toggleClass("hidden")
    }

    this.nestedView.add(subview);
  },
  events: {
    'click a' : 'onClick' 
  }
});

//--------------------------------------------------------------------------------
//  PlatformDeploymentItemView
//--------------------------------------------------------------------------------

var PlatformDeploymentItemView = Backbone.View.extend({
  tagName:'li',  
  initialize: function(){
    var self = this;
    _.bindAll(this, "render", "onClick");
    this.nestedView = new NestedItemView({
      level: 3
    });
    this.modifyDisplayName();
    this.render();
  },
  add: function(instrumentModel) {
    var subview = new InstrumentDeploymentItemView({
      model: instrumentModel
    });
    this.nestedView.add(subview);
  },
  events: {
    'click a' : 'onClick' 
  },
  modifyDisplayName: function() {
    var self = this;
    var display_name = this.model.get('display_name') || "";
    if(display_name.indexOf('-') >= 0) {
      var items = display_name.split(' - ');
      this.model.set('display_name', items[items.length - 1]);
      self.platformType = "child";
    } else {
      this.$el.toggleClass('parent-platform');
      self.platformType = "parent-platform";      
    }
  },
  onClick: function(e) {
    var self = this;
    var target = $(e.target)        
    
    e.preventDefault();
    e.stopPropagation();

    if(this.model.assetDeployments.length == 0) {
      target.find('.toc-arrow').addClass("fa-rotate-270"); 
      target.prepend("<i class='fa fa-spinner fa-spin s'></i>"); 
      target.prop( "disabled", true );
      self.tg = target;

      /*var ArrayplatformCollection = Backbone.Collection.extend({
        url: '/api/c2/array/'+this.model.attributes.array_code+'/current_status_display'
      });
      var platformCollection = new ArrayplatformCollection();*/

      //This sets the id to be set to the get request, but nothing returning now
      this.model.attributes['id']= this.model.get('assetId');
      this.model.assetDeployments.fetch({
        success: function(collection, response, options) {
          self.renderInstruments();
          self.tg.prop( "disabled", false );
          self.tg.find(".s").remove();
        },
        reset: true
      });
    } else {
      this.nestedView.toggle();      
    }

    ooi.trigger('platformDeploymentItemView:platformSelect', this.model);
    
    /*if(this.model.get('coordinates')){
      var loc = this.model.get('coordinates')
      //loc = loc.coordinates
      var locat= [loc[1],loc[0]]
      ooi.models.mapModel.set({mapCenter: locat})
    }
    if(this.model.get('display_name')){
      //update the glider track
      if (this.model.get('display_name').indexOf('Glider') > -1){
        ooi.views.mapView.update_track_glider(this.model.get('reference_designator'),true);
      }
    }
    else{
      ooi.views.mapView.update_track_glider(this.model.get('reference_designator'),false);
    }*/
  },  

  template: JST['ooiui/static/js/partials/PlatformItem_AA.html'],
  render: function(){
    var self = this;
    this.model.set('reference_designator', this.model.get('ref_des'));
    this.$el.html(this.template({data: this.model,type:self.platformType}));
  },
  renderInstruments: function() {
    var self = this;
    if (self.platformType == "child"){
      this.$el.find(".badge").text(this.model.assetDeployments.length)      
    }

    this.model.assetDeployments.each(function(instrumentModel) {
      self.add(instrumentModel);
    });
    this.$el.append(this.nestedView.el);
  }
});

//--------------------------------------------------------------------------------
//  InstrumentDeploymentItemView
//--------------------------------------------------------------------------------

var InstrumentDeploymentItemView = Backbone.View.extend({
  events: {
    'click a' : 'onClick'
  },
  add: function(streamModel) {
    var subview = new StreamItemView({
      model: streamModel
    });
    this.nestedView.add(subview);
  },
  tagName: 'li',
  initialize: function() {
    this.nestedView = new NestedItemView({
      level: 4
    });
    this.streams = new StreamCollection();
    this.render();
  },
  onClick: function(e) {
    var self = this;
    var target = $(e.target);
    e.preventDefault();
    e.stopPropagation();
    /*if(this.streams.length == 0) {
      target.prepend("<i class='fa fa-spinner fa-spin s'></i>"); 
      target.prop( "disabled", true );
      self.tg = target;
      this.streams.fetch({
        data: $.param({reference_designator: this.model.get('reference_designator')}),
        success: function(collection, response, options) {
          self.renderStreams();
          self.tg.prop( "disabled", false );
          self.tg.find(".s").remove();
        },
        reset: true
      });
    }*/
    ooi.trigger('instrumentDeploymentItemView:instrumentSelect', this.model);
  },
  template: JST['ooiui/static/js/partials/InstrumentItem_AA.html'],
  render: function() {
    var self = this;
    this.$el.html(this.template({data: this.model}));
  },
  renderStreams: function() {
    var self = this;
    this.streams.each(function(streamModel) {
      self.add(streamModel);
    });
    this.$el.append(this.nestedView.el);
  }
});

var StreamItemView = Backbone.View.extend({
  tagName: 'li',
  className: 'stream-item',
  events: {
    'click a' : 'onClick'
  },
  initialize: function() {
    this.render();
  },
  onClick: function(e) {
    e.stopPropagation();
    e.preventDefault();
    ooi.trigger('streamItemView:streamSelect', this.model);
  },
  template: JST['ooiui/static/js/partials/StreamItem.html'],
  render: function() {
    var self = this;
    this.$el.html(this.template({data: this.model}));
  }
});