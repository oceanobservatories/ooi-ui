//var MapModelWrapper = OOI.RelationalModel.extend({
//  urlRoot: '/api/array',
//  relation: {
//    type: OOI.Relation.hasMany,
//    key: 'platformDeployments',
 //   collectionType: 'PlatformDeploymentCollection',
  //  reverseRelation: {
 //     key: 'array_id'
 //   }
 // }
//});

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


var MapCollection = Backbone.Collection.extend({
  model: MapModel

});
