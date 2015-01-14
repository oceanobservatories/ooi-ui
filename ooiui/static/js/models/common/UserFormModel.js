// Define a model with some validation rules
var SignUpModel = Backbone.Model.extend({
    defaults: {
        role: "Administrator",
        organization: "ASA"
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
        role: {
            oneOf: ['Administrator']
        },
        primary_phone: {
            required: true,
            pattern:'digits'
        }
    }
});
