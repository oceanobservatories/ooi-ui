var StatusUIIconAssetView = Backbone.View.extend({
  el: "#asset",
  template: JST['ooiui/static/js/partials/StatusUIIcon.html'],
});



//   initialize: function() {
//     _.bindAll(this, "render");
//     var self = this;
//     console.log("Fetching collection");
//     this.collection.fetch({
//       success: function(collection, response, options) {
//         self.render();
//       }
//     });
//   },
//   template: JST['ooiui/static/js/partials/StatusUIIcon.html'],
//   render: function() {
//     console.log("render called");
//     this.$el.html(this.template({collection: this.collection}));
//   }
// });
