//"use strict";



var StatusUIIconView = Backbone.View.extend({
  events: {
    'click #list-view' : 'onListView',
    'click #table-view' : 'onTableView',
  },

  initialize: function() {
    _.bindAll(this, "render", "onListView", "onTableView", 'filter'); //, "onSync"
    this.initialRender();
    var self = this;
    
    this.listenTo(this.collection,'reset',function(){
      //not the best way to render
      //but I have to make a call to our db to get display names after fetch is called.
      //
      setTimeout(function(){
         self.render();
      },5000);
    });
      

    this.viewSelection = 'table';
  },

    // Spinner
  initialRender: function() {
    var self = this;
    console.log("Plot should be a spinner");
    // fetch the collection and set up drop downs using filtrify
    this.collection.fetch({reset: true,
           success: function(collection, response, options){ 

             for ( var t = 0; t < response['assets'].length; t++ ) {
                    $('#container_of_asset').append("<li id='"+response['assets'][t]['assetId']+"' data-Type='"+response['assets'][t].assetInfo['type']+"' data-Class='"+response['assets'][t]['class']+"' data-Owner='"+response['assets'][t].assetInfo['owner']+"'><span>Type: <i>"+response['assets'][t].assetInfo['type']+"</i></span><span>Class: <i>"+response['assets'][t]['class']+"</i></span><span>Owner: <i>"+response['assets'][t].assetInfo['owner']+"</span></li>");
                
      }

           self.filter(response);





        
               
          _.map(collection.models, function(model){
                             return model.get_display_name();
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


