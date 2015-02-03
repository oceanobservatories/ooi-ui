// Define a model with some validation rules
var TroubleTicketModel = Backbone.Model.extend({
    defaults: {
        role_name: "Administrator",
        organization: "ASA",
        role_id: 0
    },
    url: "/api/ticket/",

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
        role_name: {
            oneOf: ['Administrator']
        },
        primary_phone: {
            required: true,
            pattern:'digits'
        }
    }
});
