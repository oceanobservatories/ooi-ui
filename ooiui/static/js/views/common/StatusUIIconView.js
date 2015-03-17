"use strict";


var StatusUIIconView = Backbone.View.extend({

  initialize: function() {

    _.bindAll(this, "render");
    this.collection.fetch({reset: true});
    var self = this;
    this.listenTo(this.collection, 'reset',function(){

      console.log('listen to collection');
      console.log(this.collection);

      self.render();

    });


    // console.log('STatus view is called');
    // console.log(this.collection);
    // console.log(this.model);
  },
  template: JST['ooiui/static/js/partials/StatusUIIcon.html'],
  render: function() {

    console.log('model fecthed');
    console.log(this.model);
    console.log('Collection fecthed');
    console.log(this.collection);

    this.$el.html(this.template({collection: this.collection}));

  }
});
