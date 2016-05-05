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
        this.$el.append('<tr><td colspan="3" style="text-align:left">Asset Documents</td></tr>');

        //
        var alfrescoRecordView = this.collection.map(function(model) {
            if (model.get('type')  == "asset"){
                return (new AlfrescoRecordView({ model:model })).render().el;
            }

        });

        this.$el.append(alfrescoRecordView);
        if (this.collection.where({type:"asset"}).length === 0) {
            this.$el.append('<td colspan="3" style="text-align:center"><em>No documents found</em></td>');
        }

        //
        this.$el.append('<tr><td colspan="3" style="text-align:left">Cruise Documents</td></tr>');
        var alfrescoRecordView = this.collection.map(function(model) {
            if (model.get('type')  == "cruise" || model.get('type')  == "link"){
                return (new AlfrescoRecordView({ model:model })).render().el;
            }
        });

        this.$el.append(alfrescoRecordView);
        if (this.collection.where({type:"cruise"}).length === 0) {
            this.$el.append('<td colspan="3" style="text-align:center"><em>No documents found</em></td>');
        }

    }
});

var AlfrescoRecordView = ParentAlfrescoView.extend({
    tagName: 'tr',
    fontIcon: 'fa-download',
    initialize: function() {
        if (this.model.get('type') == "link"){
            this.fontIcon = "fa-external-link"
        }else{
            this.fontIcon = "fa-download"
        }
    },
    attributes: function(){
        return {
            'style': 'cursor:pointer'
        }
    },
    template: _.template('<td style="text-align:center"><a href="<%= url %>" target="_blank" title="<%= url %>"><i class="fa <%=this.fontIcon%>"></i></a></td><td title="<%= name %>"><%= name %></td><td style="text-transform: capitalize;"><%= type %></td>')
});
