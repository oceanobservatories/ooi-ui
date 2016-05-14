/*
 * ooiui/static/js/views/science/plot/PlotControlView.js
 * Simple List view for the plot controls
 *
 * Collection:
 *  - ooiui/static/js/models/science/StreamModel
 *  - StreamCollection subset
 */

var PlotControlView = Backbone.View.extend({
  subviews: [],
  plotModel : new PlotControlModel({}), //plot style model containing the attributes
  events: {
    "click .plot-style-select" : "onPlotStyleSelect",  //on plot style change
    "click .plot-orientation-select" : "onPlotOrientationSelect",  //on plot oritentation change
    "click .plot-options-select input" : "onPlotOptionsSelect",  //on plot option change
    "change .plot-control-select-form .selectpicker" : "onPlotTypeSelect" //on plot type change
  },

  initialize: function() {
    this.initialRender();
  },
  initialRender: function() {
    //this.$el.html('<i class="fa fa-spinner fa-spin" style="margin-top:40px;margin-left:40%;font-size:90px;"> </i>');
    this.emptyRender();
  },
  emptyRender:function(){
    this.$el.html('<h5>Please Select an instrument</h5>');
  },
  template: JST['ooiui/static/js/partials/science/plot/PlotControls.html'],
  render:function(){
    //base render class
    var self = this;
    self.subviews = [];


    this.$el.html(this.template({plotModel:self.plotModel}));

    if (this.collection.length == 0){
      self.$el.find('.instrument-content').append('<h5>Please Select an instrument</h5>');
    }else{

      //setup instrument parameter selection
      var isInterpolated = this.collection.length == 2 ? true : false;
      //this.collection = selected stream collection
      this.collection.each(function(model) {
        var subview = new PlotInstrumentControlItem({
          model: model,
          isInterpolated: isInterpolated
        });
        //add the content
        self.$el.find('.instrument-content').append(subview.$el);
        self.subviews.push(subview);
      });

      this.cb(moment(this.collection.models[0].get('start')),
              moment(this.collection.models[0].get('end')));

      this.$el.find('#reportrange').daterangepicker({
          locale: {
            format: 'YYYY-MM-DD HH:mm'
          },
          timePicker: true,
          timePickerIncrement: 30,
          startDate: moment.utc(self.collection.models[0].get('start')).format('YYYY-MM-DD HH:mm'),
          endDate: moment.utc(self.collection.models[0].get('end')).format('YYYY-MM-DD HH:mm'),
          ranges: {
             'Yesterday - Today': [moment().subtract(1, 'days'), moment()]
          }
      }, this.cb);

      //plot type selection
      this.$el.find('#plotTypeSelect').selectpicker({
        style: 'btn-primary',
        size: 8
      });
    }
  },
  cb: function(start, end){
    if (!_.isUndefined(this.element)){
      this.element.find('span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
    }else{
      this.$el.find('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
    }
  },
  updateDateTimeRange: function(st,ed){
    //update the selected date range
    $('#reportrange').data('daterangepicker').setStartDate(st);
    $('#reportrange').data('daterangepicker').setEndDate(ed);
  },
  getDateTimeRange: function(){
    //update the selected date range
    var picker = $('#reportrange').data('daterangepicker')
    return {startDate:picker.startDate, endDate:picker.endDate};
  },
  onPlotStyleSelect: function(e){
    this.plotModel.set('plotStyle',$(e.target).data('value'));
    $(e.target).parent().find('.btn-primary').removeClass('btn-primary').addClass('btn-default')
    $(e.target).removeClass('btn-default').addClass('btn-primary')
    ooi.trigger('plotControlView:update_xy_chart',{model:this.plotModel});
  },
  onPlotOrientationSelect: function(e){
    this.plotModel.set('plotOrientation',$(e.target).data('value'));
    $(e.target).parent().find('.btn-primary').removeClass('btn-primary').addClass('btn-default')
    $(e.target).removeClass('btn-default').addClass('btn-primary')
    ooi.trigger('plotControlView:update_xy_chart',{model:this.plotModel});
  },
  onPlotOptionsSelect: function(e){
    this.plotModel.set($(e.target).val(),$(e.target).prop('checked'));
    ooi.trigger('plotControlView:update_xy_chart',{model:this.plotModel});
  },
  onPlotTypeSelect: function(e){
    this.plotModel.set('plotType',$(e.target).data('value'));
    ooi.trigger('plotControlView:update_xy_chart',{model:this.plotModel});
  },
  getSelectedParameters: function(){
    var self = this;
    var selectedParameterCollection = new ParameterCollection();

    _.each(self.subviews,function(view){
      _.each(view.subviews, function(subview){
        if (!_.isNull(subview.selectedParameter) && (subview.selectedParameter.get('is_x') || subview.selectedParameter.get('is_y'))){
          selectedParameterCollection.add(subview.selectedParameter);
        }
      });
    });

    //check that only 1 x/y is selected
    var xLen = selectedParameterCollection.where({'is_x':true})
    var yLen = selectedParameterCollection.where({'is_y':true})

    if ( _.isEmpty(xLen) || _.isEmpty(yLen) ){
      ooi.trigger('plot:error', {title: "incorrect inputs", message:"incorrect inputs selected, please select x or y for parameter"} );
      return null;
    }
    else if ( (xLen.length > 1) && (yLen.length > 1) ){
      ooi.trigger('plot:error', {title: "incorrect inputs", message:"incorrect inputs selected, please select only 1 parameter for x or y"} );
      return null;
    }else{
      return selectedParameterCollection;
    }
  }
});

/*
 * Creates the row item for the plot instrument control
 *
 * Collection:
 *  - ooiui/static/js/models/science/StreamModel
 *  - StreamCollection subset
 */
var PlotInstrumentControlItem = Backbone.View.extend({
  subviews : [],
  events: {
  },
  initialize: function(options) {
    this.isInterpolated = options.isInterpolated;
    this.render();
  },
  template: JST['ooiui/static/js/partials/science/plot/PlotInstrumentControlItem.html'],
  render:function(){
    //base render class
    var self = this;
    self.subviews = [];
    this.$el.html(this.template({model:this.model}));

    self.$el.find('.table-content').empty();

    for (var i = 0; i < 6; i++) {
      //adds the parameter dropdowns to the object
      var paramControl = new PlotInstrumentParameterControl({
        model: self.model,
        parameter_id: i,
        //count : this.isInterpolated ? 1 : 1  //add one if interpolated else make it 6 data series available
      })
      self.subviews.push(paramControl);
      self.$el.find('.table-content').append(paramControl.$el);
    }
    console.log(self.subviews.length);
  }
});


/* Creates the drop down list for the parameter selection
 * models:
 *  - ooiui/static/js/models/science/ParameterModel.js
 * Collection:
 *  - ooiui/static/js/models/science/ParameterModel.js  -parameter collection
 */
var PlotInstrumentParameterControl = Backbone.View.extend({
  collection: new ParameterCollection,
  selectedParameter: null,
  tagName: "<tr>",
  parameter_id: null,
  count : 1,
  events: {
    "change .selectpicker" : "onPlotParameterSelect", //on plot type change
    "click input" : "onInputChange"
  },
  initialize: function(options) {
    if ("parameter_id" in options){
      this.parameter_id = options.parameter_id;
    }
    if ("count" in options){
      this.count  = options.count;
    }

    this.render();
  },
  template: JST['ooiui/static/js/partials/science/plot/PlotInstrumentParameterControl.html'],
  isParameterDerived:function(i){
    var self = this;
    var isDerived = false;
    if (self.model.get("variables_shape")[i] == "function"){
      isDerived = true;
    }
    return isDerived;
  },
  isParameterValid:function(i){
    var self = this;
    var isValid = false;
    //separate one for time, to ensure we have it
    if (self.model.get("variables")[i] == "time"){
      return true;
    }

    //complex if statement...
    if ((self.model.get("variables_shape")[i] == "scalar" ||
         self.model.get("variables_shape")[i] == "function") &&
        self.model.get("units")[i] != "bytes" &&
        self.model.get("units")[i] != "counts" &&
        self.model.get("units")[i].toLowerCase().indexOf("seconds since") == -1 &&
        self.model.get("units")[i].toLowerCase() != "s" &&
        self.model.get("units")[i].toLowerCase() != "1" &&
        self.model.get("variables")[i].indexOf("_timestamp") == -1
        )
      {
      isValid = true;
      }
    return isValid;
  },
  render:function(){
    //base render class
    var self = this;
    //empty it before we start
    self.collection.reset();

    var count = 0
    _.each(this.model.get('parameter_id'),function(v,i){
      //console.log(i,self.model.attributes); //TODO update this
      if (self.isParameterValid(i)){
        //derived parameters
        self.collection.add(new ParameterModel({name:self.model.get('parameter_display_name')[i],
                                                units:self.model.get('units')[i],
                                                short_name:self.model.get('variables')[i],
                                                type:self.model.get('variable_type')[i],
                                                is_selected: false,
                                                is_derived: self.isParameterDerived(i),
                                                is_x: false,
                                                is_y: false,
                                                original_model: self.model,
                                                index_used: i
                                           }));
      }else{
        count+=1;
      }
    });

    this.$el.html(this.template({model:this.model,
                                 options:self.collection,
                                 id: this.parameter_id,
                                 parameterCount: this.count
                                 }));

    this.$el.find('.selectpicker').selectpicker({
      style: 'btn-primary',
      size: 8
    });

  },
  onInputChange:function(e){
    var self = this;
    //updates on radio select
    this.selectedParameter.set({is_x: $(e.target).hasClass('x-select'),
                                is_y: $(e.target).hasClass('y-select')})
  },
  onPlotParameterSelect:function(e){
    //
    var self = this;
    if ( !_.isUndefined($(e.target).find("option:selected").data('id')) ){
      //resets the radio button
      this.$el.find('input').prop('checked', false);
      //updates the selection
      this.selectedParameter = self.collection.where({short_name: $(e.target).find("option:selected").data('id')})[0];
      //sets the selection
      this.selectedParameter.set({is_selected:true});
      //allow the user to now select x/y options
      this.$el.find('input').prop("disabled", false);
    }else{
      //reset the disabled if its deselected
      this.$el.find('input').prop("disabled", true);
      this.$el.find('input').prop('checked', false);
      //
      this.selectedParameter.set({is_x:false, is_selected:true, is_y:false});
      this.selectedParameter = null;
    }
    //parameter has been update
    console.log('parameter changed',e);
  }
});













