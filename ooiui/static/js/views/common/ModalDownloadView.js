var ModalDownloadView= Backbone.View.extend({
 
    hide: function() {
    this.$el.modal('hide');
  },
  initialize: function() {
    _.bindAll(this, "render", "show" );
    this.render();
  },
  show: function() {
    this.$el.find('#download-ok').modal('show');
  },
  template: JST['ooiui/static/js/partials/ModalDownload.html'],
  render: function() {
    this.$el.html(this.template());
  }
});

