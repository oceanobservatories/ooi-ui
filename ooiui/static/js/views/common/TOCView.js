var TOCView = Backbone.View.extend({
  tagName: 'ul',
  className: 'nav sidebar-nav navbar-collapse',
  initialize: function() {
    _.bindAll(this, "render", "addItem");
    var self = this;
    this.collection.fetch({success: function(collection, response, options) {
      self.render();
    }});
  },
  template: JST['ooiui/static/js/partials/TOC.html'],
  addItem: function(view) {
    this.$el.append(view.el);
  },
  render: function() {
    var self = this;
    
    this.$el.html(this.template());
    this.collection.each(function(item) { 
      var itemView = new TOCItemView({model: item});
      self.addItem(itemView);
    });
  }
});

var TOCItemView = Backbone.View.extend({
  tagName: 'li',
  events: {
    'click' : 'toggle'
  },
  initialize: function() {
    this.render();
  },
  template: JST['ooiui/static/js/partials/TOCItem.html'],
  getSubItems: function() {
    console.log("Getting subitems");
    if(this.model && this.model.relation && this.model.relation.type == OOI.Relation.hasMany) {
      var collection = this.model[this.model.relation.key];
      var subItemView = new TOCSubItemView({
        collection: collection
      });
      this.subItemView = subItemView;
    }
  },
  toggle: function(e) {
    e.preventDefault();
    this.$el.find('.nav').first().toggle('collapse');
    this.$el.find('.nav').first().toggleClass('collapse');
    console.log("Clicked");
    if(_.isUndefined(this.subItemView)) {
      this.getSubItems();
      this.$el.append(this.subItemView.el);
    }
  },
  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
  }
});

var TOCSubItemView = TOCView.extend({
  className: 'nav sidebar-nav-second-level',
  initialize: function() {
    _.bindAll(this, "render", "addItem");
    var self = this;
    this.collection.fetch({success: function(collection, response, options) {
      self.render();
    }});
  },
  render: function() {
    var self = this;
    this.$el.empty();
    this.collection.each(function(item) { 
      var itemView = new TOCItemView({model: item});
      self.addItem(itemView);
    });
  }
});

