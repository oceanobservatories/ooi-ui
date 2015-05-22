"use strict";
/*
* ooiui/static/js/views/c2/ArraySideBarView.js
* View definitions for charts
*
* Dependencies
* Libs
* - ooiui/static/lib/underscore/underscore.js
* - ooiui/static/lib/backbone/backbone.js
* - ooiui/static/js/ooi.js
* Models
*
* Usage
*/

var ArraySidebarView = Backbone.View.extend({
  // The el will be a <ul> tag
  tagName: 'ul',
  // <ul class="nav sidebar-nav navbar-collapse">
  className: 'nav sidebar-nav navbar-collapse',
  events: {
    'click a' : 'onClick',
    'click i' : 'onClick'
  },
  /*
   * When one of the links are clicked we trigger this method which gets the
   * data-id attribute in the tag and publishes a new event org:click with the
   * model_id as the parameter.
   */
  onClick: function(event) {
    //prevent double request
    event.preventDefault();
    // Get the array id from the tag attribute data-id
    //var array_id = parseInt($(event.target).attr('data-id'));
    var array_id = $(event.target).attr('data-id');
    var disp_name = event.target.text;
    if(disp_name == undefined){
        disp_name = event.target.parentElement.text;
    }
    if(event.target.id == "mission_link"){
      //command trigger
      this.MissionView = new MissionDialogView();
      $('.container-fluid').first().append(this.MissionView.el);

      this.MissionView.show({
        message: "None at this time",
        command_options: "",
        ack: function() { console.log("Closed"); }
      });
      $('.modal-title').html("<b>"+disp_name+' -- '+ array_id); 
    }
    else{
      // Publish a new method array:click with the array_id
      this.selectArray(array_id,disp_name.replace('[Missions]',''));
    }    
  },
  /*
   * During initialization of this view we fetch the collection and render when
   * it's complete.
   */
 initialize: function(options) {
    _.bindAll(this, "render");
    this.$el.html('<i style="color:#337ab7;padding: 165px;" class="fa fa-spinner fa-spin fa-5x"></i>');
    var self = this;
    this.collection.fetch({
      success: function(collection, response, options) {
        // If the fetch was successful, then we render
        //self.collection = response.arrays;
        self.render();
      }
    });
  },

  /*
  Clicking the table of contents of Arrays
  */
  selectArray: function(array_id,dis_name) {
    var that = this;
    //clear all
    this.clearallc2panels();

    this.$el.find("[data-id='" + array_id + "']").parent().parent().find('.selected').removeClass('selected');
    this.$el.find("[data-id='" + array_id + "']").parent().toggleClass('selected');
    
    $('#current_array_bc').remove();
    $('#current_platform_bc').remove();
    $('#current_instrument_bc').remove();
    $('#c2breakcrumb').append('<li id="current_array_bc"><a><b>Array:</b> '+dis_name+'</a></li>');

    $('#accordion').find('.panel-body').html('<i style="color:#337ab7;" class="fa fa-spinner fa-spin fa-5x"></i>');

    var ArrayplatformCollection = Backbone.PageableCollection.extend({
      url: '/api/c2/array/'+array_id+'/current_status_display',
      state: {
        pageSize: 10
      },
      mode: "client",
      parse: function(response, options) {
        this.trigger("pageabledeploy:updated", { count : response.count, total : response.total, startAt : response.startAt } );
        return response.current_status_display;
      }
    });

    var pageablePlatformsList = new ArrayplatformCollection();
    //Platform Panel
    pageablePlatformsList.fetch({reset: true,
      success: function(collection, response, options) {
          $('#collapseOne').find('.panel-body').html("<div id='datatable'></div>");
          that.arrayPlatformView = new ArrayPlatformsView({
          collection: collection
        });
      },
      error:function(collection, response, options) {
          var m = new ModalDialogView();
          m.show({
            message: "Error Getting Data",
            type: "danger",
          });
      }
    });

    //History Panel
    var Arrayhistoryist = new ArrayDataModel();
    Arrayhistoryist.url='/api/c2/array/'+array_id+'/history';

    Arrayhistoryist.fetch({
      success: function(collection, response, options) {
        $('#collapseTwo').find('.panel-body').html("<div id='array_history_tree' class='history_tree'></div>");
        that.arrayHistoryView = new ArrayHistoryView({
          collection: response.history
        });
      },
      error:function(collection, response, options) {
        var m = new ModalDialogView();
          m.show({
            message: "Error Getting Data",
            type: "danger",
          });
      }
    });

    //other views
    //not working now and requires login
    //var Arraymissionslist = new ArrayDataModel({url:''});
  },

  template: JST['ooiui/static/js/partials/ArraySideBar.html'],

  render: function() {
    this.$el.html(this.template({collection: this.collection}));
  },

  clearallc2panels: function(){
    //Array panels:
    $('#accordion').find('.panel-body').empty();
    //Platform panels:
    $('#accordionP').find('.panel-body').empty();
    //Instrument panels:
    $('#accordionI').find('.panel-body').empty();
  }
});
