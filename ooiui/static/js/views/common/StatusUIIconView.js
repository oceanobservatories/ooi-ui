//"use strict";



var StatusUIIconView = Backbone.View.extend({
  //className: "panel",
  events: {
    'click #list-view' : 'onListView',
    'click #table-view' : 'onTableView',
  },

  initialize: function() {
    _.bindAll(this, "render", "onListView", "onTableView", 'filter'); //, "onSync"
    this.initialRender();
       var self = this;
    this.listenTo(this.collection,'reset',function(){

      self.render();
    });
      

    this.viewSelection = 'table';
  },

    // Spinner
  initialRender: function() {
    var self = this;
    console.log("Plot should be a spinner");
    // fetch the collection and set up drop downs using filtrify
    this.collection.fetch({reset: true,
      complete: (function(e, collection){
        
        for ( var t = 0; t < e.responseJSON['assets'].length; t++ ) {
                    $('#container_of_asset').append("<li id='"+e.responseJSON['assets'][t]['assetId']+"' data-Type='"+e.responseJSON['assets'][t].assetInfo['type']+"' data-Class='"+e.responseJSON['assets'][t]['class']+"' data-Owner='"+e.responseJSON['assets'][t].assetInfo['owner']+"'><span>Type: <i>"+e.responseJSON['assets'][t].assetInfo['type']+"</i></span><span>Class: <i>"+e.responseJSON['assets'][t]['class']+"</i></span><span>Owner: <i>"+e.responseJSON['assets'][t].assetInfo['owner']+"</span></li>");
                
      }

        self.filter(e);

          }),
      success: function(collection, options){
        _.forEach(collection.models, function(model){
           model.get_display_name();


        });
             }
    });
    this.$el.html('<i class="fa fa-spinner fa-spin" style="margin-left:50%;font-size:90px;"> </i>');
    
  },
  filter: function(e){
     var self= this;
     this.ft = $.filtrify('container_of_asset', 'asset_search_filter', {
      callback: function(query, match, mismatch){
        //callback returns match ( i.e. a list of li elements with assetId)
        //remove all appended elements before filtering
        self.$el.find('#alert-container').html('');
        //filter out each model then pass it to a view to be rendered.
        //filter could be changed... 
        //depends on how the alerts are set up...
         _.each(match, function(modelId){
          var ID = parseInt(modelId.id);
          var filtered = self.collection.findWhere({assetId:ID});
            
         
        if(self.viewSelection === 'list'){
           var filterview = new StatusUIAccordionView({
               model: filtered
        });    
           self.$el.find('#alert-container').append(filterview.el);
        }else if (self.viewSelection ==='table'){

           var filterview = new StatusUIItemView({
               model:filtered
          
            });
            self.$el.find('#alert-container').append(filterview.el);
        }
        });
      }
     });
  },
    

    
    

  add: function(subview) {
    this.$el.find('#alert-container').append(subview.el);
  },

  onListView: function() {
    this.viewSelection = 'list';
    this.ft.reset();
    //remove active class from table view
    this.$el.find('#table-view').removeClass('active');
    this.$el.find('.Hide').show();
  },

  onTableView: function() {
    this.viewSelection = 'table';
    this.ft.reset();
    this.$el.find('.Hide').hide();

  },

  template: JST['ooiui/static/js/partials/StatusUIIcon.html'],
  render: function() {
    //render is called only once
    // filtriy callback is then used to render views
    var self = this;
    this.$el.html(this.template());
    this.$el.find('.Hide').hide();

    //set the table-view button as active on intial render
    this.$el.find('#table-view').toggleClass('active');
        this.collection.each(function(model) {     
        var subview = new StatusUIItemView({
          model: model
        });    
        self.add(subview);
      });
  }
});


