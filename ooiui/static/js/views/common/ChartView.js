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

var ChartView = Backbone.View.extend({
  tagName: 'div',
  
  template: JST['ooiui/static/js/partials/Chart.html'],

  events: {
    'click button.delete': 'remove',
    'click span.edit': 'edit',
    'click span.done': 'done'
  },
  
  initialize: function(){
    _.bindAll(this, 'render', 'unrender', 'remove',
              'edit', 'done', 'toggleVisible');

    this.listenTo(this.model, 'visible', this.toggleVisible);

    this.model.bind('change', this.render);
    this.model.bind('remove', this.unrender);
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
        field_x: data.Pf[0].label          
      });
      var modalView = new AddAnnotationView({model: annotationModel });
      console.log(modalView);
      $("#annotationView").html(modalView.el)
      modalView.show();

      
    })
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
 
