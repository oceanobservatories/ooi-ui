// Parent class for asset views.
var DataCatalogParentView = Backbone.View.extend({
    /* Parent class for views.
     *  - initialize()
     *  - render()
     *  - derender()
     */
    initialize: function(options) {
        _.bindAll(this, 'render', 'derender', 'onBeforeRender', 'onAfterRender');

        this.onBeforeRender();
        this.listenTo(this, 'render', this.onAfterRender);
        this.options = options;

    },
    onBeforeRender: function(callback) {
        return callback;
    },
    render: function() {
        try {
            if (this.template) {
                if (this.model) {
                    this.$el.html(this.template(this.model.toJSON()));
                } else {
                    this.$el.html(this.template());
                }
            } else {
                console.log('[!] Warning: No template defined for', this);
            }

            this.trigger('render');
            return this;

        } catch (exception) {
            throw ('Unhandled Exception: ' + exception);
        }
    },
    onAfterRender: function(callback) {
        return callback;
    },
    derender: function() {
        this.remove();
        this.unbind();
        this.model.off();
    }
});
