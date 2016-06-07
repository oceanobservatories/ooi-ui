/* a regex to handle US phone numbers with an optional extension beginning
 * with 'x' or 'X' and the extension number.  Also, we're not an automated
 * dialing service, but I'll reckon your phone number doesn't start with 911,
 * 411, 0, or 1 so exclude numbers like that. */

_.extend(Backbone.Validation.patterns, {
  phoneRegex: /^\(?(?![94]11)([2-9]\d{2})\)?[-. ]?(\d{3})[-. ]?(\d{4})(?: ?[Xx] ?(\d+))?$/
});

_.extend(Backbone.Validation.messages, {
  usPhone: 'Invalid US phone number'
});


var PasswordResetModel = Backbone.Model.extend({
  defaults: {

  },
  urlRoot: "/api/user/xpassword",

  validation: {
    password: {
      minLength: 8
    },
    repeatPassword: {
      equalTo: 'password',
      msg: 'The passwords does not match'
    }
  }
});

var PasswordResetCollection = Backbone.Collection.extend({
  url: '/api/user/xpassword',
  model: PasswordResetModel,
  parse: function(response) {
    if(response) {
      return response;
    }
    return [];
  }
});




