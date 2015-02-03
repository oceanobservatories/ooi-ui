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

  //  className: "col-sm-12",
    //    template: JST['ooiui/static/js/partials/Chart.html'],

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
    this.$el.attr('class','chart').html(this.template(this.model.toJSON()));

    //render the chart itself using the Google Charts API
    var type = this.model.get('type');
    var data = this.model.get('data');
    var chart_container = this.$el.find('.chart-contents').get(0);
    var chart = new google.visualization[type](chart_container);
    chart.draw(data, {width: 700, height: 300});

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
     // console.log(i);

      var p = container.append('<p>').find('p').last(); //one <p> per row
      for(var j = 0; j < data.getNumberOfColumns(); j++){
       // console.log(i)
        if(j==0){
          var date = new Date(data.getValue(i,j))
          //console.log(date);
          var gdate = String(date.getFullYear()) + ','
          + String(date.getMonth())+','+ String(date.getDate())+',' 
          + String(date.getHours())+','+String(date.getMinutes())+','+ String(date.getSeconds()) 
         
          
          //console.log(gdate)  
          p.append('<input readonly type="text" value=' + gdate + '></input>')
        }else{
          p.append('<input value=' + data.getValue(i,j) + '></input>');
         // console.log(data.getValue(0,0));
        }
              
               
      }
    }

  },

  done: function(){
    //pick up data and save it into the model
    var data = this.model.get('data');
    //console.log(data);
    this.$('.edit-contents p').each(function(row_index){// for each row
      //console.log(row_index);
      
      $('input', this).each(function(col_index){ // for each column
       // console.log(col_index);
        var value = $(this).val();
        // first row is label, type string, remaining rows are numbers
        
       // console.log(row_index, col_index, value);
        if(col_index == 0){
          var result = value.split(",")
          //console.log(result.length);
          //value =parseInt(result[0])+','+ parseInt(result[1])+','+ parseInt(result[2])+','+ parseInt(result[3])+','+ parseInt(result[4])+','+ parseInt(result[5]);
          value = new Date(parseInt(result[0]),parseInt(result[1]),parseInt(result[2]),parseInt(result[3]),parseInt(result[4]),parseInt(result[5]));

          //console.log(value);
        }
        else if (col_index == 1){
          value = parseInt(value)
         // console.log(value)
        }
        else if (col_index == 2|| col_index == 3){ 
          
          value = String(value);
        }
        data.setCell(row_index, col_index, value);
       // console.log(row_index, col_index, value);
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
 
