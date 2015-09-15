var ModalRedmineSuccessView= Backbone.View.extend({
 
    hide: function() {
    this.$el.modal('hide');
  },
  initialize: function() {
    _.bindAll(this, "render", "show" );
    this.render();
  },
  show: function() {
    this.$el.find('#redmine-success').modal('show');
  },
  template: JST['ooiui/static/js/partials/ModalRedmineSuccess.html'],
  render: function() {
    this.$el.html(this.template());
  }
});