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
        passwordRegex: 'Password must be at least 8 characters and contain at least one number and one upper case letter.'
});

// Define a model with some validation rules
var SignUpModel = Backbone.Model.extend({
    defaults: {
        role_name: "Science User",
        organization: "Other",
        role_id: 3,
        active: true
    },
    url: "/api/user/",

    validation: {
         first_name: {
            required: true
        },
         last_name: {
            required: true
        },
        email: {
            required: true,
            pattern: 'email'
        },
        password: {
            pattern: 'passwordRegex'
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
