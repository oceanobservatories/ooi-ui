/* Created by M@Campbell
 *
 * This model holds the response to a query on any document in the repository
 *
 * @defaults
 *      id: The full object identification path. may be left out in response.
 *      name: The name of the document
 *      url: The downlaod URL of the ojbect, contains auth ticket (token).
 *
 */

var AlfrescoDocumentModel = Backbone.Model.extend({
    urlRoot: '/api/alfresco/documents',
    defaults: {
        id: null,
        name: null,
        url: null
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

var AlfrescoDocumentCollection = Backbone.Collection.extend({
    url: '/api/alfresco/documents',
    model: AlfrescoDocumentModel,
    parse: function(response) {
        'use strict';
        // if the response is valid, return the results object
        if (response) { return response.results; } else { return {}; }
    }
});
