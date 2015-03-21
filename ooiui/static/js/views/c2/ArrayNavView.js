var ArrayNavView = Backbone.View.extend({
  events: {
    'click button' : 'onClick'
  },

  onClick: function(event) {
    //prevent double request
    event.preventDefault();
    // Get the model id from the tag attribute data-id
    var array_id = $(event.target).attr('data-reference-designator');
    console.log('Array onClick: ' + array_id);
    // Publish a new method org:click with the model_id
    //this.render();
    this.selectArray(array_id);
  },

  initialize: function(){
    _.bindAll(this, "render");

    this.listenTo(this.collection, 'reset', function(){
      //console.log(this.collection);
      this.render();
    });
  }
  ,
  selectArray: function(refdes) {
    console.log('selectArray' + refdes);
    //this.$el.find("[data-reference-designator='" + refdes + "']").self().toggleClass('selected');
    ooi.trigger('arraynav:click', refdes);
  },
  render: function(){
    _(this.collection.models).each(function(model){
      //console.log(model);
      //$('#array_list').append('<div data-reference-designator='+ model.get('array_code')+' class="btn btn-default btn-sm" type="button" aria-label="...">'+ model.get('display_name')+'</div>');
    $('#array_list').append('<button data-reference-designator='+ model.get('array_code')+' class="btn btn-default btn-sm">'+ model.get('display_name')+'</button>');
    });
  }
});