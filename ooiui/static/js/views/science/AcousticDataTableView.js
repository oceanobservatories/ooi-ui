"use strict";
/*
 * ooiui/static/js/views/science/AcousticDataTableView.js
 * View definitions to build a table view of acoustic data sets
 *
 * Dependencies
 * Partials:
 * - ooiui/static/js/partials/AcousticDataTable.html
 * - ooiui/static/js/partials/AcousticDataTableItem.html
 * Libs
 * - ooiui/static/lib/underscore/underscore.js
 * - ooiui/static/lib/backbone/backbone.js
 * - ooiui/static/js/ooi.js
 * Usage
 */

var AcousticDataTableView = Backbone.View.extend({
    columns: [
        {
            name : 'download',
            label : 'Download Data'
        },
        {
            name : 'filename',
            label : 'File Name'
        },
        {
            name : 'subsite',
            label : 'Subsite'
        },
        {
            name : 'sensor',
            label : 'Sensor'
        },
        {
            name : 'startTime',
            label : 'Start Time'
        },
        {
            name : 'endTime',
            label : 'End Time'
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
            ooi.trigger('AcousticDataTableHeader:sort', eTarget.id.split('-')[1]);
        }
    },
    template: JST['ooiui/static/js/partials/AcousticDataTable.html'],
    render: function() {
        var self = this;
        this.$el.html(this.template({collection: this.collection, columns: this.columns}));
        this.$el.find('th').append('<i class="fa fa-sort-desc"></i>');
        this.$el.find('th#th-download > i').remove();

        this.collection.each(function(model) {
            var acousticDataTableItemView = new AcousticDataTableItemView({
                columns: self.columns,
                model: model
            });
            self.$el.append(acousticDataTableItemView.el);
        });
    }
});

/*
model : AcousticDataModel
*/
var AcousticDataTableItemView = Backbone.View.extend({
    tagName: 'tr',
    attributes: function() {
        "use strict";
        return {
            'valign': 'middle',
            'class': 'stream-row'
        }
    },
    events: {
        'click .download' : 'onDownload',  
        'dblclick td'     : 'onDownload',
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
        var download_link_url = this.model.get('downloadUrl')
        window.open(download_link_url, '_blank');
    },
    focus: function() {
        this.$el.addClass('highlight').siblings().removeClass('highlight');
    },
    template: JST['ooiui/static/js/partials/AcousticDataTableItem.html'],
    render: function() {
        var attributes = this.model.toJSON();
        this.$el.html(this.template({attributes: this.attributes, model: this.model, columns: this.columns}));
    },
});
