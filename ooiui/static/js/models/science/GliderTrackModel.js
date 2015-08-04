var GliderTrackModel = Backbone.Model.extend({
  urlRoot: '#',
  defaults: {
        reference_designator: "",
        type: "LineString",
        coordinates:[[]],
  }
});


var GliderTrackCollection = Backbone.Collection.extend({
  url: '/json/glider_tracks.json',
  model: GliderTrackModel,  
  parse: function(response) {
    if(response && response.glider) {
      return response.glider;
    }    
    return [];
  }
});
