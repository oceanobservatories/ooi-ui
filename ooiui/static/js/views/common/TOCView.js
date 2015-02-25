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
  add: function(arrayModel){
    var subview = new ArrayItemView({
      model: arrayModel
    });
    this.subviews.push(subview);
    this.$el.find('ul').append(subview.el);
  },
  initialize: function(){
    _.bindAll(this, "render", "add");
    this.subviews = [];
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


    //var statusCollection = new StatusCollection()

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
        
// Move this to the main html at some point...          
            console.log(collection)
            ooi.collections.statusCollection.add(response.platform_deployments) 
        
            //ooi.collections.statusCollection.add(collection.models) 
                
        //var statusViews = new StatusViews({collection: ooi.collections.statusCollection})

// Change append to hmtl or something else...
            //$(".panel-body").html(statusViews.el)
      

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
    //search for ref deg, and modify the top level parent
    var ref_deg = platformModel.attributes.reference_designator
    if (subview.platformType == "parent-platform"){
      var platformDeploymentsSubset = this.model.platformDeployments.filter(function(model) { 
        return _.any([model.attributes.reference_designator], function(v) {
          var vv = v.indexOf(ref_deg)!= -1;;          
          return vv
        });                  
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
    if(this.model.instrumentDeployments.length == 0) {
      target.find('.toc-arrow').addClass("fa-rotate-270"); 
      target.prepend("<i class='fa fa-spinner fa-spin s'></i>"); 
      target.prop( "disabled", true );
      self.tg = target;
      this.model.instrumentDeployments.fetch({
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
    var loc = this.model.get('geo_location')
    loc = loc.coordinates
    var locat= [loc[1],loc[0]]
    ooi.models.mapModel.set({mapCenter: locat})
  },  
  template: JST['ooiui/static/js/partials/ArrayItem.html'],
  render: function(){
    var self = this;
    this.$el.html(this.template({data: this.model,type:self.platformType}));
  },
  renderInstruments: function() {
    var self = this;
    if (self.platformType == "child"){
      this.$el.find(".badge").text(this.model.instrumentDeployments.length)
      //this.$el.find(".badge").removeClass("hidden")
    }

    this.model.instrumentDeployments.each(function(instrumentModel) {
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
    if(this.streams.length == 0) {
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
    }
    ooi.trigger('instrumentDeploymentItemView:instrumentSelect', this.model);
  },
  template: JST['ooiui/static/js/partials/ArrayItem.html'],
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
