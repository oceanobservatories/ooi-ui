"use strict";
/*
* ooiui/static/js/views/science/PlotEventListView.js
*
* Dependencies
* Partials
* - ooiui/static/js/partials/PlotEvent.html
*
* - ooiui/static/lib/backbone/backbone.js
* - ooiui/static/js/ooi.js
*
* Models
* - ooiui/static/js/models/science/PlotEventModel.js
*
* Usage
*/

var PlotEventListView = Backbone.View.extend({
    columns: [
        {
            name: 'id',
            label: 'ID'
        },
        {
            name: 'class',
            label: 'Event Class',
        },
        {
            name: 'event_type',
            label: 'Event Type'
        },
        {  
            name: 'start_date',
            label: 'Start Date'
        },
        {
            name: 'notes',
            label: 'Notes'
        },
        {
            name: 'event_description',
            label: 'Event Description'
        },
    ],
    className: "panel",
    events: {
    },
    initialize: function(options) {
                _.bindAll(this, "render");
            },
            template: JST['ooiui/static/js/partials/PlotEvent.html'],
            render: function() {
                var self = this;
                this.$el.html(this.template({collection: this.collection, columns: this.columns}));
                this.collection.each(function(eventModel){
                    var plotEventTableItemView = new PlotEventTableItemView({
                        columns: self.columns,
                        model: eventModel
                    });
                    self.$el.find('tbody').append(plotEventTableItemView.el);
                });
            }
});

var PlotEventTableItemView = Backbone.View.extend({
    tagName: 'tr',
    events: {
        'click': 'onClick'
    },
    initialize: function(options) {
        if(options && options.columns) {
            this.columns = options.columns;
        }
        this.listenTo(this.model, 'change', this.render);
        this.render();
    },
    onClick: function(event) {
        console.log("SOMETHING");
        window.open('/event/' + this.model.get('id'), '_blank');
    },
    template: JST['ooiui/static/js/partials/PlotEventTableItem.html'],
    render: function() {
        this.$el.html(this.template({model: this.model, columns: this.columns }));
    }
});
