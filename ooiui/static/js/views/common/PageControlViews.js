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
        'use strict';
        _.bindAll(this, 'render', 'derender', 'click');
    },
    template: _.template('<h2> You have not defined a template for this page\'s control view! <h2>'),
    render: function() {
        'use strict';
        if (this.model) { this.$el.html(this.template(this.model.toJSON())); } else
            { this.$el.html(this.template()); }
        this.$el.prepend('<div id="hiddenSearch" style="display:hidden; visiblity: none;"></div>');
        return this;
    },
    derender: function() {
        'use strict';
        this.remove();
        this.unbind();
        this.model.off();
    },
    click: function() {

        // placeholder for children
        alert("You have not defined the click method yet for this page\'s controls!");
    }
});


var DataCatalogPageControlView = ParentPageControlView.extend({
    // this template will loop through each of the parameters defined in the
    // instantiaed model and create a <span> tag with an id of the first index
    // and a the tag contents with the second index.
    template: _.template('<% _.each(params, function(span) { %> <span id="<%= span[0] %>"><%= span[1] %></span><% }) %>'),
    events: {
        'click span': 'click'
    },
    click: function(e) {
        'use strict';

        // define variables up top for SPEED.
        var index, hiddenSearch = this.hiddenSearch || [];

        // lets start by figuring out of the button has already be activated
        // or not . . .
        if (!$('#'+e.target.id).hasClass('active')) {

            // if the target isn't active lets push the search criteria to the
            // hidden search container.
            hiddenSearch.push(e.target.id);
        } else {

            // if the target is already active, lets find it in the hiddenSearch
            // array and then remove it.
            index = hiddenSearch.indexOf(e.target.id);
            if (index > -1) {
                hiddenSearch.splice(index, 1);
            }
        }

        // once that array is all sorted out, lets stick it in the hidden search field that
        // hass been appended to the page.
        $('#hiddenSearch').val(hiddenSearch.join(' '));
        $('#search').trigger('change');
        $('#'+e.target.id).toggleClass('active');

        // we'll need to persist the array, so lets just attach it to this view.
        this.hiddenSearch = hiddenSearch;
    }
});
