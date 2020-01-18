/* a regex to handle US phone numbers with an optional extension beginning
 * with 'x' or 'X' and the extension number.  Also, we're not an automated
 * dialing service, but I'll reckon your phone number doesn't start with 911,
 * 411, 0, or 1 so exclude numbers like that. */

_.extend(Backbone.Validation.patterns, {
  phoneRegex: /^\(?(?![94]11)([2-9]\d{2})\)?[-. ]?(\d{3})[-. ]?(\d{4})(?: ?[Xx] ?(\d+))?$/,
  passwordRegex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/
});

_.extend(Backbone.Validation.messages, {
  usPhone: 'Invalid US phone number',
  passwordRegex: 'Password must be at least 8 characters and contain at least one number and one upper case letter.',
  email: 'Please use a properly formatted email address.'
});

// Define a model with some validation rules
var SignUpModel = Backbone.Model.extend({
  defaults: {
    role_name: "Science User",
    organization: "Other",
    role_id: 3,
    active: true,
    email: ""
  },
  url: "/api/user/",
  validatePassword: function(model, key, attr, computed) { // Check to see if user is using email, first or last name inside password
    if (attr.password != undefined && attr.email != undefined && attr.password.toLowerCase().includes(attr.email.toLowerCase())) {
      return "Password cannot contain email address";
    }
  },
  validateEmailDNE: function(model, key, attr, computed) {
    var duplicateEmail = false;
    $.ajax('/api/user/check_valid_email?email='+attr.email, {
      type: 'GET',
      dataType: 'json',
      timeout: 5000,
      async: false,
      success: function (resp) {
        // console.log('Success getting check valid email');
        // console.log(resp);
        if(resp.email !== undefined && resp.email !== ""){
          duplicateEmail = true
        }
      },
      error: function( req, status, err ) {
        console.log('error');
      }
    });
    if(duplicateEmail){
      return 'Address unavailable.  Already registered?  <a id="reglogin" href="#">Login here.</a>';
    }else{
      return '';
    }
  },

  validation: {
    first_name: {
      required: true
    },
    last_name: {
      required: true
    },
    email: {
      required: true,
      pattern: 'email',
      fn: 'validateEmailDNE'
    },
    password: {
      pattern: 'passwordRegex',
      fn: 'validatePassword'
    },
    repeatPassword: {
      equalTo: 'password',
      msg: 'The passwords does not match'
    },
    organization:{
      required: false
    },
    other_organization:{
      required: true
    },
    phone_primary: {
      required: true
      //pattern: 'phoneRegex'
    },
    phone_alternate: {
      required: false
      //pattern: 'phoneRegex'
    }
  }
});
