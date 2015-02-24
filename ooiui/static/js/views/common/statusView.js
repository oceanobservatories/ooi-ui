var StatusModel = Backbone.Model.extend({

  defaults:{
    'name': "brian",
    'last': "smith"
  }
})

var StatusCollection = Backbone.Collection.extend({})



var StatusView= Backbone.View.extend({
  collection: StatusCollection,

  initialize: function(){
    _.bindAll(this, "render");
    this.render()
  },
  template: JST['ooiui/static/js/partials/statusItem.html'],


  render: function(){
    //this.$el.html(this.template({model: this.model}))
  
    this.$el.html(this.template({collection: this.collection}))
  }

})

