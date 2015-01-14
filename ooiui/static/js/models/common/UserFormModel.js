// Define a model with some validation rules
var SignUpModel = Backbone.Model.extend({
    defaults: {
        role: "Administrator",
        phone: "Work"
    },
    url: "/api/user/",
    
    validation: {
        username: {
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
        phone: {
            oneOf: ['Work', 'Home','Cell']
        },
        role: {
            oneOf: ['Administrator']
        },
        phonenum: {
            required: true,
            pattern:'digits'
        }
    }
});
