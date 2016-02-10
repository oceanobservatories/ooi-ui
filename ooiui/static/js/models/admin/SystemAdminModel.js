/* Created by M@Campbell - 02/10/2015
 */

/*
 * CacheTableModel && Collection
 * @method GET: returns a list with key 'cache_list'
 * @method POST: submit a json with a list of keys
 *               to delete.
 *               Ex: {delete: ['<flask_cache_<name1>', ...]}
 */

var CacheTableModel = Backbone.Model.extend({
    urlRoot: '/api/cache_keys',
    defaults: {
        TTL: null,
        key: null
    },
    deleteCache: function(options) {
        var modelContext = this;
        // since we aren't passing an ID, we need to override
        // the traditional way we destroy items and use
        // a string key.
        $.ajax({
            url: this.urlRoot + '/' + options.key,
            type: 'DELETE',
            success: function() {
                // once that's done, lets remove the model.
                modelContext.destroy();
            }
        });
    },
    toJSON: function() {
        'use strict';
        var attrs = _.clone(this.attributes);
        // include any modification to key names here . . .
        return attrs;

    }
});

/* Created by M@Campbell
 *
 * Simple collection.
 *
 */

var CacheTableCollection = Backbone.Collection.extend({
    url: '/api/cache_keys',
    model: CacheTableModel,
    parse: function(response) {
        'use strict';
        // if the response is valid, return the results object
        if (response) { return response.results; } else { return {}; }
    }
});
