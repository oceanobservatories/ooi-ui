/* a regex to handle US phone numbers with an optional extension beginning
 * with 'x' or 'X' and the extension number.  Also, we're not an automated
 * dialing service, but I'll reckon your phone number doesn't start with 911,
 * 411, 0, or 1 so exclude numbers like that. */
 var phoneRegex = /^\(?(?![94]11)([2-9]\d{2})\)?[-. ]?(\d{3})[-. ]?(\d{4})(?: ?[Xx] ?(\d+))?$/;

_.extend(Backbone.Validation.patterns, {
        usPhone: phoneRegex
});

_.extend(Backbone.Validation.messages, {
        usPhone: 'Invalid US phone number'
});

// Define a model with some validation rules
var SignUpModel = Backbone.Model.extend({
    defaults: {
        role_name: "Administrator",
        organization: "ASA",
        role_id: 0
    },
    url: "/api/user/",
    
    validation: {
        username: {
            required: true
        },
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
            minLength: 8
        },
        repeatPassword: {
            equalTo: 'password',
            msg: 'The passwords does not match'
        },
        organization:{
            required: true
        },
        primary_phone: {
            required: true,
            pattern: 'usPhone'
        },
        secondary_phone: {
            required: false,
            pattern: 'usPhone'
        }
    }
});




