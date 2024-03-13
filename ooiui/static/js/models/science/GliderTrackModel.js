var GliderTrackModel = Backbone.Model.extend({
  urlRoot: '#',
  defaults: {
        enabled: false,
        arrayCodes:{
            "CP0":"Coastal Pioneer CES",
            "CP1":"Coastal Pioneer MAB",
            "CE0":"Coastal Endurance",
            "RS0":"Cabled Array",
            "GP0":"Station Papa",
            "GI0":"Irminger Sea",
            "GA0":"Argentine Basin",
            "GS0":"Southern Ocean"
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
