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

var DataAdminView = ParentView.extend({
    // this is a placeholder for now, if an entire page needs to be handled by this view,
    // then we'll consolidate.
});


var DisableStreamView = ParentView.extend({
    events: {
        'click .js-disable-stream': 'clickDisableStream'
    },
    template: _.template('<div class="row">' +
                         '  <div class="col-md-6 col-sm-12"><h3>Instrument Availability Administration</h3>' +
                         '     <p>Select an Array, Platform, Assembly, or Instrument to disable from the list on the left, then click "Disable". ' +
                         '     The instrument will then be disabled for all streams for the entire site, including ' +
                         '     plotting, and searching.</p>' +
                         '  </div>' +
                         '  <div id="jsDisableGroup" "class="col-md-6 col-sm-12">' +
                         '      <h3>Nothing Selected</h3>' +
                         '      <div><em></em></div>' +
                         '      <div class="btn btn-warning js-disable-stream">Disable</div>' +
                         '  </div>' +
                         '</div>'),
    clickDisableStream: function(e) {
        e.preventDefault();
        var self = this;
        var dataValue = this.$el.find('#jsDisableGroup em').html();
        if (dataValue) {
            this.model.set({refDes: dataValue});
            this.model.save({}, {
                success: function() {
                    self.$el.find('#jsDisableGroup > h3').html('Nothing Selected');
                    self.$el.find('#jsDisableGroup em').html('');
                    ooi.trigger('toc:render');
                },
                error: function() {
                    alert("You've already disabled this");
                }
            });

        } else {
            alert('Please read the instructions on the page.');
        }
    }
});

var DisabledStreamsTableView = ParentView.extend({
    template: _.template('<table class="table"><thead><tr><th>Enable</th><th>Reference Designator</th></tr></thead><tbody></tbody></table>'),
    renderEach: function() {
        var disabledStreamsTableItem = this.collection.map(function(model) {
            return (new DisabledStreamsTableItemView({model: model})).render().el;
        });
        if (disabledStreamsTableItem.length === 0) {
            disabledStreamsTableItem = '<tr><td colspan="3">There are currently no disabled streams.</td></tr>';
        }
        this.$el.find('tbody').append(disabledStreamsTableItem);
    }
});

var DisabledStreamsTableItemView = ParentView.extend({
    tagName: 'tr',
    events: {
        'click .js-delete-item': 'clickDelete'
    },
    template: _.template('<td><div class="btn btn-success js-delete-item" data-target="<%= id %>">Enable Stream</div></td><td><%= refDes %></td></td>'),
    clickDelete: function(e) {
        var key = this.$el.find(e.target).data('target');
        this.model.destroy();
        this.remove();
        ooi.trigger('toc:render');
    }
});
