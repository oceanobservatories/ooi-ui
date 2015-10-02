var ModalDownloadFailView= Backbone.View.extend({
 
    hide: function() {
    this.$el.modal('hide');
  },
  initialize: function() {
    _.bindAll(this, "render", "show" );
    this.render();
  },
  show: function(msg) {
    this.$el.find('#error-msg').html(msg);
    this.$el.find('#download-fail').modal('show');
  },
  template: JST['ooiui/static/js/partials/ModalDownloadFail.html'],
  render: function() {
    this.$el.html(this.template());
  }
});


