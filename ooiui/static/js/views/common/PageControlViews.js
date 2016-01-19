'use strict';

/* author: M@Campbell
 * 10/20/2015
 *
 * Views for any page that needs special controls.
*/


// Parent view for all the page controls.
var ParentPageControlView = Backbone.View.extend({
    /* - initialize()
     * - render()
     * - derender()
     *
     * - loadControls() : Customize this function for each page if you want.
     */
    initialize: function() {
        _.bindAll(this, 'render', 'derender', 'click', 'change');
    },
    events: {
        'click span': 'click',
        'change select': 'change'
    },
    // this template will loop through each of the parameters defined in the
    // instantiaed model and create a <option> tag in the select element with
    // an id of the actual search term.
    template: _.template('<% _.each(params, function(item) { %> <span id="<%= item[0] %>"><%= item[1] %></span><% }) %>'),
    render: function() {
        if (this.model) { this.$el.html(this.template(this.model.toJSON())); } else
            { this.$el.html(this.template()); }

        // for now, this is in the parent view.  If it doesn't seem to be that common
        // we can move it to a child view's render function.  This is basically
        // just a place holder for additional searching that isn't added to
        // the search bar.
        this.$el.prepend('<div id="hiddenSearch" style="display:hidden; visiblity: none;"></div>');
        return this;
    },
    derender: function() {
        this.remove();
        this.unbind();
        this.model.off();
    },
    click: function(e) {
        var target = e.target.value;
        if ($('#'+target).hasClass('active')) {
            $('#'+target).removeClass('active');
            $('#hiddenSearch').val('');
        } else {
            $('.active').removeClass('active');
            $('#'+target).toggleClass('active');
            $('#hiddenSearch').val(target);
        }

        // once that array is all sorted out, lets stick it in the hidden search field that
        // has been appended to the page.
        $('#search').trigger('keyup');
    },
    change: function(e) {
        // not implemented
    }
});


var DataCatalogPageControlView = ParentPageControlView.extend({
    events: {
        'change select#search-param': 'click'
    },
    template: JST['ooiui/static/js/partials/DataCatalogPageControlView.html'],
    click: function(e) {
        $('#search').trigger('keyup');
    }
});


var AssetManagementPageControlView = ParentPageControlView.extend({});


var TocPageControlView = ParentPageControlView.extend({
    template: JST['ooiui/static/js/partials/TocPageControlView.html'],
    click: function(e) {
        // simple toggle of DOM elements.
        switch(e.target.id) {
            case 'engToggle':
                $('.eng-item').toggle();
                break;

            case 'metaDataToggle':
                $('.meta-data-item').toggle();
                break;

            case 'refDesToggle':
                $('.ref-des-item').toggle();
                break;
        }

        // toggle the class.
        $('#'+e.target.id).toggleClass('active');
    },
    change: function(e) {
        vent.trigger('toc:paramFilter', e.currentTarget.selectedOptions[0].id);
    },
    render: function(){
        if (this.model) { this.$el.html(this.template(this.model.toJSON())); } else
        { this.$el.html(this.template()); }
        this.$el.prepend('<div id="hiddenSearch" style="display:hidden; visiblity: none;"></div>');
        $('#engToggle').toggleClass('active');
        $('#engToggle').trigger('click');

        return this;
    }
});
