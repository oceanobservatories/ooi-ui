"use strict";
/*
 *
 * ooiui/static/js/models/aa/AlertFilterView.js
 * Validation model for Alerts and Alarms Page.
 *
 * Dependencies
 * Partials
 * - ooiui/static/js/partials/compiled/alertPage.js
 * Libs
 * - ooiui/static/lib/underscore/underscore.js
 * - ooiui/static/lib/backbone/backbone.js
 * Usage
 * 
 */
Backbone.Validation.configure({
  forceUpdate: true
});

_.extend(Backbone.Validation.callbacks, {
  valid: function (view, attr, selector) {
    var $el = view.$('[name=' + attr + ']'),
      $group = $el.closest('.form-group');

    $group.removeClass('has-error');
    $group.find('.help-block').html('').addClass('hidden');
  },
  invalid: function (view, attr, error, selector) {
    var $el = view.$('[name=' + attr + ']'),
      $group = $el.closest('.form-group');

    $group.addClass('has-error');
    $group.find('.help-block').html(error).removeClass('hidden');
  }
});

var AlertFilterView = Backbone.View.extend({
  events: {
    /*'click #saveAlert': function (e) {
     e.preventDefault();
     this.submit();
     }*/
  },

  // Use stickit to perform binding between
  // the model and the view
  bindings: {
    '[name=array]': {
      observe: 'array',
      selectOptions: {
        collection: []
      },

      setOptions: {
        validate:false
      }
    },
    '[name=Platform]': {
      observe: 'Platform',
      setOptions: {
        validate: false
      }
    },
    '[name=Instrument]': {
      observe: 'Instrument',
      selectOptions:{
        collections: []
      },
      setOptions: {
        validate: false
      }
    },
    '[name=Email]': {
      observe: 'Email',
      setOptions: {
        validate: false
      }
    },
    '[name=Redmine]': {
      observe: 'Redmine',
      setOptions: {
        validate: false
      }
    },
    '[name=PhoneCall]': {
      observe: 'PhoneCall',
      setOptions: {
        validate: true
      }
    },

    '[name=TextMessage]': {
      observe: 'TextMessage',
      setOptions: {
        validate: false
      }
    },
    '[name=LogEvent]': {
      observe: 'LogEvent',
      setOptions: {
        validate: false
      }
    }
  },
  initialRender: function() {
    this.$el.html('<i class="fa fa-spinner fa-spin" style="margin-top:50px;margin-left:50%;font-size:90px;color:#337ab7;"> </i>');
  },
  initialize: function () {
    Backbone.Validation.bind(this);
    _.bindAll(this, "render","filterOptionsbyInstrument","showtypeoptions","showenabledoptions" );   
    var self = this;
    self.modalDialog = new ModalDialogView();
    //this.listenTo(this.collection, 'reset', function(){
    //self.render();
    //});
  },

  render: function () {
    var self = this;

    var AlertsFullCollectionPage = Backbone.PageableCollection.extend({
      model: AlertModel,
      url:"/api/aa/alerts",
      state: {
        pageSize: 20
      },
      mode: "client",
      parse: function(response, options) {
        //for the response after asset query
        if(response.alert_alarm_definition){
          return response.alert_alarm_definition;
        }
        else{
          return response
        }
      }
    });

    var pageablealerts = new AlertsFullCollectionPage();
    self.collection = pageablealerts;

    var HtmlCell = Backgrid.HtmlCell = Backgrid.Cell.extend({
      className: "html-cell",
      initialize: function () {
        Backgrid.Cell.prototype.initialize.apply(this, arguments);
      },
      render: function () {
        this.$el.empty();
        var rawValue = this.model.get(this.column.get("name"));
        var formattedValue = this.formatter.fromRaw(rawValue, this.model);
        this.$el.append(formattedValue);
        this.delegateEvents();
        return this;
      }
    });

    var columns = [
/*      {
        name: "uframe_filter_id", // The key of the model attribute
        label: "ID", // The name to display in the header
        editable: false, // By default every cell in a column is editable, but *ID* shouldn't be
        cell: "string"
      },*/
      {
        name: "id", // The key of the model attribute
        label: "ID", // The name to display in the header
        editable: false, // By default every cell in a column is editable, but *ID* shouldn't be
        cell: "string"
      },
      {
        name: "array_name", // The key of the model attribute
        label: "Array", // The name to display in the header
        editable: false, // By default every cell in a column is editable, but *ID* shouldn't be
        cell: "string"
      },
      {
        name: "instrument_name",
        label: "Instrument",
        editable: false,
        cell: "string",
        sortValue: function (model, colName) {
          return model.attributes[colName]['instrument_name'];
        }
      },
      {
        name: "stream",
        label: "Stream",
        editable: false,
        cell: "string"
      },
      {
        name: "instrument_parameter",
        label: "Parameter",
        editable: false,
        cell: "string"
      },
      {
        name: "instrument_parameter_pdid",
        label: "PDID",
        editable: false,
        cell: "string"
      },
      {
        name: "severity",
        label: "Severity",
        editable: false,
        cell: "string",
        formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
          fromRaw: function (rawValue, model) {
            return rawValue;
          }
        })
      },
/*      {
        name: "created_time",
        label: "Created",
        editable: false,
        cell: "string"
      },*/
      {
        name: "event_type",
        editable: false,
        label: "Type",
        cell: HtmlCell,
        formatter: _.extend({}, Backgrid.Cell.prototype, {
          fromRaw: function (rawValue, model) {
            //place holder right now for triggered events
            if(rawValue =='alarm'){
              return "<div style='text-align: center'>Alarm</div>";
            }
            else if(rawValue =='alert'){
              return "<div style='text-align: center'>Alert</div>";
            }
          }
        })
      },
      {
        name: "active",
        editable: false,
        label: "Active",
        cell: HtmlCell,
        formatter: _.extend({}, Backgrid.Cell.prototype, {
          fromRaw: function (rawValue, model) {
            //console.log(rawValue);
            //place holder right now for triggered events
            if(rawValue == 1){
              //return "Active";
              return "<div style='text-align: center'><i id='active_def' style='font-size:14px;float:right;padding-right: 20px;color:#3c763d' class='fa fa-thumbs-up'>Active</i></div>";
            }
            else if(rawValue == 0){
              //return "Disabled";
              return "<div style='text-align: center'><i id='active_def' style='font-size:14px;float:right;padding-right: 20px;color:#3c763d' class='fa fa-thumbs-down'>Disabled</i></div>";
            }
          }
        })
      },
      {
        name: "active",
        editable: false,
        label: "Enable/Disable",
        cell: HtmlCell,
        formatter: _.extend({}, Backgrid.Cell.prototype, {
          fromRaw: function (rawValue, model) {
            //console.log('Active Field');
            //console.log(rawValue);
            //console.log(model.attributes.retired);
            //place holder right now for triggered events
            if (model.attributes.retired == 0) {
              if (rawValue == 1) {
                return "<div style='text-align: center'><button type=\"button\" id=\"toggleActiveBtn\" class=\"btn btn-primary\">" +
                  "<i class=\"fa fa-minus-square\"></i> Disable Alert/Alarm" +
                  "</button></div>";
              }
              else if (rawValue == 0) {
                return "<div style='text-align: center'><button type=\"button\" id=\"toggleActiveBtn\" class=\"btn btn-primary\">" +
                  "<i class=\"fa fa-plus-square\"></i> Enable Alert/Alarm" +
                  "</button></div>";
              }
            }
            else {
              return "Retired";
            }
          }
        })
      },
      {
        name: "active",
        editable: false,
        label: "Notifications",
        cell: HtmlCell,
        formatter: _.extend({}, Backgrid.Cell.prototype, {
          fromRaw: function (rawValue, model) {
            //console.log('Notification Field');
            //console.log(rawValue);
            //console.log(model);
            //console.log(model.attributes.user_event_notification.use_redmine);
            //console.log(model.attributes.retired);
            //place holder right now for triggered events
            if (model.attributes.retired == 0) {
              if (model.attributes.user_event_notification.use_redmine) {
                return "<div style='text-align: center'><button type=\"button\" id=\"toggleNotificationBtn\" class=\"btn btn-primary\">" +
                  "<i class=\"fa fa-minus-square\"></i> Toggle Off" +
                  "</button></div>";
              }
              else if (!model.attributes.user_event_notification.use_redmine) {
                return "<div style='text-align: center'><button type=\"button\" id=\"toggleNotificationBtn\" class=\"btn btn-primary\">" +
                  "<i class=\"fa fa-plus-square\"></i> Toggle On" +
                  "</button></div>";
              }
            }
            else {
              return "Retired";
            }
          }
        })
      },
      {
        name: "retired",
        editable: false,
        label: "Retire",
        cell: HtmlCell,
        formatter: _.extend({}, Backgrid.Cell.prototype, {
          fromRaw: function (rawValue, model) {
            //console.log('Retired Field');
            //console.log(rawValue);
            //console.log(rawValue);
            //place holder right now for triggered events
            if(rawValue == 1){
              return "Retired";
            }
            else {
              return "<div style='text-align: center'><button disabled type=\"button\" id=\"toggleRetireBtn\" class=\"btn btn-primary\">" +
                "<i class=\"fa fa-bolt\"></i> Retire" +
                "</button></div>";
            }
          }
        })
      }
      /*,
      {
        name: "active",
        editable: false,
        label: "Acknowledge",
        cell: HtmlCell,
        formatter: _.extend({}, Backgrid.Cell.prototype, {
          fromRaw: function (rawValue, model) {
            //.log('Active Field');
            //console.log(rawValue);
            //console.log(model.attributes.retired);
            //place holder right now for triggered events
            if (model.attributes.retired == 0) {
              if (rawValue == 1) {
                return "<div style='text-align: center'><button disabled type=\"button\" id=\"ackAllInstancesBtn\" class=\"btn btn-primary\">" +
                  "<i class=\"fa fa-bolt\"></i> Ack All" +
                  "</button></div>";
              }
              else if (rawValue == 0) {
                return "<div style='text-align: center'><button type=\"button\" id=\"ackAllInstancesBtn\" class=\"btn btn-primary\">" +
                  "<i class=\"fa fa-bolt\"></i> Ack All" +
                  "</button></div>";
              }
            }
            else {
              return "Retired";
            }
          }
        })
      },
      {
        name: "active",
        editable: false,
        label: "Clear",
        cell: HtmlCell,
        formatter: _.extend({}, Backgrid.Cell.prototype, {
          fromRaw: function (rawValue, model) {
            //console.log('Active Field');
            //console.log(rawValue);
            //console.log(model.attributes.retired);
            //place holder right now for triggered events
            if (model.attributes.retired == 0) {
              if (rawValue == 1) {
                return "<div style='text-align: center'><button disabled type=\"button\" id=\"clearAllInstancesBtn\" class=\"btn btn-primary\">" +
                  "<i class=\"fa fa-bolt\"></i> Clear All" +
                  "</button></div>";
              }
              else if (rawValue == 0) {
                return "<div style='text-align: center'><button type=\"button\" id=\"clearAllInstancesBtn\" class=\"btn btn-primary\">" +
                  "<i class=\"fa fa-bolt\"></i> Clear All" +
                  "</button></div>";
              }
            }
            else {
              return "Retired";
            }
          }
        })
      }*/
    ];

    //add click event
    var ClickableRow = Backgrid.Row.extend({
      highlightColor: "#eee",
      events: {
        "click": "onClick",
        mouseover: "rowFocused",
        mouseout: "rowLostFocus"
      },
      onClick: function (e) {
        if ($(e.target).is('td')){
          ooi.trigger("deployrowclicked", this.model);  
        }        
        
        this.el.style.backgroundColor = this.highlightColor;

        // Clicked the toggle active/inactive button
        if (e.target.id=='toggleActiveBtn') {
          //console.log('clicked toggle active btn for def id: ' + this.model.attributes.id);
          ooi.trigger('alertToggleActiveFormViewTrigger:onClick',
            {
              model: this.model,
              active: this.model.attributes.active
            }
          );
        }

        // Clicked the toggle notification button
        if (e.target.id=='toggleNotificationBtn') {
          //console.log('clicked toggle notification btn for def id: ' + this.model.attributes.id);
          ooi.trigger('alertToggleNotificationFormViewTrigger:onClick',
            {
              model: this.model
            }
          );
        }

/*        // Clicked the ack all instances button
        if (e.target.id=='ackAllInstancesBtn') {
          //console.log('clicked ack all instances btn for def id: ' + this.model.attributes.id);
          ooi.trigger('alertAckAllFormViewTrigger:onClick',
            {
              model: this.model
            }
          );
        }

        // Clicked the clear all instances button
        if (e.target.id=='clearAllInstancesBtn') {
          //console.log('clicked clear all instances btn for def id: ' + this.model.attributes.id);
          ooi.trigger('alertClearAllFormViewTrigger:onClick',
            {
              model: this.model
            }
          );
        }*/

        //check to see if the condition met item has ben clicked and open triggered events
        if(e.target.id=='condition_met'){
          this.triggeredalertView = new TriggeredAlertDialogView();
          $('.container-fluid').first().append(this.triggeredalertView.el);

          this.triggeredalertView.show({
            instrument: "Instrument Name: "  + this.model.attributes.Instrument,
            recent: "<i>None at this time</i>",
            history: "<i style='color:#337ab7;' class='fa fa-spinner fa-spin fa-5x'></i>",
            variable: this.model.attributes.reference_designator,
            //ctype: "alert",
            //title: this.model.attributes.display_name,
            ack: function() { console.log("Closed");}
          });
        }
      },
      rowFocused: function() {
        this.el.style.backgroundColor = this.highlightColor;
      },
      rowLostFocus: function() {
        this.el.style.backgroundColor = '#FFF';
        //document.getElementById('toggleActiveBtn').style.display = "none";
      }
    });

    // Set up a grid to use the pageable collection
    var pageableGrid = new Backgrid.Grid({
      columns: columns,
      collection: pageablealerts,
      row: ClickableRow
    });

    // Render the grid and attach the root to your HTML document
    $("#alertslist").append(pageableGrid.render().el);

    // Initialize the paginator
    var paginator = new Backgrid.Extension.Paginator({
      collection: pageablealerts
    });

    // Render the paginator
    $("#alertslist").after(paginator.render().el);

    var AssetFilter = Backgrid.Extension.ClientSideFilter.extend({
      placeholder: "Search Alerts and Alarms",
      makeMatcher: function(query){
        var q = '';
        if(query!=""){
          q = String(query).toUpperCase();
        }
        return function (model) {
          var queryhit= false;
          if(model.attributes['instrument_name']){
            if(String(model.attributes['instrument_name']).toUpperCase().search(q)>-1){
              queryhit= true;
            }
          }
          if(model.attributes['description']){
            if(String(model.attributes['description']).toUpperCase().search(q)>-1){
              queryhit= true;
            }
          }
          if(model.attributes['array_name']){
            if(String(model.attributes['array_name']).toUpperCase().search(q)>-1){
              queryhit= true;
            }
          }
          if(model.attributes['priority']){
            if(String(model.attributes['priority']).toUpperCase().search(q)>-1){
              queryhit= true;
            }
          }
          return queryhit;
        };
      }
    });

    var filter = new AssetFilter({
      collection: pageablealerts
    });
    self.filter = filter;

    // Render the filter
    $("#alertslist").before(filter.render().el);
    // Add some space to the filter and move it to the right
    $(filter.el).css({float: "left", margin: "0px 10px 25px 0px"});
    $(filter.el).find("input").attr('id', 'alert_search_box');

    pageablealerts.fetch({reset: true,
      error: (function (e) {
        alert(' Service request failure: ' + e);
      }),
      complete: (function (e) {
        $('#loading_alerts').html('');
      })
    });    

    self.rownum = 1;

    //remove row
    $("#delete_row").click(function(){
      if(self.rownum == 2){
        $("#delete_row").hide();
      }
      if(self.rownum>1){
        $("#addr"+(self.rownum-1)).html('');
        self.rownum--;
      }
    });

    //needs model to stickit not using right now
    //this.stickit();
  },

 

  filterOptionsbyInstrument: function(instru_id,name){
    var self = this;
    return "<select class='form-control' data-container='body' id='conditions_dd"+this.rownum+"'><option value='m_lon'>Longitude</option><option value='m_lat'>Latitude</option><option value='sci_salinity'>Salinity</option><option value='sci_water_temp'>Temperature</option><option  value='sci_water_cond'>Water Speed</option><option value='sci_wave_height'>Wave Height</option><option value='sci_water_pressure'>Water Pressure</option></select>";
  },

  showtypeoptions:function(){
    return "<select data-show-icon='true' data-container='body' class='form-control' id='type_dd"+this.rownum+"'><option  data-icon='glyphicon-flag' value='alert'>Alert</option><option data-icon='glyphicon-exclamation-sign' value='alarm'> Alarm</option></select>";
  },

  showenabledoptions:function(){
    return "<select data-show-icon='true' data-container='body' class='form-control' id='enabled_dd"+this.rownum+"'><option data-icon='glyphicon-ok-sign' value='true'>True</option><option data-icon='glyphicon-minus-sign' value='false'> False</option></select>";
  },

  showenabledoperators:function(){
    return "<select data-show-icon='true' data-container='body' class='form-control' id='operator_dd"+this.rownum+"'><option value='>'>></option><option  value='<'> <</option><option  value='='> =</option><option  value='<>'> <></option><option  value='>='> >=</option><option  value='<='> <=</option><option  value='outside'> outside</option><option  value='inside'> inside</option></select>";
  }

});
