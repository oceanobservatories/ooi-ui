var Charts = Backbone.Collection.extend({
  model: Chart,
  types: ['AreaChart', 'BarChart', 'ColumnChart', 'LineChart','PieChart','AnnotationChart']
});

