"use strict";
/* M@Campbell - 02/10/2016
 * Parent class
 *
 * Will handle the setting up and tearing down of it's children.
 */


var ParentView = Backbone.View.extend({
    /* Parent class for the views.
     * @method: render()
     * @method: derender()
     */
    initialize: function() {
        _.bindAll(this, 'render', 'derender');
        this.$el.css({
            'opacity': 0,
            'transition': 'opacity .2s'
        });
        if(this.model) {
            this.colorTime();
        }
    },
    render: function() {
        // if there isn't an underlying model, just render the template w/o it.
        if (this.model) {
            this.$el.html(this.template(this.model.toJSON()));
        } else {
            this.$el.html(this.template());
        }
        this.$el.css({
            'opacity': 1
        });
        return this;
    },
    derender: function() {
        this.remove();
        this.unbind();
        if (this.model)
            this.model.off();
    }
});

var SystemAdminView = ParentView.extend({
    // this is a placeholder for now, if an entire page needs to be handled by this view,
    // then we'll consolidate.
});

var CacheTableView = ParentView.extend({
    template: _.template('<table class="table"><thead><th><td>Select</td><td>Key</td><td>TTL</td></thead><tbody></table>')
});
