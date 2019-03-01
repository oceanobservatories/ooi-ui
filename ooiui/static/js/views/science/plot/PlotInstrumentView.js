/*
 * ooiui/static/js/views/science/plot/PlotInstrumentView.js
 * Simple List view for the selected streams
 *
 * Collection:
 *  - ooiui/static/js/models/science/StreamModel
 *  - StreamCollection subset
 */

var PlotInstrumentView = Backbone.View.extend({
  subviews: [],
  stream_method_list: [],
  events: {
    "click #stream_method_filter" : "renderFiltered",
    "click .dropdown-dc dt a" : "toggleFilter"
  },
  initialize: function() {
    this.initialRender();
  },
  initialRender: function() {
    //this.$el.html('<i class="fa fa-spinner fa-spin" style="margin-top:40px;margin-left:40%;font-size:90px;"> </i>');
    //this.emptyRender();
  },
  template: JST['ooiui/static/js/partials/science/plot/PlotInstruments.html'],
  render:function(){
    //base render class
    var self = this;
    self.stream_method_list = [];

    this.$el.html(this.template({collection:this.collection}));
    //this.collection = selected stream collection

    // console.log('In PlotInstrumentsView.js render method');
    // console.log(this.collection);

    if (this.collection.length === 0){
      self.emptyRender();
    }else{
      this.collection.each(function(model) {
        var subview = new PlotInstrumentViewItem({
          model: model,
          collection: collection
        });
        if(model.get('stream_method').lastIndexOf('bad', 0) !== 0){
          self.$el.find('tbody.table-contents').append(subview.$el);
          self.subviews.push(subview);
        }

        self.stream_method_list.push(model.get('stream_method'));
      });
      self.stream_method_list = _.uniq(self.stream_method_list).sort();
      console.log('self.stream_method_list');
      console.log(self.stream_method_list);
      $.each(self.stream_method_list, function(key, data){
        if(data.lastIndexOf('bad', 0) === 0){
          $('#stream_method_filter').append('<li><input type="checkbox" value="' + data + '" />' + data + '</li>')
        }else{
          $('#stream_method_filter').append('<li><input type="checkbox" value="' + data + '" checked />' + data + '</li>')
        }

      });

    }

  },
  renderFiltered:function(event){
    console.log('click a filter checkbox');
    console.log(event);
    if(event.checked === true) {
      event.checked = false;
    }else{
      event.checked = true;
    }

    var filter_list = [];
    $.each($('#stream_method_filter li input'), function(key, data){
      console.log(data);
      if(data.checked === true){
        filter_list.push(data.value)
      }
    });

    console.log('filter_list');
    console.log(filter_list);

    // Remove the existing rows
    $('.table-contents').find('tr').remove();

    var self = this;
    var filtered_collection = this.collection.byStreamMethod(filter_list);
    console.log('filtered_collection');
    console.log(filtered_collection);

    //this.$el.html(this.template({collection:filtered_collection}));
    //this.collection = selected stream collection

    // console.log('In PlotInstrumentsView.js render method');
    // console.log(this.collection);

    if (filtered_collection === 0){
      // self.emptyRender();
    }else{
      filtered_collection.each(function(model) {
        var subview = new PlotInstrumentViewItem({
          model: model,
          collection: filtered_collection
        });

        self.$el.find('tbody.table-contents').append(subview.$el);
        self.subviews.push(subview);

        // console.log('model.get(\'stream_method\')');
        // console.log(model.get('stream_method'));
        // if(filter_list.includes(model.get('stream_method'))){
        //   self.$el.find('tbody.table-contents').append(subview.$el);
        //   self.subviews.push(subview);
        // }
      });
      // $(".dropdown-dc dt a").on('click', function() {
      //   $(".dropdown-dc dd ul").slideToggle('fast');
      // });
    }
  },
  toggleFilter:function(event){
    $(".dropdown-dc dd ul").slideToggle('fast');
  },
  emptyRender:function(){
    $('#instruments-table').find('table').remove();
    $('#instruments-table').find('div').remove();
    $('#instruments-table').append('<p class="initial-text"><button type=\'button\' title=\'Show latest release changes.\' id=\'showReleaseChanges\' class=\'btn btn-default\' onclick=\'showTour(true);\' hidden>Loading...</button></p>');
    $('#instruments-table').append('<p class="initial-text"> How to plot data:</p>');
    $('#instruments-table').append('<p class="initial-text"> Step 1) Please select an instrument from the Data Catalog below using the <i style=\'font-size:14px;pointer-events: none;\' class=\'fa fa-plus-square\' aria-hidden=\'true\'></i> button.</p>');
    $('#instruments-table').append('<p class="initial-text"> Step 2) Click the Plotting tab above to configure and visualize your plot.</p>');
    ooi.trigger('show_tour',{forceIt: false});
  }
});

var PlotInstrumentViewItem = Backbone.View.extend({
  className: 'plot-instrument-view-item',
  tagName:"tr",
  events: {
  },
  events:{
    "click .stream-to-plot" : "onRemoveClick"
  },
  initialize: function() {
    this.render();
  },
  template: JST['ooiui/static/js/partials/science/plot/PlotInstrumentsItem.html'],
  render:function(){
    var self = this;
    this.$el.html(this.template({model:this.model}));



    // $(".dropdown dd ul li a").on('click', function() {
    //   $(".dropdown dd ul").hide();
    // });

    // function getSelectedValue(id) {
    //   return $("#" + id).find("dt a span.value").html();
    // }

    // $(document).bind('click', function(e) {
    //   var $clicked = $(e.target);
    //   if (!$clicked.parents().hasClass("dropdown")) $(".dropdown dd ul").hide();
    // });


  },
  onRemoveClick:function(evt){
    //console.log('evt');
    //console.log(evt);

    // Find the target's i.fa using the data-stream_uid autogenerated during construction
    var $targetButton = $('[data-stream_uid=' + $(evt.target).data('ref_des') + $(evt.target).data('stream_name') + ']');
    //console.log('targetButton');
    //console.log($targetButton);

    // Check the selected stream is not already selected
    if($targetButton.hasClass('fa-plus-square')){
      // Toggle plus to minus on button
      $targetButton.removeClass('fa-plus-square').addClass('fa-minus-square');

      // Add the selected stream to the plotting data models and enable plotting tabs
      var modelList = ooi.collections.allStreamCollection.where({'reference_designator': $(evt.target).data('ref_des'),'stream_name': $(evt.target).data('stream_name')});
      //console.log(modelList);
      if (!_.isUndefined(modelList) && modelList.length > 0) {
        $.when(ooi.collections.selectedStreamCollection.add(modelList)).done(function (ret) {
          console.log(ret);
          // $(evt.target).find('i').removeClass('fa-plus-square').addClass('fa-minus-square');

          ooi.trigger('update_catalog_list', {});
          ooi.showPlottingTabs();
        })
      }

      // Disable other streams from being plotted
      $('.stream-to-plot').not('[data-stream_name=' + $(evt.target).data('stream_name') + ']').prop('disabled', 'true');

    }else{
      // Toggle the minus to plus button
      $targetButton.removeClass('fa-minus-square').addClass('fa-plus-square');

      // Enable other streams to be plotted
      $('.stream-to-plot').removeAttr("disabled");

      // Clear the stream from plotting and hide the plotting tabs
      ooi.trigger('reset_catalog_list',{});

    }
  }
});
