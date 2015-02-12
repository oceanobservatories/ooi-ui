"use strict";
/*
 * ooiui/static/js/views/common/ChartView.js
 * View definitions for charts
 *
 * Dependencies
 * Partials
 * - ooiui/static/js/partials/Chart.html
 * Libs
 * - ooiui/static/lib/underscore/underscore.js
 * - ooiui/static/lib/backbone/backbone.js
 * - ooiui/static/js/ooi.js
 *
 * Usage
 */
var ChartOptionsView = Backbone.View.extend({
  className: "panel",
  template: JST['ooiui/static/js/partials/ChartOptions.html'],
  initialize: function(){
    _.bindAll(this, 'render');
    this.render();
  },
  updateSelection:function(model){
    console.log("update selected",updates);
  },
  render: function(){
    this.$el.html(this.template({model:this.model}));

    this.$('.list-group.checked-list-box .list-group-item').each(function () {
        
        // Settings
        var $widget = $(this),
            $checkbox = $('<input type="checkbox" class="hidden" />'),
            color = ($widget.data('color') ? $widget.data('color') : "primary"),
            style = ($widget.data('style') == "button" ? "btn-" : "list-group-item-"),
            settings = {
                on: {
                    icon: 'glyphicon glyphicon-check'
                },
                off: {
                    icon: 'glyphicon glyphicon-unchecked'
                }
            };
            
        $widget.css('cursor', 'pointer')
        $widget.append($checkbox);

        // Event Handlers
        $widget.on('click', function () {
            $checkbox.prop('checked', !$checkbox.is(':checked'));
            $checkbox.triggerHandler('change');
            updateDisplay();
        });
        $checkbox.on('change', function () {
            updateDisplay();
        });
          
        // Actions
        function updateDisplay() {
            var isChecked = $checkbox.is(':checked');
            // Set the button's state
            $widget.data('state', (isChecked) ? "on" : "off");

            // Set the button's icon
            $widget.find('.state-icon')
                .removeClass()
                .addClass('state-icon ' + settings[$widget.data('state')].icon);

            // Update the button's color
            if (isChecked) {
                $widget.addClass(style + color + ' active');
            } else {
                $widget.removeClass(style + color + ' active');
            }
        }

        // Initialization
        function init() {
            if ($widget.data('checked') == true) {
                $checkbox.prop('checked', !$checkbox.is(':checked'));
            }
            updateDisplay();
            // Inject the icon if applicable
            if ($widget.find('.state-icon').length == 0) {
                $widget.prepend('<span class="state-icon ' + settings[$widget.data('state')].icon + '"></span>');
            }
        }
        init();
    });
  }
});

var ChartView = Backbone.View.extend({
  tagName: 'div',
  
  template: JST['ooiui/static/js/partials/Chart.html'],

  events: {
    'click button.delete': 'remove',
    'click span.edit': 'edit',
    'click span.done': 'done'
  },
  
  initialize: function(){
    _.bindAll(this, 'render', 'unrender', 'remove','edit', 'done', 'toggleVisible');

    this.listenTo(this.model, 'visible', this.toggleVisible);

    this.model.bind('change', this.render);
    this.model.bind('remove', this.unrender);

    this.listenTo(ooi.models.mapModel, 'change', this.setMapView)
  },
  
  render: function(){
    //render the chart template
    //I think annotation charts will never to have predfined divs in the html. We have to limit the ammount of annotation charts
    this.$el.attr('class','chart').html(this.template(this.model.toJSON()));
    //render the chart itself using the Google Charts API
    var type = this.model.get('type');
    var data = this.model.get('data');

    var chart_container = this.$el.find('.chart-contents').get(0);

    //NOTE: changing find to append messing up the dynamic loading removes the remove button and edit button
    var chart = new google.visualization[type](chart_container);
    chart.draw(data, {width: 700, height: 300});

    google.visualization.events.addListener(chart, 'select', function(){
      var row = chart.getSelection()[0].row;
      // setSelection() removes the point, after the modal, from the graph so it doesn't cause the graph to freeze
      chart.setSelection();
      var date =  data.getValue(row,0)
      var date_t = moment(date).format("YYYY-MM-DDTHH:mm:ss")

      var annotationModel = new AnnotationModel()
        annotationModel.set({
        pos_x: date_t,
        pos_y: parseInt(data.getValue(row,1)),
        recorded_date: date_t,
        value: parseInt(data.getValue(row,1)),
        field_y: data.Pf[1].label,
        field_x: data.Pf[0].label,
        title:   data.getValue(row,2),
        comment: data.getValue(row,3)
      });

      console.log(data.getValue(row,2),data.getValue(row,3))

      var modalView = new AddAnnotationView({model: annotationModel });     
      $("#annotationView").html(modalView.el)

      if (data.getValue(row,2) != null){
        $("#annotationView").find('#titleInput').val(data.getValue(row,2));
      }
      if (data.getValue(row,3) != null){
        $("#annotationView").find('#comment-text').text(data.getValue(row,3));    
        $("#annotationView").find('#btnAddAnnotation').text('Update Annotation')  
      }
      modalView.show();
    });

    //when the chart is ready make all things good
    google.visualization.events.addListener(chart, 'ready', function(){      
      $('#chartContainer').removeClass("loader")
      $('#chartContainer').find('.chart-contents').css('visibility','visible');
    });

    return this;
  },

  unrender: function(){
    this.$el.remove();
  },

  remove: function(){
    if (confirm('Are you sure you want to remove this chart?')){
      this.model.destroy();
    }
  },

  edit: function(){
    //hide view area, show edit area
    this.$('.view-chart').addClass('hidden');
    this.$('.edit-chart').removeClass('hidden');

    // build inputs for chart edition
    var data = this.model.get('data');
    var container = this.$('.edit-contents');
    container.find('p').remove(); //remove previous input fields, if any
    for(var i = 0; i < data.getNumberOfRows(); i++){

      var p = container.append('<p>').find('p').last(); //one <p> per row
      for(var j = 0; j < data.getNumberOfColumns(); j++){
        if(j==0){
          var date = new Date(data.getValue(i,j))
          var gdate = String(date.getFullYear()) + ','
          + String(date.getMonth())+','+ String(date.getDate())+',' 
          + String(date.getHours())+','+String(date.getMinutes())+','+ String(date.getSeconds()) 
         
          
          p.append('<input readonly type="text" value=' + gdate + '></input>')
        }else{
          p.append('<input value=' + data.getValue(i,j) + '></input>');
        }   
      }
    }
  },

  done: function(){
    //pick up data and save it into the model
    var data = this.model.get('data');
    this.$('.edit-contents p').each(function(row_index){// for each row
      
      $('input', this).each(function(col_index){ // for each column
        var value = $(this).val();
        // first row is label, type string, remaining rows are numbers
        
        if(col_index == 0){
          var result = value.split(",")
          value = new Date(parseInt(result[0]),parseInt(result[1]),parseInt(result[2]),parseInt(result[3]),parseInt(result[4]),parseInt(result[5]));

        }
        else if (col_index == 1){
          value = parseInt(value)
        }
        else if (col_index == 2|| col_index == 3){ 
          
          value = String(value);
        }
        data.setCell(row_index, col_index, value);
      });
    });
    // trigger 'change' event manually since data.setCell() does not trigger it
    this.model.trigger('change');

    //show view area, hide edit area
    this.$('.view-chart').removeClass('hidden');
    this.$('.edit-chart').addClass('hidden');
  },

  toggleVisible: function() {
    var hidden =
      app.filter != 'AllChart' &&
      this.model.get('type') != app.filter;
    this.$el.toggleClass('hidden', hidden);
  }

});
 
