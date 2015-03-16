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
                validate: true
            }
        },
            '[name=organization]': {
            observe: 'organization',
            selectOptions: {
              collection: []
            },
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
        this.roles = ooi.collections.roles;
        this.orgs = ooi.collections.orgs;
        this.modalDialog = new ModalDialogView();
        this.render();
    },

    render: function () {
        this.bindings["[name=role_name]"].selectOptions.collection = this.roles.pluck('role_name');
        this.bindings["[name=organization]"].selectOptions.collection = this.orgs.pluck('organization_name');
        this.stickit();
        this.$el.append(this.modalDialog.el);
        return this;
    },

    submit: function () {
        var self = this;
        // Check if the model is valid before saving
        // See: http://thedersen.com/projects/backbone-validation/#methods/isvalid
        //  on submit check for the role then change the role_id to the correct int
        if (this.model.isValid(true)) {
            this.model.set("role_id", this.roles.findWhere({role_name: this.model.get('role_name')}).get('id'));
            this.model.set("organization_id", this.orgs.findWhere({organization_name: this.model.get('organization')}).get('id'));
            this.model.set('_csrf_token', ooi.csrf_token)
            // Needs to be dynamic (update)
            this.model.save(null, {
              success: function(model, response) {
                self.modalDialog.show({
                  message: "User successfully registered",
                  type: "success",
                  ack: function() { 
                    window.location = "/"
                  }
                });
              },
              error: function(model, response) {
                try {
                  var errMessage = JSON.parse(response.responseText).error;
                } catch(err) {
                  console.error(err);
                  var errMessage = "Unable to submit user";
                }
                self.modalDialog.show({
                  message: errMessage,
                  type: "danger",
                });
                console.error(model);
                console.error(response.responseText);
              }
            });
        }
    },
    reset: function(){
        // resests the page. Not sure it's the correct procedure?? 
        this.$el.find("input[type=text], textarea").val("");
        this.$el.find("input[type=password], textarea").val("");
        this.$el.find("input[type=email], textarea").val("");
        // maybe this?? this.model.set({name: "","email":""})
    },

    remove: function () {
        // Remove the validation binding
        // See: http://thedersen.com/projects/backbone-validation/#using-form-model-validation/unbinding
        Backbone.Validation.unbind(this);
        return Backbone.View.prototype.remove.apply(this, arguments);
    }
});
