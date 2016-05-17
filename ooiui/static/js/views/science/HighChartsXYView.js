"use strict";
/*
 * ooiui/static/js/views/science/HighchartsView.js
 */
var HighchartsScatterView = Backbone.View.extend({
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

      // var axis = _.find(uniqAxis, function(item) {
      //   return item.title.text == model.get('axisName');
      // });
    /* Actually produce the chart */
    this.chart = new Highcharts.Chart({
      chart: {
        renderTo: this.el,
        // height: $("#highcharts-view").height(),
        // width: $("#highcharts-view").height(),
        events: {
          click: function(e) {
            self.onClick(e, this);
          },
        },
        alignTicks: false,
        zoomType: 'xy',
        resetZoomButton: {
            position: {
                // align: 'right', // by default
                // verticalAlign: 'top', // by default
                x: 0,
                y: -30
            }
        }
      },
      credits: {
        enabled: false
      },
      title: {
          text: self.title,
          style: self.title_style
      },
      subtitle: {
          text: self.subtitle,
          style: {
                  color: "steelblue",
                  fontSize: "18px"
                }
      },
      xAxis: {
            id: self.collection.models[0].get('xaxisName'),
            labels: {
              format: '{value}',
            },
            title: {
              text: self.collection.models[0].get('xaxisName'),
            }
      },
      yAxis: {
          id:self.collection.models[0].get('axisName'),
          labels: {
            format: '{value}',
          },
          title: {
            text: self.collection.models[0].get('axisName'),
          }
      },
      tooltip: {
        useHTML: true,
              formatter: function() {
                  var x = this.x;
                  var y = this.y;
                  var s = '';
                  _.each(self.chart.series,function(series) {
                    if (series.visible) {
                      s += '<span style="color: ' + series.color + ';">' + self.collection.models[0].get('xaxisName') + '</span>' + ': ' + formatter(x) + ' ' + series.options.units + '</p>';
                      s += '<span style="color: ' + series.color + ';">' + self.collection.models[0].get('axisName') + '</span>' + ': ' + formatter(y) + ' ' + series.options.units + '</p>';
                    }
                  });
                  return s;
              },
          shared: true,
          crosshairs : [true,false]
        // headerFormat: '<b>{series.name}</b><br>',
        // pointFormat: '{point.x} {series.options.units}, {point.y} {series.options.units}'
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
          //type: model.get('type'),
          name: model.get('name'),
          //showInLegend: model.get('showInLegend'),
          //color: model.get('color'),
          data: model.get('data'),
          //units: model.get('units'),
          yAxis: 0, //i ?
          //marker: {enabled: _.isUndefined(model.get('enableMarker')) ? false : model.get('enableMarker'), "symbol": "circle"}, // only dots are for direction
          //states: {hover: {enabled: true}} // no highlighted dots
        };
      }),
      legend: {
          enabled: false
      },
      navigation: {
          buttonOptions: {
              enabled: false   // Hide the buttons
          }
      },
      exporting: { //Enable exporting images
        enabled: true,
        enableImages: true,
        chartOptions: {
            chart: {
                width: 800,
                height: 400
            }
        }
      }
    });
    this.trigger('rendered', this);
    return this;
  }
});
