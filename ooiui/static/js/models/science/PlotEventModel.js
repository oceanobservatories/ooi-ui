"use strict";
/*
* ooiui/static/js/models/common/PlotEventModel.js
* View definitions for charts
*
* Dependencies
* Libs
* - ooiui/static/lib/underscore/underscore.js
* - ooiui/static/lib/backbone/backbone.js
* - ooiui/static/js/ooi.js
*
* Usage
*/

/* A Event model that uses the custom /uframe/event/ref_des route that returns 
 * a subset of the entire event object.
 */

var PlotEventModel = Backbone.Model.extend({
    urlRoot: '/api/events',
    defaults: {
        //Ex: 1
        id: "",
        //Ex: ".DeploymentEvent"
        class: "",
        //Ex: "Some Text"
        event_description: "",
        //Ex: "ACTUAL"
        event_type: "",
        //Ex: [ 'This is a note' ]
        notes: [],
        //Ex: "CP05MOAS-GL004-01-ADCPAM000"
        ref_des: "",
        //Ex: 1412643960000
        start_date: "",
        //Ex: "http://localhost:5555/events/1"
        uframe_url: "",
        //Ex: "/uframe/events/1"
        url: ""},
});


var PlotEventsCollection = Backbone.Collection.extend({
    url: '/api/events',
    model: PlotEventModel,
    initalize: function(options) {
        console.log("HEY I'M HERE!");
    },
    parse: function(response) {
        if (response && response.events) {
            return response.events;
        };
        return [];
    }
});
