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


    //this.listenTo(ooi, 'arrayItemView:arraySelect', this.triggerTOCClickA);
    //this.listenTo(ooi, 'platformDeploymentItemView:platformSelect',this.triggerTOCClickP);
    //this.listenTo(ooi, 'InstrumentItemView:instrumentSelect', this.triggerTOCClickI);
    //this.listenTo(ooi, 'streamItemView:streamSelect', this.changeStream);
    var self = this;


    self.modalDialog = new ModalDialogView();
    //this.listenTo(this.collection, 'reset', function(){
    self.render();
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
      {
        name: "uframe_filter_id", // The key of the model attribute
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
      {
        name: "created_time",
        label: "Created",
        editable: false,
        cell: "string"
      },
      {
        name: "stream",
        label: "Stream Name",
        editable: false,
        cell: "string"
      },
      {
        name: "description",
        label: "Description",
        editable: false,
        cell: "string"
      },
      {
        name: "event_type",
        editable: false,
        label: "Type",
        cell: HtmlCell,
        formatter: _.extend({}, Backgrid.Cell.prototype, {
          fromRaw: function (rawValue, model) {
            //place holder right now for triggered events
            if(rawValue =='alarm'){
              return "Alarm";
            }
            else if(rawValue =='alert'){
              return "Alert";
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
              return "<i id='active_def' style='font-size:20px;float:right;padding-right: 20px;color:#3c763d' class='fa fa-thumbs-up'>Active</i>";
            }
            else if(rawValue == 0){
              //return "Disabled";
              return "<i id='active_def' style='font-size:20px;float:right;padding-right: 20px;color:#3c763d' class='fa fa-thumbs-down'>Disabled</i>";
            }
          }
        })
      },
      {
        name: "active",
        editable: false,
        label: "O/I",
        cell: HtmlCell,
        formatter: _.extend({}, Backgrid.Cell.prototype, {
          fromRaw: function (rawValue, model) {
            console.log('Active Field');
            console.log(rawValue);
            console.log(model.attributes.retired);
            //place holder right now for triggered events
            if (model.attributes.retired == 0) {
              if (rawValue == 1) {
                return "<button type=\"button\" id=\"toggleActiveBtn\" class=\"btn btn-primary\">" +
                  "<i class=\"fa fa-plus-square\"></i> Disable Alert/Alarm" +
                  "</button>";
              }
              else if (rawValue == 0) {
                return "<button type=\"button\" id=\"toggleActiveBtn\" class=\"btn btn-primary\">" +
                  "<i class=\"fa fa-plus-square\"></i> Enable Alert/Alarm" +
                  "</button>";
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
            console.log('Retired Field');
            console.log(rawValue);
            //console.log(rawValue);
            //place holder right now for triggered events
            if(rawValue == 1){
              return "Retired";
            }
            else {
              return "<button type=\"button\" id=\"toggleRetireBtn\" class=\"btn btn-primary\">" +
                "<i class=\"fa fa-plus-square\"></i> Retire" +
                "</button>";
            }
          }
        })
      }
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
        ooi.trigger("deployrowclicked", this.model);
        this.el.style.backgroundColor = this.highlightColor;

        //check to see if the condtion met item has ben clicked and open triggered events
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
    $(filter.el).css({float: "right", margin: "0px 0px 25px 0px"});
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
