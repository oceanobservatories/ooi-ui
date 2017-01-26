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
  plotModel : null, //plot style model containing the attributes
  plotDefaultModel: null,
  events: {
    "click  #addAdditionalPlotRow" : "addXYInputRow",
    "change .plot-control-select-form .selectpicker#plotTypeSelect" : "onPlotTypeSelect", //on plot type change
    "change .selectpicker#plotOrientation" : "onPlotOrientationSelect", //on plot orientation change
    "change .selectpicker#plotLineStyle" : "onPlotStyleSelect", //on plot style change
    "change .selectpicker#plotMultiOptions" : "onPlotOptionsSelect", //on plot options change
    "change .selectpicker#plotqaqc" : "onPlotQAQCSelect" //on plot qaqc change
  },

  initialize: function(options) {
    if ("plotModel" in options){
      this.plotModel = options.plotModel;
    }
    this.initialRender();
  },
  initialRender: function() {
    this.emptyRender();
  },
  emptyRender:function(){
    //this.$el.html('<p class="initial-text"> Please select an instrument from the Data Catalog below using the <i style="font-size:14px;pointer-events: none;" class="fa fa-plus-square" aria-hidden="true"></i> button.</p>');
    //this.$el.find('.plot-control-view .row').append('<p class="initial-text"> Click the Plot tab above to configure and visualize your plot.</p>')
  },
  addXYInputRow:function(){
    var hiddenRow = this.subviews[0].$el.find('tr[style="display: none;"]');
    if (hiddenRow.length != 0){
      $(hiddenRow[0]).css('display','table-row');
    }

    hiddenRow = this.subviews[0].$el.find('tr[style="display: none;"]');
    if (hiddenRow.length == 0){
      this.$el.find('#addMorePlotRows').css('display','none');
    }

  },
  template: JST['ooiui/static/js/partials/science/plot/PlotControls.html'],
  render:function(){
    //base render class
    var self = this;
    self.subviews = [];
    var isInterpolated = this.collection.length == 2 ? true : false;

    if (this.collection.length == 0){
      this.$el.html(this.template({plotModel:null}));
      //self.$el.find('.plot-control-view .row').append('<p class="initial-text"> Please select an instrument from the Data Catalog below using the <i style="font-size:14px;pointer-events: none;" class="fa fa-plus-square" aria-hidden="true"></i> button to begin plotting.</p>');
      //self.$el.find('.plot-control-view .row').append('<p class="initial-text"> Click the Plot tab above to configure and visualize your plot.</p>')
    }else{
      this.$el.html(this.template({plotModel:self.plotModel,
                                   isInterpolated: isInterpolated,
                                   plotDefaultModel: self.plotDefaultModel
                                  }));
      //this.collection = selected stream collection
      var controlView1 = new PlotInstrumentControlItem({
        model: this.collection.models[0],
        isInterpolated: isInterpolated,
        plotModel: self.plotModel,
        control: "controlView1"
      });
      //add the content
      self.subviews.push(controlView1);
      self.$el.find('.instrument-content').append(controlView1.$el);

      if (isInterpolated){
        var controlView2 = new PlotInstrumentControlItem({
          model: this.collection.models[1],
          isInterpolated: isInterpolated,
          plotModel: self.plotModel,
          control: "controlView2"
        });
        //add the content
        self.subviews.push(controlView2);
        self.$el.find('.instrument-content').append(controlView2.$el);
      }

      var st, ed;
      //figure out the start and end times available
      if (this.collection.length > 1 ){
        if ((moment.utc(self.collection.models[0].get('start'))).isBefore(moment.utc(self.collection.models[1].get('start')))){
          st = moment.utc(self.collection.models[0].get('start'));
        }else{
          st = moment.utc(self.collection.models[1].get('start'));
        }
        if ((moment.utc(self.collection.models[0].get('end'))).isAfter(moment.utc(self.collection.models[1].get('end')))){
          ed = moment.utc(self.collection.models[0].get('end'));
        }else{
          ed = moment.utc(self.collection.models[1].get('end'));
        }
      }else{
        st = moment.utc(self.collection.models[0].get('start'));
        ed = moment.utc(self.collection.models[0].get('end'));
      }

      var stClone = ed.clone();
      stClone = stClone.subtract(7,'d');
      this.cb(stClone, ed);

      this.$el.find('#reportrange').daterangepicker({
        minDate: st.format('YYYY-MM-DD HH:mm'),
        maxDate: ed.format('YYYY-MM-DD HH:mm'),
        startDate: stClone.format('YYYY-MM-DD HH:mm'),
        endDate: ed.format('YYYY-MM-DD HH:mm'),
        locale: {
            format: 'YYYY-MM-DD HH:mm'
        },
        alwaysShowCalendars: true,
        timePicker: true,
        timePickerIncrement: 30,
        ranges: {
           'Last 24 hours of Data': [ed.clone().subtract(1, 'days').format('YYYY-MM-DD HH:mm'), ed.format('YYYY-MM-DD HH:mm')],
           'Last 7 Days of Data': [ed.clone().subtract(6, 'days').format('YYYY-MM-DD HH:mm'),ed.format('YYYY-MM-DD HH:mm')],
           'Last 30 Days of Data': [ed.clone().subtract(30, 'days').format('YYYY-MM-DD HH:mm'), ed.format('YYYY-MM-DD HH:mm')],
           'All Data': [st.format('YYYY-MM-DD HH:mm'), ed.format('YYYY-MM-DD HH:mm')]

        }
      }, this.cb);

      //plot type selection
      this.$el.find('#plotTypeSelect').selectpicker({
        style: 'btn-primary',
        size: 8
      });

      //plot line style selection
      this.$el.find('#plotLineStyle').selectpicker({
        style: 'btn-primary',
        size: 8
      });


      //plot orientation selection
      this.$el.find('#plotOrientation').selectpicker({
        style: 'btn-primary',
        size: 8
      });

      //plot additional plot options
      this.$el.find('#plotMultiOptions').selectpicker({
        style: 'btn-primary',
        size: 8
      });

      this.$el.find('#plotqaqc').selectpicker({
        style: 'btn-primary',
        size: 8
      });


      if (this.collection.length > 1 ){
        var range1 = moment.range(moment.utc(self.collection.models[0].get('start')),
                                  moment.utc(self.collection.models[0].get('end')));


        var range2 = moment.range(moment.utc(self.collection.models[1].get('start')),
                                  moment.utc(self.collection.models[1].get('end')));

        if (!(range1.overlaps(range2))){
          ooi.trigger('plot:error', {title: "Interpolated Plot Error", message:"Interpolated date times don't overlap"} );
        }
      }


      if (self.plotModel.get('plotType') == "xy"){
        $('#addMorePlotRows').css('display','inline');
      }else{
        $('#addMorePlotRows').css('display','none');
      }

      self.setAdditionalParameterVisibility();
    }
  },
  setAdditionalParameterVisibility:function(){
    //if the additional parameters are hidden, hide the rows
    if ($('input#showAdditionalParameters[type="checkbox"]').is(":checked")){
      $('#plot-controls .parameter-select .dropdown-menu.open .additional-param').css('display','block');
    }else{
      $('#plot-controls .parameter-select .dropdown-menu.open   .additional-param').css('display','none');
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
    // console.log('updateDateTimeRange');
    // console.log(st);
    // console.log(ed);
    // console.log(this.plotModel);

    $('#reportrange').data('daterangepicker').setStartDate(st);
    $('#reportrange').data('daterangepicker').setEndDate(ed);
    this.cb(st, ed);
  },
  getDateTimeRange: function(){
    //update the selected date range
    var picker = $('#reportrange').data('daterangepicker');
    return {startDate:picker.startDate, endDate:picker.endDate};
  },
  onPlotStyleSelect: function(e){
    this.plotModel.set('plotStyle',$(e.target).val());
    ooi.trigger('plotControlView:update_xy_chart',{model:this.plotModel});
  },
  onPlotOrientationSelect: function(e){
    this.plotModel.set('plotOrientation',$(e.target).val());
    ooi.trigger('plotControlView:update_xy_chart',{model:this.plotModel});
  },
  onPlotOptionsSelect: function(e){
    var selected = $(e.target).val()
    var obj = {'invertY':false,'invertX':false,'showAnnotations':false,'showEvents':false};
    _.each(selected,function(selItem){
      obj[selItem] = true;
    });
    this.plotModel.set(obj);
    ooi.trigger('plotControlView:update_xy_chart',{model:this.plotModel});
  },
  onPlotTypeSelect: function(e){
    this.plotModel.set('plotType',$(e.target).val());
    ooi.trigger('plotControlView:change_plot_type',{model:this.plotModel});

    var defaultPlot = $(e.target).find('[value="'+$(e.target).val()+'"]').hasClass('not-default-plot-option');
    if (defaultPlot){
      ooi.trigger('plot:error', {title: "Plot Type Selection", message:"This plot type is not recommended for this instrument class. Proceeding with this plot type may lead to unexpected results."} );
    }
  },
  onPlotQAQCSelect: function(e){
    this.plotModel.set('qaqc',$(e.target).val());
    //ooi.trigger('plotControlView:update_xy_chart',{model:this.plotModel});
  },
  getSelectedParameters: function(selectedDataCollection){
    var self = this;

    var selectedParameterCollection = new ParameterCollection();

    _.each(self.subviews,function(view){
      _.each(view.subviews, function(subview){
        if (!_.isNull(subview.selectedParameter) && (subview.selectedParameter.get('is_x') ||
                                                     subview.selectedParameter.get('is_y') ||
                                                     subview.selectedParameter.get('is_z'))) {
          selectedParameterCollection.add(subview.selectedParameter);
        }
      });
    });
    //check that only 1 x/y/z is selected
    var xLen = selectedParameterCollection.where({'is_x':true})
    var yLen = selectedParameterCollection.where({'is_y':true})
    var zLen = selectedParameterCollection.where({'is_z':true})

    var referenceCount = 1;

    //special case for interpolated plot
    if (selectedDataCollection == 2){
      //ooi.trigger('plot:error', {title: "Unavailable Plot Selection", message:"Interpolated plotting is currently unavailable. If the problem persists, please email helpdesk@oceanobservatories.org"} );
      //return null;
      referenceCount = 2;
    }

    if (selectedParameterCollection.length == 0 || selectedDataCollection == 0){
        ooi.trigger('plot:error', {title: "Incorrect Inputs", message:"Please select an instrument and valid input parameters"} );
        return null;
    }else if (this.plotModel.get('plotType') == 'stacked'){
      if ( _.isEmpty(zLen) ){
        ooi.trigger('plot:error', {title: "Incorrect Inputs", message:"Incorrect inputs selected, please select only 1 parameter for color"} );
        return null;
      }
      else if ( (zLen.length > referenceCount )){
        ooi.trigger('plot:error', {title: "Incorrect Inputs", message:"Incorrect inputs selected, please select only 1 parameter for Color"} );
        return null;
      }
    }else if (this.plotModel.get('plotType') == "3d_scatter"){
      //require all inputs for 3d data plot
      if ((xLen.length != referenceCount) && (yLen.length != referenceCount) && (zLen.length != referenceCount)){
          ooi.trigger('plot:error', {title: "Incorrect Inputs", message:"Incorrect inputs selected, please select only 1 parameter for x, y and color"} );
        return null;
      }
    }else{
      if ( _.isEmpty(xLen) || _.isEmpty(yLen) ){
        ooi.trigger('plot:error', {title: "Incorrect Inputs", message:"Incorrect inputs selected, please select only 1 parameter for x or y"} );
        return null;
      }
      else if ( (xLen.length > referenceCount) && (yLen.length > referenceCount) ){
        ooi.trigger('plot:error', {title: "Incorrect Inputs", message:"Incorrect inputs selected, please select only 1 parameter for x or y"} );
        return null;
      }
    }

    return selectedParameterCollection;

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
    if ( "plotModel" in options){
      this.plotModel = options.plotModel;
    }

    if ( "control" in options){
      this.control = options.control;
    }

    this.isInterpolated = options.isInterpolated;
    this.render();
  },
  template: JST['ooiui/static/js/partials/science/plot/PlotInstrumentControlItem.html'],
  render:function(){
    //base render class
    var self = this;
    self.subviews = [];

    var selectedPlotType = self.plotModel.get('plotTypeOptions').where({value:self.plotModel.get('plotType')})[0]

    this.$el.html(this.template({ model:this.model, plotTypeModel: selectedPlotType, isInterpolated: self.isInterpolated }));

    self.$el.find('.table-content').empty();
    //gets the selected plot type configuration
    //adds condition for interpolated plot
    var rowCount = !self.isInterpolated ? selectedPlotType.get('num_inputs') : self.plotModel.get('interpolatedPlotCount');
    //make sure the number of inputs matches the number of rows
    var rowCount = rowCount > self.model.get('variables').length ? self.model.get('variables').length : rowCount;

    for (var i = 0; i < rowCount; i++) {
      //adds the parameter dropdowns to the object
      self.subviews.push(new PlotInstrumentParameterControl({
        hidden : (i > 1 && self.plotModel.get('plotType') == "xy") ? true : false ,
        model: self.model,
        parameter_id: i,
        plotTypeModel : selectedPlotType,
        control: this.control,
        isInterpolated: self.isInterpolated
      }));
      self.$el.find('.table-content').append(self.subviews[i].$el);
    }
  }
});


/* Creates the drop down list for the parameter selection
 * models:
 *  - ooiui/static/js/models/science/ParameterModel.js
 * Collection:
 *  - ooiui/static/js/models/science/ParameterModel.js  -parameter collection
 */
var PlotInstrumentParameterControl = Backbone.View.extend({
  hidden : false,
  collection: new ParameterCollection,
  selectedParameter: null,
  tagName: "tr",
  parameter_id: null,
  plotTypeModel: null,
  count : 0,
  events: {
    "change .selectpicker" : "onPlotParameterSelect", //on plot type change
    "click input" : "onInputChange"
  },
  initialize: function(options) {
    if ("parameter_id" in options){
      this.parameter_id = options.parameter_id;
    }

    if ("plotTypeModel" in options){
      this.plotTypeModel = options.plotTypeModel;
    }

    if ("hidden" in options){
      this.hidden = options.hidden;
    }

    if ("control" in options){
      this.control = options.control;
    }

    if ("isInterpolated" in options){
      this.isInterpolated = options.isInterpolated;
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
    }else{

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

    //complex if statement for parameters...
    if (
        (
          self.model.get("variables_shape")[i] == "scalar" ||
          self.model.get("variables_shape")[i] == "function" ||
          self.model.get("variables_shape")[i] == "boolean" ||
          self.model.get("variables_shape")[i] == "array1d"
        ) &&
        self.model.get("units")[i] != "bytes" &&
        self.model.get("units")[i] != "counts" &&
        self.model.get("units")[i].toLowerCase().indexOf("seconds since") == -1
        //self.model.get("units")[i].toLowerCase() != "s" &&
        //self.model.get("variables")[i].indexOf("_timestamp") == -1
        )
      {
      isValid = true;
      }
    return isValid;
  },

  isEngineeringValid: function(i){
    var self = this;
    var isValid = false;
    //complex if statement for ENG parameters...
    if (self.model.get("units")[i].toLowerCase().indexOf("seconds since") == -1 &&
        self.model.get("variables")[i].indexOf("_timestamp") == -1)
      {
      isValid = true;
      }
    return isValid;
  },
  isAdditionalTimestamp: function(i){
    var self = this;
    if (self.model.get("variables")[i] != "time" &&
      self.model.get("units")[i].toLowerCase().indexOf("seconds since") == 0)
      return true
  },
  render:function(){
    //base render class
    var self = this;
    //empty it before we start
    self.collection = new ParameterCollection();

    var count = 0;
    var containsTimeVariable = $.inArray("time", self.model.get("variables"));

    //get the basic set of parameters, and see if
    _.each(this.model.get('parameter_id'),function(v,i){

      var paramModel = new ParameterModel({name:self.model.get('parameter_display_name')[i],
                                                units:self.model.get('units')[i],
                                                short_name:self.model.get('variables')[i],
                                                type:self.model.get('variable_type')[i],
                                                is_selected: false,
                                                param_class: "",
                                                is_derived: self.isParameterDerived(i),
                                                is_x: false,
                                                is_y: false,
                                                is_z: false,
                                                original_model: self.model,
                                                index_used: i
                                           });


      if(containsTimeVariable >= 0){
        if (self.isParameterValid(i) && !_.isEmpty(self.model.get('parameter_display_name')[i])){
          //derived parameters
          self.collection.add(paramModel);
        }else if (self.isAdditionalTimestamp(i) && !_.isEmpty(self.model.get('parameter_display_name')[i])){
          //other parameters
          paramModel.set({param_class:"additional-param"});
          self.collection.add(paramModel);
        }else{
          //number of parameters not added
          // console.log('parameter id skipped: '+i+' >>> display_name: '+self.model.get('parameter_display_name'));
          count+=1;
        }
      }else{
        self.collection.add(paramModel);
      }
    });

    this.$el.html(this.template({model:this.model,
                                 options:self.collection,
                                 id: this.control+"_"+this.parameter_id,
                                 parameterCount: 1,
                                 plotTypeModel : this.plotTypeModel
                                 }));

    this.$el.find('.selectpicker').selectpicker({
      style: 'btn-primary',
      size: 8
    });

    if (self.hidden){
      self.$el.css('display','none');
    }
  },
  onInputChange:function(e){
    var self = this;
    //updates on radio select
    this.selectedParameter.set({is_x: $(e.target).hasClass('x-select'),
                                is_y: $(e.target).hasClass('y-select'),
                                is_z: $(e.target).hasClass('z-select')
                              })
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

      //only if the option is selected
      //use the plot type to figure out the inputs available
      var availableInputs = this.plotTypeModel.get('inputs');
      if (this.plotTypeModel.get('value') == "xy"){
        if (this.parameter_id == 0){
          this.$el.find('input.x-select').prop('checked',true);
          this.selectedParameter.set({is_x: true,
                                      is_y: false,
                                      is_z: false
                                    })
        }else{
          this.$el.find('input.y-select').prop('checked',true);
          this.selectedParameter.set({is_x: false,
                                      is_y: true,
                                      is_z: false
                                    })
        }
      }else if (this.plotTypeModel.get('value') === 'stacked'){
        this.$el.find('input').prop('checked', true);
        this.$el.find('input').prop("disabled", true);
        this.selectedParameter.set({is_x: false,
                                    is_y: false,
                                    is_z: true});
      }else{
        //specific number of inputs use the input number to set the category
        if (this.parameter_id == 0){
          this.$el.find('input.x-select').prop('checked',true);
          this.selectedParameter.set({is_x: true,
                                      is_y: false,
                                      is_z: false
                                    })

        }else if (this.parameter_id == 1){
          this.$el.find('input.y-select').prop('checked',true);
          this.selectedParameter.set({is_x: false,
                                      is_y: true,
                                      is_z: false
                                    })

        }else if (this.parameter_id == 2){
          this.$el.find('input.z-select').prop('checked',true);
          this.selectedParameter.set({is_x: false,
                                      is_y: false,
                                      is_z: true
                                    })
        }
      }

    }else{
      //reset the disabled if its deselected
      this.$el.find('input').prop("disabled", true);
      //resets the radio button (unless its a stacked plot)
      if (this.plotTypeModel.get('value') === 'stacked'){
        this.$el.find('input').prop('checked', true);
      }else{
        this.$el.find('input').prop('checked', false);
      }
      //
      this.selectedParameter.set({is_x:false, is_selected:true, is_y:false, is_z:false});
      this.selectedParameter = null;
    }
    //parameter has been updated
  }
});













