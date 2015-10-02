var GliderTrackModel = Backbone.Model.extend({
  urlRoot: '#',
  defaults: {
        reference_designator: "",
        type: "LineString",
        coordinates:[[]],
  }
});


var GliderTrackCollection = Backbone.Collection.extend({
  url: '/api/uframe/glider_tracks',
  model: GliderTrackModel,  
  parse: function(response) {
    if(response && response.gliders) {
      return response.gliders;
    }    
    return [];
  }
});
