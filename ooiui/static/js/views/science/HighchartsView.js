"use strict";
/*
 * ooiui/static/js/views/science/HighchartsView.js
 */
var HighchartsView = Backbone.View.extend({
  initialize: function(options) {
    this.title = options && options.title || "Chart";
    this.title_style = options && options.title_style || {
    };
    this.subtitle = options && options.subtitle || "";
    this.initialRender();
    _.bindAll(this, "onClick");
  },
  initialRender: function() {
    this.$el.html('<i class="fa fa-spinner fa-spin" style="margin-top:80px;margin-left:50%;font-size:90px;"> </i>');
    return this;
  },
  onClick: function(e, point) {
    this.trigger('onClick', e, point);
  },
  render: function() {
    var self = this;
    /* We use the d3 formatter because it's easy */
    var formatter = d3.format(".2f");
    var uniqAxis = [];
    /* Generate uniqe axis for the series */

    var defaultsDates = null

    this.collection.each(function(model, i) {
      if (i==0){
        defaultsDates= [ model.get('xmin'), model.get('xmax')];
      }

      var axis = _.find(uniqAxis, function(item) {
        return item.title.text == model.get('axisName');
      });

      if(i % 2 === 0) {
        var opposite_val = true;
      }else{        
        var opposite_val = false;
      }
      

      if(_.isUndefined(axis)) {
        axis = {          
          labels: {
            format: '{value}',
            style: {
              color: Highcharts.getOptions().colors[i]
            }
          },
          title: {
            text: model.get('axisName'),
            style: {
              color: Highcharts.getOptions().colors[i]
            }
          },
          opposite:opposite_val
        };
        if (model.get('axisRange') && model.get('tickInterval')) {
          _.extend(axis,{
            min           : model.get('axisRange')[0],
            max           : model.get('axisRange')[1],
            tickInterval  : model.get('tickInterval')
          });
        }
        if (i > 0) {
          _.extend(axis,{
            gridLineWidth : 0 // don't show anything other than the 1st axis' grid lines
          });
        }
        uniqAxis.push(axis);
      }
    });

    /* Actually produce the chart */
    this.chart = new Highcharts.Chart({
      chart: {
        renderTo: this.el,
        events: {
          click: function(e) {
            self.onClick(e, this);
          },
        },
        alignTicks: false,      
        zoomType: 'xy'      
      },
      credits: {
        enabled: false
      },
      title: {
          text: self.title,
          style: self.title_style
      },
      subtitle: {
          text: self.subtitle
      },
      xAxis: {
          type: 'datetime',
          dateTimeLabelFormats: { // don't display the dummy year
            day: '%e %b %Y',
            week: '%e %b %Y',
            month: '%e %b %Y',
            year: '%Y'
          },
          title: {
              text: 'Date (UTC)'
          },
          min : defaultsDates[0],
          max : defaultsDates[1]
      },
      yAxis: uniqAxis,
      tooltip: {
        useHTML: true,
              formatter: function() {
                  var x = this.x;
                  var s = '';
                  s+='<p><b>Time: '+Highcharts.dateFormat('%Y-%m-%d %H:%M:%S UTC',  this.x) +'</b></p><p>';

                  _.each(self.chart.series,function(series) {
                    if (series.visible) {
                      // Assume the data is ordered by time.  Find the 1st value that is >= x.
                      var xy = _.find(series.data,function(o){return o.x >= x});
                      if (xy) {
                        s += '<span style="color: ' + series.color + ';">' + series.name + '</span>' + ': ' + formatter(xy.y) + ' ' + series.options.units + '</p>';
                      }
                    }
                  });
                  return s;
              },
          shared: true,
          crosshairs : [true,false]        
      },
      plotOptions: {        
        scatter: {
            marker: {
                radius: 5,
                states: {
                    hover: {
                        enabled: true,
                        lineColor: 'rgb(100,100,100)'
                    }
                }
            }            
        }
      },
      series: self.collection.map(function(model, i) {
        return {
          type: model.get('type'),
          name: model.get('name'),
          showInLegend: model.get('showInLegend'),
          color: model.get('color'),
          data: model.get('data'),
          units: model.get('units'),    
          yAxis: i,                             
          marker: {enabled: _.isUndefined(model.get('enableMarker')) ? false : model.get('enableMarker')}, // only dots are for direction
          states: {hover: {enabled: false}} // no highlighted dots
        };
      }),
      exporting: { //Enable exporting images
        enabled: true,
        enableImages: true
      }
    });
    this.trigger('rendered', this);
    return this;
  }
});