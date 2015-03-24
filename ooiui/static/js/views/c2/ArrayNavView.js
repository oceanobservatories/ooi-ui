var ArrayNavView = Backbone.View.extend({
  // The el will be a <ul> tag
  tagName: 'div',
  // <ul class="nav sidebar-nav navbar-collapse">
  className: 'btn btn-default btn-sm',
  id: 'array-buttons',
  events: {
    'click button' : 'onClick'
  },

  onClick: function(event) {
    //prevent double request
    event.preventDefault();
    // Get the model id from the tag attribute data-id
    var array_id = $(event.target).attr('data-reference-designator');
    console.log('Array onClick: ' + array_id);
    this.selectArray(array_id);
  },

  initialize: function(){
    _.bindAll(this, "render", "selectArray");
    this.listenTo(this.collection, 'reset', function(){
      console.log(this.collection);
      this.render();
    });
    var refdes = ooi.models.arrayNavModel.get('array_code');
    if(refdes && refdes != '' && refdes != null) {
      console.log('refdes: ' + refdes);
      this.selectArray(refdes);
    }
  }
  ,
  selectArray: function(refdes) {
    console.log('selectArray: ' + refdes);
    //this.$el.find("[data-reference-designator='" + refdes + "']").self().toggleClass('selected');
    ooi.collections.platformStatusCollection.fetch(refdes);
    ooi.trigger('arraynav:click', refdes);
  },
  render: function(){
    _(this.collection.models).each(function(model){
      console.log(model);
      $('#array-buttons').append('<button data-reference-designator='+ model.get('array_code')+' type="button">'+ model.get('display_name')+'</button>');
    });
  }
});