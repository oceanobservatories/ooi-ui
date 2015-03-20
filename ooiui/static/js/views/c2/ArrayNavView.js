var ArrayNavView = Backbone.View.extend({

  initialize: function(){

  _.bindAll(this, "render");

  this.listenTo(this.collection, 'reset', function(){
    console.log(this.collection);
    this.render();
  });
  },
  render: function(){
    _(this.collection.models).each(function(model){
      console.log(model);
    $('#array_list').append('<div data-reference-designator='+ model.get('array_code')+' class="btn btn-default btn-sm" type="button" aria-label="...">'+ model.get('display_name')+'</div>');
    });
  }
});