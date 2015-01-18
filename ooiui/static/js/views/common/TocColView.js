var TocColView = Backbone.View.extend({
  tagName: 'ul',
  className: 'nav sidebar-nav navbar-collapse',
  initialize: function() {
    _.bindAll(this, "render", "menu", "addItem");
    var self = this;
    this.collection.fetch({success: function(collection, response, options) {
      self.render();
    }});
  },
  template: JST['ooiui/static/js/partials/TOC.html'],
  menu: function() {
    /*
    this.$el.metisMenu({
      toggle: true
    });
    */
  },
  addItem: function(view) {
    this.$el.append(view.el);
  },
  render: function() {
    var self = this;
    
    this.$el.html(this.template());
    this.collection.each(function(item) { 
      var view = new SidebarMenuItem({model: item});
      self.addItem(view);
    });
    this.menu();
  }
  //end
});
