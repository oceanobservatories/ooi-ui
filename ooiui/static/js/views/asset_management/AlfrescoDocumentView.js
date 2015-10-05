// Parent class for asset views.
var ParentAlfrescoView = Backbone.View.extend({
    /* Parent class for the alfresco document views.
     *  - initialize()
     *  - render()
     *  - derender()
     */
    initialize: function() {
        _.bindAll(this, 'render', 'derender');
    },
    render: function() {
        if (this.model) { this.$el.html(this.template(this.model.toJSON())); } else { this.$el.html(this.template()); }
        return this;
    },
    derender: function() {
        this.remove();
        this.unbind();
        this.model.off();
    }
});

var AlfrescoTableBodyView = ParentAlfrescoView.extend({
    tagName: 'tbody',
    renderRecords: function() {
        'use strict';
        var alfrescoRecordView = this.collection.map(function(model) {
            return (new AlfrescoRecordView({ model:model })).render().el;
        });
        this.$el.append(alfrescoRecordView);
        if (this.collection.length === 0) {
            this.$el.append('<td colspan="2"><em>No documents found</em></td>');
        }
    }
});

var AlfrescoRecordView = ParentAlfrescoView.extend({
    tagName: 'tr',
    attributes: function(){
        return {
            'style': 'cursor:pointer'
        }
    },
    template: _.template('<td><a href="<%= url %>" target="_blank" title="<%= url %>">DL</a></td><td title="<%= name %>"><%= name %></td>')
});
