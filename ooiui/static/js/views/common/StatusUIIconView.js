"use strict";

var StatusUIIconView = Backbone.View.extend({
  subviews : [],
  //className: "panel",
  events: {
    'click #list-view' : 'onListView',
    'click #table-view' : 'onTableView',
  },

  initialize: function() {
    _.bindAll(this, "render", "onListView", "onTableView"); //, "onSync"
    this.initialRender();
    this.collection.fetch();
    this.collection.fetch({reset: true});
    var self = this;
    this.listenTo(this.collection, 'reset',function(){
      self.render();
    });
    this.viewSelection = 'table';
  },

    // Spinner
  initialRender: function() {
    console.log("Plot should be a spinner");
    this.$el.html('<i class="fa fa-spinner fa-spin" style="margin-left:50%;font-size:90px;"> </i>');
  },

  add: function(subview) {
    subview.render();
    this.subviews.push(subview);
    this.$el.find('#alert-container').append(subview.el);
  },

  onListView: function() {
    this.viewSelection = 'list';
    this.render();
  },

  onTableView: function() {
    this.viewSelection = 'table';
    this.render();
  },

  template: JST['ooiui/static/js/partials/StatusUIIcon.html'],
  render: function() {
    var self = this;
    this.$el.html(this.template());

    // List View
    if(this.viewSelection == 'list') {
      this.$el.find('#list-view').toggleClass('active');
      this.collection.each(function(model) { 
        var subview = new StatusUIAccordionView({
          model: model
        });    
        self.add(subview);
      })
    } 

    // Table View
    else {
      this.$el.find('#table-view').toggleClass('active');
      this.collection.each(function(model) {     
        var subview = new StatusUIItemView({
          model: model
        });    
        self.add(subview);
      })
    }
  }
});

