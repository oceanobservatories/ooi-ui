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
        _.bindAll(this, 'render', 'derender', 'renderEach');
        this.$el.css({
            'opacity': 0,
            'transition': 'opacity .3s'
        });
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
        this.renderEach();
        return this;
    },
    renderEach: function() {
        // Implement Me!
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
    initialize: function() {
        var initContext = this;
    },
    template: _.template('<table class="table"><thead><tr><th>Delete</th><th>Cache Type</th><th>TTL</th></tr></thead><tbody></tbody></table>'),
    renderEach: function() {
        var cacheTableItem = this.collection.map(function(model) {
            return (new CacheTableItemView({model: model})).render().el;
        });
        if (cacheTableItem.length === 0) {
            cacheTableItem = '<tr><td colspan="3">The cache is currently empty.</td></tr>';
        }
        this.$el.find('tbody').append(cacheTableItem);
    }
});

var CacheTableItemView = ParentView.extend({
    tagName: 'tr',
    events: {
        'click .js-delete-item': 'clickDelete'
    },
    template: _.template('<td><div class="btn btn-danger js-delete-item" data-target="<%= key %>">Delete</div></td><td><%= name %>s</td><td><%= Math.round(TTL/3600)  %> hours remaining</td>'),
    clickDelete: function(e) {
        var key = this.$el.find(e.target).data('target');
        this.model.deleteCache({key: key});
        this.remove();
        ooi.trigger('cache:load', key);
    }
});
