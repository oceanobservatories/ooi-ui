"use strict";
/*
 * ooiui/static/js/views/science/LargeDataTableView.js
 * View definitions to build a table view of streams
 *
 * Dependencies
 * Partials:
 * - ooiui/static/js/partials/StreamTable.html
 * - ooiui/static/js/partials/LargeDataTableItem.html
 * Libs
 * - ooiui/static/lib/underscore/underscore.js
 * - ooiui/static/lib/backbone/backbone.js
 * - ooiui/static/js/ooi.js
 * Usage
 */

var LargeDataTableView = Backbone.View.extend({
    columns: [
        {
            name: 'download',
            label: ''
        },
        {
            name : 'filename',
            label : 'Filename'
        }
    ],
    tagName: 'tbody',
    initialize: function() {
        this.initialRender();
    },
    initialRender: function() {
        this.$el.html('<i class="fa fa-spinner fa-spin" style="margin-left:50%;font-size:90px;"> </i>')
    },
    subviews: [],

    template: JST['ooiui/static/js/partials/LargeFormatDataTable.html'],
    render: function() {
        var self = this;
        self.subviews = [];
        this.$el.html(this.template({columns: this.columns}));
        // this.$el.find('th').append('<i class="fa fa-sort-desc"></i>');

        this.collection.each(function(model) {
           var subview = new LargeDataTableItemView({
                    columns: self.columns,
                    model: model
                });
            self.$el.find('tbody').append(subview.$el);
            self.subviews.push(subview);
        });
    },
    showError: function(error) {
        this.$el.html('<div><strong>'+error+'</strong></div></div>');
    }
});

var LargeDataTableItemView = Backbone.View.extend({
    tagName: 'tr',
    attributes: function() {
        return {
            'valign': 'middle',
            'class': 'accordion-toggle stream-row',
            'data-toggle': 'collapse',
            'style': 'cursor: pointer;'
        }
    },

    initialize: function(options) {
        if(options && options.columns) {
            this.columns = options.columns;
        }
        this.render();
    },

    template: JST['ooiui/static/js/partials/LargeFormatDataTableItem.html'],
    render: function() {
        this.$el.html(this.template({model: this.model, columns: this.columns}));
        this.$el.attr('data-target', '#'+this.model.cid);
    },
});
