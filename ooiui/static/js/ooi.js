"use strict";
/*
 * ooiui/static/js/models/science/ArrayModel.js
 * An extension of Backbone.Model that manages relations with a back-ref id
 *
 * Dependencies
 * Libs
 * - ooiui/static/lib/underscore/underscore.js
 * - ooiui/static/lib/backbone/backbone.js
 * Usage
 */

/*
 * OOI is the main class that we extend to form the application instance for
 * each page.
 */
if(typeof(OOI) === "undefined") {
  var OOI = function() {
  }
}
OOI.Relation = {
  hasMany: 'hasMany'
}

/*
 * Use the RelationalModel to attach a collection to a Model that has
 * relational properties and a back-reference
 */
OOI.RelationalModel = Backbone.Model.extend({
  constructor: function(attributes, options) {
    Backbone.Model.apply(this, arguments);
    if(this.relation && this.relation.type === OOI.Relation.hasMany) {
      // bind the actual class to a variable so we can instantiate it.
      var collection = eval(this.relation.collectionType);
      // Create an instance of the class and bind it to the appropriate key
      this[this.relation.key] = new collection();
      // We need self in the following function declaration
      var self = this;
      this[this.relation.key].fetch = function(options) {
        if(typeof options === 'undefined') {
          options = {};
        }
        // The data parameters are defined by the relation
        if(options && options.data) {
          delete options.data;
        }

        // This is where the URL parameter is generated ?key=id
        var params = {};
        params[self.relation.reverseRelation.key] = self.get("id");
        options.data = $.param(params);
        // Call the original method
        collection.prototype.fetch.call(this, options);
      }.bind(this[this.relation.key]); // override "this" and bind it to our instance
    }
  }
});

/*
 * Logged in returns true if we have identified that the user is logged in.
 */
OOI.LoggedIn = function() {
    if($.cookie('ooiusertoken')) {
        return true;
    }
  return false;
}

OOI.LogOut = function() {
  $.removeCookie('ooiusertoken', { path: '/' });
  window.location.replace('/');
}

OOI.prototype.onLogin = function() {
    window.location.reload();
}
OOI.prototype.onLogout = function() {
    window.location.reload();
}

var idleTime = 0;
//Increment the idle time counter every minute.

var idleInterval = setInterval(timerIncrement, 60000); // 1 minute


//Zero the idle timer on mouse movement.
$(this).mousemove(function (e) {
    idleTime = 0;
});
$(this).keypress(function (e) {
    idleTime = 0;
});

function timerIncrement() {
    if (OOI.LoggedIn()) {
        idleTime = idleTime + 1;
        if (idleTime > 1200) { // 20 hours
            OOI.LogOut();
        }
    }
}
