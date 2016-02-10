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
        if (response) { return response.cache_list; } else { return {}; }
    }
});
