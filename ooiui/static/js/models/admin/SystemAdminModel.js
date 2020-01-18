/* Created by M@Campbell - 02/10/2015
 */

/*
 * CacheTableModel && Collection
 * @method GET: returns a list with key 'cache_list'
 * @method DELETE: provide a key name as and ID to delete
 */

var CacheTableModel = Backbone.Model.extend({
    urlRoot: '/api/cache_keys',
    defaults: {
        TTL: null,
        key: null,
        key_timeout: 604800,
        key_value: null
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
    addCacheKey: function(options) {
        var modelContext = this;
        // since we aren't passing an ID, we need to override
        // the traditional way we destroy items and use
        // a string key.
        $.ajax({
            url: this.urlRoot + '/' + options.key + '/' + options.key_timeout + '/' + options.key_value,
            type: 'POST',
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
