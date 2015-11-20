"use strict";
/*
 * ooiui/static/js/views/science/StreamTableView.js
 * View definitions to build a table view of streams
 *
 * Dependencies
 * Partials:
 * - ooiui/static/js/partials/StreamTable.html
 * - ooiui/static/js/partials/StreamTableItem.html
 * Libs
 * - ooiui/static/lib/underscore/underscore.js
 * - ooiui/static/lib/backbone/backbone.js
 * - ooiui/static/js/ooi.js
 * Usage
 */

var StreamTableView = Backbone.View.extend({
    columns: [
        {
            name: 'plot',
            label: ''
        },
        {
            name: 'download',
            label: ''
        },
        {
            name : 'array_name',
            label : 'Array'
        },
        {
            name : 'site_name',
            label : 'Site Name'
        },
        {
            name : 'platform_name',
            label : 'Platform Name'
        },
        {
            name : 'assembly_name',
            label : 'Node'
        },
        {
            name : 'display_name',
            label : 'Instrument'
        },
        {
            name : 'stream_name',
            label : 'Stream Identifier'
        },
        {
            name: 'stream_type',
            label: 'Stream Type'
        },
        {
            name: 'depth',
            label: 'Depth (m)'
        },
        {
            name: 'lat_lon',
            label: 'Lat / Lon (ddm)'
        },
        {
            name : 'start',
            label : 'Start Time'
        },
        {
            name : 'end',
            label : 'End Time'
        },
        {
            name: 'reference_designator',
            label: 'Reference Designator'
        }
    ],
    tagName: 'tbody',
    initialize: function() {
        _.bindAll(this, "render");
        this.listenTo(this.collection, 'reset', this.render);
        this.collection.on("add", this.addOne, this);
    },
    events: {
        'click th': 'sortBy'
    },
    sortBy: function(event) {
        event.stopPropagation();
        var eTarget = event.target;
        if ( !(eTarget.id.indexOf('plot') > -1 || eTarget.id.indexOf('download') > -1) ) {
            ooi.trigger('StreamTableHeader:sort', eTarget.id.split('-')[1]);
        }
    },
    template: JST['ooiui/static/js/partials/StreamTable.html'],
    render: function() {
        var self = this;
        this.$el.html(this.template({collection: this.collection, columns: this.columns}));
        this.$el.find('th').append('<i class="fa fa-sort-desc"></i>');
        this.$el.find('th#th-plot > i').remove();
        this.$el.find('th#th-download > i').remove();
        this.collection.each(function(model) {
           var streamTableItemView = new StreamTableItemView({
                    columns: self.columns,
                    model: model
                }),
                streamTableItemSubView = new StreamTableItemSubView({
                    model: model
                });
            self.$el.append(streamTableItemView.el);
            self.$el.append(streamTableItemSubView.render().el);
        });
    }
});

/*
model : StreamModel
*/
var StreamTableItemView = Backbone.View.extend({
    tagName: 'tr',
    attributes: function() {
        return {
            'valign': 'middle',
            'class': 'accordion-toggle stream-row',
            'data-toggle': 'collapse',
            'style': 'cursor: pointer;'
        }
    },
    events: {
        'click .download' : 'onDownload',
        'click .plot' : 'onRowClick'
    },
    initialize: function(options) {
        if(options && options.columns) {
            this.columns = options.columns;
        }
        this.listenTo(this.model, 'change', this.render);
        this.render();
    },
    onDownload: function(event) {
        event.stopPropagation();
        event.preventDefault();
        var option = $(event.currentTarget).attr("download-type");
        ooi.trigger('StreamTableItemView:onClick', {model: this.model, selection: option});
    },
    focus: function() {
        this.$el.addClass('highlight').siblings().removeClass('highlight');
    },
    template: JST['ooiui/static/js/partials/StreamTableItem.html'],
    render: function() {
        var attributes = this.model.toJSON();
        this.$el.html(this.template({attributes: this.attributes, model: this.model, columns: this.columns}));
        this.$el.attr('data-target', '#'+this.model.cid);
        var endDate = new Date(this.model.attributes.end);
        var timeSinceEndDate = new Date().getTime()-endDate.getTime();
        var endColumn = this.$el.find('.stream-end');
        if(timeSinceEndDate <= 1000*60*60*12){
            endColumn.addClass('twelve-hours');
        } else if(timeSinceEndDate < 1000*60*60*24){
            endColumn.addClass('twenty-four-hours');
        } else if(timeSinceEndDate >= 1000*60*60*24){
            endColumn.addClass('older');
        }
    },
    onRowClick: function(event) {
        event.stopPropagation();
        ooi.trigger('StreamTableItemView:onRowClick', this);
    },
});

var StreamTableItemSubView = Backbone.View.extend({
    tagName: 'tr',
    attributes: function() {
        return {
            'class': 'collapse'
        }
    },
    initialize: function() {
        "use strict";
        this.listenTo(this.model, 'change', this.render);
    },
    template: JST['ooiui/static/js/partials/StreamTableItemSubView.html'],
    render: function() {
        "use strict";
        this.$el.attr('id', this.model.cid);
        this.$el.html(this.template({model: this.model.toJSON()}));
        return this;
    }
});
