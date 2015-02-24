var StatusModel = Backbone.Model.extend({

  defaults:{
    'display_name': "brian",
    'reference_designator': "smith"
  }
})

var StatusCollection = Backbone.Collection.extend({})



var StatusViews= Backbone.View.extend({
  el:'.content',

  collection: StatusCollection,

  initialize: function(){
    _.bindAll(this, "render");
    this.render()
    //console.log(this.collection)
    //this.listenTo(this.collection, 'add', this.addstatus)
    this.addstatus(this.collection)
  },
  //template: JST['ooiui/static/js/partials/statusItem.html'],


  render: function(){
    //this.$el.html(this.template({model: this.model}))
  
    //this.$el.html(this.template({collection: this.collection}))

  },

  addstatus:function(collection){
    console.log(collection)
    console.log('I LISTENED')
    _(collection.models).each(function(model){
      console.log(model)
      var statusView = new StatusView({model: model});
      //var status_elem= statusView.render()
      $('#status-view').append(statusView.el);
    })
  }

})

var StatusView= Backbone.View.extend({
  collection: StatusCollection,

  initialize: function(){
    _.bindAll(this, "render");
    this.render()
    //console.log(this.collection)
    //this.listenTo(this.collection, 'add', this.addstatus)

  },
  template: JST['ooiui/static/js/partials/statusItem.html'],


  render: function(){
    //this.$el.html(this.template({model: this.model}))
  
    this.$el.html(this.template({model: this.model}))
  },

  addstatus:function(){
    console.log('I LISTENED')
  }

})


