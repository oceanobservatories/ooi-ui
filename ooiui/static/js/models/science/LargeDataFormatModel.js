"use strict"
/*
* ooiui/static/js/models/science/LargeDataFormatModel.js
*/

var LargeDataFormatModel = Backbone.Model.extend({
 urlRoot: '/api/get_large_format_data',
 defaults: {
   datetime: "",
   filename: "",
   url: "",
 }
});

var LargeDataFormatCollection = Backbone.Collection.extend({
 url: "/api/get_large_format_data",
 model: LargeDataFormatModel,
 parse: function(response) {
   if(response && response.data) {
     ooi.trigger("LargeDataCollection:updated", { count : response.count, total : response.total, startAt : response.startAt } );
     return response.data;
   }
   return [];
 }
});