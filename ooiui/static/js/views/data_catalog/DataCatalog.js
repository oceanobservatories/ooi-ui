// Parent class for asset views.
var DataCatalogParentView = Backbone.View.extend({
    /* Parent class for views.
     *  - initialize()
     *  - render()
     *  - derender()
     */
    initialize: function() {
        _.bindAll(this, 'render', 'derender');
    },
    render: function() {
        if (this.model) {
            this.$el.html(this.template(this.model.toJSON()));
        } else {
            this.$el.html(this.template());
        }

        return this;
    },
    derender: function() {
        this.remove();
        this.unbind();
        this.model.off();
    }
});
