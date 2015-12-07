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
        'change select#search-param': 'click'
    },
    // this template will loop through each of the parameters defined in the
    // instantiaed model and create a <option> tag in the select element with
    // an id of the actual search term. 
template: _.template('<select id="search-param"><option selected>None</selected><% _.each(Object.keys(params), function(key) { %> <optgroup label="<%=key%>"> <% _.each(params[key], function(item){ %> <option id="<%= item[0]  %>"><%= item[1] %></option><% })%></optgroup> <%;}); %></select>'),
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
        $('#hiddenSearch').val(e.currentTarget.selectedOptions[0].id);

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
