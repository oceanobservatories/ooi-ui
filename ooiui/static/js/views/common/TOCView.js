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
        console.log("need to create the item")
        //add to the right place
        var sub_name = model.get(key+'_code');
        var sub_id = key+"_"+model.get(key+'_code')+"_body";
        var sub_level  = self.dataIndent[key];

        var subview = new NestedTocItemView({
          level: sub_level,
          display_name: sub_name,
          id: sub_id,
        });
        self.subviews.push(subview);        

        //var new_content = '<div id="'+key+"_"+model.get(key+'_code')+"_body"+'" ></div>'
        if (key == "platform"){
          array_body.append(subview.el)  
        }else if (key == "mooring"){
          self.$el.find('#platform_'+model.get('platform_code')+"_body").append(subview.el)
        }else if (key == "instrument"){                    
          self.$el.find('#platform_'+model.get('platform_code')+"_body "+'#mooring_'+model.get('mooring_code')+"_body").append(subview.el)
        }        
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
      console.log(model)    
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
  level: 2,
  tagName: 'ul',
  className: 'nav sidebar-nav',
  display_name:"",
  id:"",
  initialize: function(options) {
    if(options && options.level) {
      this.level = options.level;
    }
    if(options && options.display_name) {
      this.display_name = options.display_name;
    }
    if(options && options.id) {
      this.id = options.id;
    }    
    this.render();    
  },  
  template: JST['ooiui/static/js/partials/NestedTocItem.html'],
  toggle: function() {    
    this.$el.collapse('toggle');    
    if (this.$el.parent().first().find('.toc-arrow').hasClass("fa-rotate-270")){
        this.$el.parent().first().find('.toc-arrow').removeClass("fa-rotate-270"); 
    }
    else{
        this.$el.parent().first().find('.toc-arrow').addClass("fa-rotate-270");  
    }

  },
  render: function(){
    var self = this;
    self.$el.html(self.template({display_name: self.display_name,id : self.id}));
    
    if(this.level == 1) {
      self.$el.toggleClass('sidebar-nav-second-level');
    } else if(this.level == 2) {
      self.$el.toggleClass('sidebar-nav-third-level');
    } else if(this.level == 3) {
      self.$el.toggleClass('sidebar-nav-third-level');
    }
    this.$el.collapse('show');
    
  }
});


/*
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
    if (subview.platformType == "parent-platform"){
      var platformDeploymentsSubset = this.model.platformDeployments.filter(function(model) { 
        return _.any([model.attributes.ref_des], function(v) {
        //return _.any([model.attributes.reference_designator], function(v) {
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

    if(this.model.assetDeployments.length == 0) {
      target.find('.toc-arrow').addClass("fa-rotate-270"); 
      target.prepend("<i class='fa fa-spinner fa-spin s'></i>"); 
      target.prop( "disabled", true );
      self.tg = target;

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
*/
