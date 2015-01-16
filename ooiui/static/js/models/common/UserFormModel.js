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
        role_name: {
            oneOf: ['Administrator']
        },
        primary_phone: {
            required: true,
            pattern:'digits'
        }
    }
});


var Role = Backbone.Model.extend({
  urlRoot: "",
  sync: function(method, model, options) {
    if (method === 'read') {
      Backbone.sync(method, model, options);
    } else {
      console.error('You can not ' + method + ' the TodoItem model');
    }
  }
});


var Roles = Backbone.Collection.extend({
    url: "user_roles",
    model: Role,
    parse: function(response) {
        console.log(response.user_roles);
        return response.user_roles;
    }
});


