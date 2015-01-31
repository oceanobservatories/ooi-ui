"use strict";
/*
* ooiui/static/js/views/common/EventListView.js
* View definitions an accordion style for event views
*
* Dependencies
* Libs
* - ooiui/static/lib/underscore/underscore.js
* - ooiui/static/lib/backbone/backbone.js
* - ooiui/static/js/ooi.js
*
* Usage
* var user = new UserModel();
* user.fetch({async:false});
* if(user.user_name != "") {
*   ...
* }
*/

var UserModel = Backbone.Model.extend({
  urlRoot: '/api/user',
  getFullName: function() {
    return this.get('first_name') + ' ' + this.get('last_name');
  },
  defaults: {
    active: false,
    email: "",
    first_name: "",
    id: null,
    last_name: "",
    organization_id: null,
    phone_alternate: null,
    phone_primary: null,
    role: null,
    user_id: "",
    user_name: ""
  }
});

