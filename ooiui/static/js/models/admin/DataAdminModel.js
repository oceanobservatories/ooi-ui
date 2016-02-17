/* Created by M@Campbell - 02/10/2015
 */

/*
 * DisabledStreamsTableModel && Collection
 * @method GET: returns a list with a key 'disabled_streams'
 * @method POST: submit a json with a obj
 *          example:
 *              {
 *                  refDes: <string>,
 *                  streamName: <optional:string>,
 *                  disabledBy: <string>
 *              }
 * @method DELETE: submit a ID int to remove a disabled stream
 *
 */

var DisabledStreamsModel = Backbone.Model.extend({
    urlRoot: '/api/disabled_streams',
    defaults: {
        disabledBy: null,
        refDes: null,
        streamName: null,
        timestamp: null
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

var DisabledStreamsCollection = Backbone.Collection.extend({
    url: '/api/disabled_streams',
    model: DisabledStreamsModel,
    parse: function(response) {
        'use strict';
        // if the response is valid, return the results object
        if (response) { return response.disabled_streams; } else { return {}; }
    }
});
