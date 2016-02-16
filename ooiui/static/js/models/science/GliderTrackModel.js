var GliderTrackModel = Backbone.Model.extend({
  urlRoot: '#',
  defaults: {
        enabled: false,
        arrayCodes:{
            "CP":"Coastal Pioneer",
            "CE":"Endurance & Cabled Array",
            "GP":"Station Papa",
            "GI":"Irminger Sea",
            "GA":"Argentine Basin",
            "GS":"Southern Ocean"
        }
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
