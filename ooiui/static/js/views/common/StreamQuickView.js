"use strict";
/* M@Campbell - 12/03/2015
 * Parent class
 *
 * Will handle the setting up and tearing down of it's children.
 */


var ParentView = Backbone.View.extend({
    /* Parent class for the views.
     * @method: render()
     * @method: derender()
     * @method: colorTime()
     *  This is highly specific to this implementation.  If using this file
     *  elsewhere, consider removing this method and where it's used.
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
    colorTime: function() {
        // add a 'freshness' property to the model for easy styling.
        var time = new Date(this.model.get('end')),
            timeSinceEnd = new Date().getTime() - time.getTime(),
            twelve = 43200000,
            twentyFour = 86400000;
        if (timeSinceEnd <= twelve) {
            this.model.set({'freshness': 'twelve-hours'});
        } else if (timeSinceEnd < twentyFour) {
            this.model.set({'freshness': 'twenty-four-hours'});
        } else {
            this.model.set({'freshness': 'older'});
        }
    },
    derender: function() {
        this.remove();
        this.unbind();
        if (this.model)
            this.model.off();
    }
});


var StreamStatusBtnView = ParentView.extend({
    /* This view will render out the button hand handle the click event
     * @method: click(event)
     *
     * This view should be given the collection that will be used in
     * the modal view.
     *
     * The styling is handled by an attrs option that may be passed in.
     */
    events: {
        'click': 'click'
    },
    className: 'btnContainer',
    template: _.template('<button type="button"' +
                                 'class="btn"' +
                                 'data-toggle="modal"' +
                                 'data-target="#streamStatus">Data Stream Quick View</button>'),
    click: function(e) {
        e.preventDefault();

        // The click event will call up a new instance of the stream quick view modal
        // and pass in the collection stored IN the button.  (It's a loaded button).
        var streamQuickView = new StreamQuickView({collection: this.collection});

        // render out this entire view.
        streamQuickView.render();

        // then render out each stream into the modal.
        $.when(streamQuickView.renderEach()).done(function() {

            // since it doesn't matter where the modal gets added, lets just add
            // it to the body element.
            $('body').append(streamQuickView.el);
        });
    }
});


var StreamQuickView = ParentView.extend({
    /* This will handle the task of rendering out the stream status quick view.
     * @method: renderEach(count, array)
     *  This will begin the mapping of each model in the collection to
     *  a view.
     *  @param: array
     *      Represents the location (array) to render by.
     *  @param: isEng
     *      Boolen, renders engineering instrumnets if true.
     *
     * @method: filterBy()
     *  This method is called when an array item is clicked.  It'll then
     *  call the renderEach() method and rerender the table.
     *
     * @method: close()
     *  This will call the derender to remove the modal from the DOM.
     */
    events: {
        'click .btn-close': 'close',
        'click .array-select > span': 'filterBy',
        'click [type="checkbox"]': 'clickChkBox'
    },
    template: JST["ooiui/static/js/partials/StreamQuickView.html"],
    clickChkBox: function() {
        // yeah...just what it says.  Will re-render the streams when a checkbox is clicked.
        this.renderEach(null);
    },
    filterBy: function(e) {
        e.preventDefault();

        // assign the event target.
        var target = e.target;

        // re-render the table filtered by the targets data-value.
        this.renderEach($(target).data('value'));

        // remove the 'active' class from any other button, and give this
        // target a new 'active' class.
        this.$el.find('.active').removeClass('active');
        $(target).addClass('active');
    },
    renderEach: function(array) {
        /*
         * 0b0011: all time
         * 0b0010: recent 24 hours
         */

        var binTimeFilter = 0b0000,
            isEng = this.$el.find('#isEngChkBox').is(':checked');

        if (!array)
            array = this.$el.find('.active').data('value') || 'CE';

        // we'll need to only show 24 hours or earlier, older than 24 hours, or both.
        binTimeFilter = (this.$el.find('#is24HrChkBox').is(':checked') && binTimeFilter < 1) ? binTimeFilter+0b0001 : binTimeFilter;
        binTimeFilter = (this.$el.find('#isOldChkBox').is(':checked') && binTimeFilter < 2) ? binTimeFilter+0b0010 : binTimeFilter;

        // map the streams in the collection to their own view.
        var streamItems = this.collection.byArray(array).byEng(isEng).byEndTime(binTimeFilter).map(function(model) {
            return (new StreamQuickViewItem({model:model})).render().el;
        });

        // insert the streams into the templates div
        this.$el.find('.table-rows').html(streamItems);
        return this.$el;
    },
    close: function() {
        this.derender();

        // just incase the backdrop doesn't get the memo . . .
        $('.modal-backdrop').remove();
    }
});


var StreamQuickViewItem = ParentView.extend({
    /*  each stream is handled with this view.
     */
    tagName: 'tr',
    template: JST["ooiui/static/js/partials/StreamQuickViewItem.html"]
});
