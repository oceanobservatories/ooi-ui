var Workspace = Backbone.Router.extend({
  routes:{
    '*filter': 'setFilter'
  },

  setFilter: function( param ) {
    var filter = param.trim();
    if (filter){
      app.filter = filter.substring(0,filter.length - 1); //remove trailing 's'
      app.filterAll(filter);
    }
  }
});
