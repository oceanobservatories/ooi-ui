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
        _.bindAll(this, 'render', 'derender', 'click');
    },
    events: {
        'click span': 'click'
    },
    // this template will loop through each of the parameters defined in the
    // instantiaed model and create a <span> tag with an id of the first index
    // and a the tag contents with the second index.
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
        if ($('#'+e.target.id).hasClass('active')) {
            $('#'+e.target.id).removeClass('active');
            $('#hiddenSearch').val('');
        } else {
            $('.active').removeClass('active');
            $('#'+e.target.id).toggleClass('active');
            $('#hiddenSearch').val(e.target.id);
        }

        // once that array is all sorted out, lets stick it in the hidden search field that
        // has been appended to the page.
        $('#search').trigger('keyup');
    }
});


var DataCatalogPageControlView = ParentPageControlView.extend({});


var AssetManagementPageControlView = ParentPageControlView.extend({});


var TocPageControlView = ParentPageControlView.extend({
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
    }
});
