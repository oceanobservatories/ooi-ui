var MapModel = Backbone.Model.extend({
  // Default attribute values
  defaults: {
    title: '',
    description: '',
    mapCenter: [41.505, -80.09],
    zoom: 3,
    maxZoom: 10,
    id:'map',
    completed: false
  }
});