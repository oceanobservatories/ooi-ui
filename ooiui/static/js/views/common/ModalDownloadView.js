var ModalDownloadView= Backbone.View.extend({
 
    hide: function() {
    this.$el.modal('hide');
  },
  initialize: function() {
    _.bindAll(this, "render", "show" );
    this.render();
  },
  show: function(url) {
    this.$el.find('#download-url').html('A link containing your data will be emailed to <b>' + url +'</b>');
    this.$el.find('#download-ok').modal('show');
  },
  template: JST['ooiui/static/js/partials/ModalDownload.html'],
  render: function() {
    this.$el.html(this.template());
  }
});

