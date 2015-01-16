Backbone.Validation.configure({
    forceUpdate: true
});

// Extend the callbacks to work with Bootstrap, as used in this example
// See: http://thedersen.com/projects/backbone-validation/#configuration/callbacks
_.extend(Backbone.Validation.callbacks, {
    valid: function (view, attr, selector) {
        var $el = view.$('[name=' + attr + ']'),
            $group = $el.closest('.form-group');

        $group.removeClass('has-error');
        $group.find('.help-block').html('').addClass('hidden');
    },
    invalid: function (view, attr, error, selector) {
        var $el = view.$('[name=' + attr + ']'),
            $group = $el.closest('.form-group');

        $group.addClass('has-error');
        $group.find('.help-block').html(error).removeClass('hidden');
    }
});

var SignUpForm = Backbone.View.extend({
    events: {
        'click #submitButton': function (e) {
            console.log("submit clicked");
            e.preventDefault();
            this.submit();
        },
        'click #resetButton': function (e){
            
            this.reset();
        }
    },

    // Use stickit to perform binding between
    // the model and the view
    // See: https://github.com/NYTimes/backbone.stickit
    bindings: {
        '[name=username]': {
            observe: 'username',
            setOptions: {
                validate: true
            }
        },
        '[name=first_name]': {
            observe: 'first_name',
            setOptions: {
                validate: true
            }
        },
        '[name=last_name]': {
            observe: 'last_name',
            setOptions: {
                validate: true
            }
        },
            '[name=email]': {
            observe: 'email',
            setOptions: {
                validate: true
            }
        },
            '[name=password]': {
            observe: 'password',
            setOptions: {
                validate: true
            }
        },
            '[name=repeatPassword]': {
            observe: 'repeatPassword',
            setOptions: {
                validate: true
            }
        },
            '[name=primary_phone]': {
            observe: 'primary_phone',
            setOptions: {
                validate: true
            }
        },
         '[name=secondary_phone]': {
            observe: 'secondary_phone',
            setOptions: {
                validate: false
            }
        },
            '[name=organization]': {
            observe: 'organization',
            setOptions: {
                validate: true
            }
        },     
            '[name=role_name]': {
            observe: 'role_name',
            selectOptions: {
                collection: []
            },
            setOptions: {
                validate: true
            }
        },
        
    },

    initialize: function () {
        // This hooks up the validation
        // See: http://thedersen.com/projects/backbone-validation/#using-form-model-validation/validation-binding
        Backbone.Validation.bind(this);
        _.bindAll(this, "render", "submit", "reset", "remove");
        // functions defined within a function, need to be able to set attributes of "this"
        // so in order to do that, we define "self" which currently points to this, in this case the UserFormView
        var self = this;
        var roles = new Roles();
        roles.fetch({
            success: function(collection, response, options) {
                self.roles = collection;
                console.log(self.roles);
                // We only render, after the data has returned from server
                self.render();
            }
        });
    },

    render: function () {
        this.bindings["[name=role_name]"].selectOptions.collection = this.roles.map(function(role) { return role.get("role_name"); });
        this.stickit();
        return this;
    },

    submit: function () {
        // Check if the model is valid before saving
        // See: http://thedersen.com/projects/backbone-validation/#methods/isvalid
        //  on submit check for the role then change the role_id to the correct int
        if (this.model.isValid(true)) {
            if(this.model.get('role_name')==='Administrator') {
                this.model.set("role_id", 1);
            }
            else if(this.model.get('role_name')==="Science User") {
                this.model.set("role_id", 2);
            }
            else if(this.model.get("role_name")==="Marine Operator") {
                this.model.set("role_name", 3);
            }
            // Needs to be dynamic (update)
            console.log(this.model.save());
            console.log(this.model);
            alert("User Registration Submitted:" + " "+this.model.get('role_name'));
        }
    },
    reset: function(){
        // resests the page. Not sure it's the correct procedure?? 
        console.log('reset clicked');
        window.location.reload();
        // maybe this?? this.model.set({name: "","email":""})
    },

    remove: function () {
        // Remove the validation binding
        // See: http://thedersen.com/projects/backbone-validation/#using-form-model-validation/unbinding
        Backbone.Validation.unbind(this);
        return Backbone.View.prototype.remove.apply(this, arguments);
    }
});
