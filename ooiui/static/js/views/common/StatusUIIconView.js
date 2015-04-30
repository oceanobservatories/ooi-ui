//"use strict";

var StatusUIIconView = Backbone.View.extend({
  events: {
    'click #list-view' : 'onListView',
    'click #table-view' : 'onTableView',
    'click #map-view' : 'onMapView'
  },

  initialize: function() {
    
    _.bindAll(this, "render", "onListView", "onTableView", 'filter','onMapView'); //, "onSync"
    
    this.initialRender();
    var self = this;
    this.listenTo(this.collection,'reset',function(){
      //not the best way to render
      //but I have to make a call to our db to get display names after fetch is called.
      setTimeout(function(){
        
        self.render();
      },5000);
    });
    this.viewSelection = 'table';
  },
  
  initialRender: function() {
    var self = this;

    // fetch the collection and set up drop downs using filtrify
    this.collection.fetch({
      reset: true,
        success: function(collection, response, options){ 

          //this is for filtrify AND THE full list of assets 
          for ( var t = 0; t < response['assets'].length; t++ ) {
              $('#container_of_asset').append("<li id='"+response['assets'][t]['assetId']+"' data-Type='"+response['assets'][t].assetInfo['type']+"' data-Class='"+response['assets'][t]['class']+"' data-Owner='"+response['assets'][t].assetInfo['owner']+"'><span>Type: <i>"+response['assets'][t].assetInfo['type']+"</i></span><span>Class: <i>"+response['assets'][t]['class']+"</i></span><span>Owner: <i>"+response['assets'][t].assetInfo['owner']+"</span></li>");
          }

          //this is a hidden table for the filter boxes using the flat json object (one call to assets)
          $('#datatable').bootstrapTable({
              data: response.assets,
              needFlatJSON: true,
              /*method: 'get',
              url: '/api/asset_deployment',*/
              cache: false,
              height: 300,
              striped: false,
              pagination: false,
              search: false,
              showColumns: false,
              showRefresh: false,
              minimumCountColumns: 0,
              responseHandler: function responseHandler(res) {
                  //return res.assets;
              },
              showFilter:false,
              showExport:false,
              columns: [/*{
                  field: 'state',
                  checkbox: true
              },*/ 
              {
                  field: 'display_name',
                  title: 'Name',
                  align: 'left',
                  valign: 'top',
                  sortable: true,
                  col:'display_name',
                  searchable: true
              },{
                  field: 'assetInfo',
                  title: 'Owner',
                  align: 'left',
                  valign: 'top',
                  sortable: true,
                  col:'owner',
                  object:true,
                  formatter:  function aFormatter(value) {
                      return value['owner'];
                  }
              },{
                  field: 'seriesClassification',
                  title: 'Series',
                  align: 'left',
                  valign: 'top',
                  sortable: true,
                  col:'seriesClassification',
                  visible:false
              },{
                  field: 'manufactureInfo',
                  title: 'Serial Number',
                  align: 'left',
                  valign: 'top',
                  sortable: true,
                  visible:false,
                  col:'serialNumber',
                  formatter:  function tFormatter(value) {
                      if(value == null){
                        return '';
                      }
                      else{
                        return value['serialNumber'];  
                      }
                  }
              },{
                  field: "launch_date_time",
                  title: "Date",
                  align: 'left',
                  valign: 'bottom',
                  col:'launch_date_time',
                  sortable: true
              },{
                  field: 'class',
                  title: 'Class',
                  align: 'left',
                  valign: 'bottom',
                  col:'class',
                  sortable: true
              },{
                  field: 'assetInfo',
                  title: 'Type',
                  align: 'left',
                  valign: 'top',
                  sortable: true,
                  col:'type',
                  formatter:  function eFormatter(value) {
                      return value['type'];
                  }
                  //sorter: priceSorter
              },{
                  field: 'assetInfo',
                  title: 'Description',
                  align: 'left',
                  valign: 'top',
                  //clickToSelect: false,
                  sortable:true,
                  col:'description',
                  formatter:  function aFormatter(value) {
                      return value['description'];
                  }
                  //events: operateEvents
              },{
                  field: 'assetId',
                  title: 'ID',
                  align: 'center',
                  visible: false,
                  valign: 'left',
                  col:'assetId',
                  sortable: true
              }],
              onPostHeader:function(newdata){
                    self.filter();  
                }
          });

          $('#filter-toolbar2').bootstrapTableFilter({
            connectTo: '#datatable',
            filterIcon: '<span class="fa fa-search">  </span>   Filter',
            refreshIcon: '<span class="glyphicon glyphicon-refresh"></span>',
            clearAllIcon: '<span class="glyphicon glyphicon-remove"></span>',
            filters:[
                  
                ],
                onSubmit: function() {
                    var t = '';
                }
            });

           //self.filter(response);
           _.map(collection.models, function(model){
              return model.get_display_name();
           });
      }
    });
    
    this.$el.html('<i class="fa fa-spinner fa-spin"  style="color:#337ab7;margin-left:50%;font-size:90px;"> </i>');
  },
  
  //this is for filtrify and the first callback
  /*filter: function(e){
     var self= this;
     this.ft = $.filtrify('container_of_asset', 'asset_search_filter', {
        callback: function(query, match, mismatch)
        {
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
  },*/
  
  //new filter
  filter:function(){

        var self = this;
        var data2 = $('#datatable').bootstrapTable('getData');

        //filter!!
        self.$el.find('#alert-container').html('');

        //filter out each model then pass it to a view to be rendered.
         _.each(data2, function(modelId){
          var ID = parseInt(modelId.assetId);
          var filtered = self.collection.findWhere({assetId:ID});

          //switch
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
          /*else if (self.viewSelection ==='map'){

              var filterview = new StatusUIItemView({
                model:filtered
              });
              
              self.$el.find('#alert-container').append(filterview.el);
          }*/
        });
  },
  
  add: function(subview) {
    this.$el.find('#alert-container').append(subview.el);
  },
  
  onListView: function() {
    this.viewSelection = 'list';
    //this.ft.reset();
    this.filter();
    //remove active class from table view
    this.$el.find('#table-view').removeClass('active');
    this.$el.find('.Hide').show();
  },
  
  onTableView: function() {
    this.viewSelection = 'table';
    //this.ft.reset();
    this.filter();
    this.$el.find('.Hide').hide();
  },


  onMapView: function() {
    //todo
    //this.filter();
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