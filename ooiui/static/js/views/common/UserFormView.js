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
        },
        'change #organization': function (e){

            this.show_other_organization();
        },
        'change #country': function (e){

            this.show_states();
        },
        'click a.terms-link': function(e){
            var termsView = new TermsDialogView();
            termsView.render();
            termsView.show();
        },
        'change input[type="checkbox"]#terms_agree': function (e){
            e.target.checked == true ? this.$el.find('#submitButton').attr( "disabled", null ) : this.$el.find('#submitButton').attr( "disabled", 'disabled' );
        },
        'click #reglogin': function(e){
            console.log('login from reg page');
            $("#loginHolder").load("/login");
        }
    },

    // Use stickit to perform binding between
    // the model and the view
    // See: https://github.com/NYTimes/backbone.stickit
    bindings: {
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
            '[name=phone_primary]': {
            observe: 'phone_primary',
            setOptions: {
                validate: true
            }
        },
         '[name=phone_alternate]': {
            observe: 'phone_alternate',
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
            '[name=other_organization]': {
            observe: 'other_organization',
            setOptions: {
                validate: true
            }
        },
            '[name=vocation]': {
            observe: 'vocation',
            setOptions: {
                validate: true
            }
        },
            '[name=country]': {
            observe: 'country',
            selectOptions: {
              collection: []
            },
            setOptions: {
                validate: true
            }
        },
            '[name=state]': {
            observe: 'state',
            selectOptions: {
              collection: []
            },
            setOptions: {
                validate: true
            }
        },
            '[name=api_user_login]': {
            observe: 'api_user_login',
            setOptions: {
                validate: true
            }
        },
            '[name=api_user_token]': {
            observe: 'api_user_token',
            setOptions: {
                validate: true
            }
        },
        //    '[name=role_name]': {
        //    observe: 'role_name',
        //    selectOptions: {
        //        collection: []
        //    },
        //    setOptions: {
        //        validate: true
        //    }
        //},
            '[name=email_opt_in]': {
            observe: 'email_opt_in',
            setOptions: {
                validate: true
            }
        }

    },

    initialize: function () {
        // This hooks up the validation
        // See: http://thedersen.com/projects/backbone-validation/#using-form-model-validation/validation-binding
        Backbone.Validation.bind(this);
        _.bindAll(this, "render", "submit", "reset", "remove", "show_other_organization", "show_states");
        // functions defined within a function, need to be able to set attributes of "this"
        // so in order to do that, we define "self" which currently points to this, in this case the UserFormView
        //this.roles = ooi.collections.roles;
        this.orgs = ooi.collections.orgs;
        this.countries = ooi.collections.countries;
        this.states = ooi.collections.states;
        this.modalDialog = new ModalDialogView();
        this.stateModel = new StateModel();
        this.render();
    },

    render: function () {
        //this.bindings["[name=role_name]"].selectOptions.collection = this.roles.pluck('role_name');
        this.bindings["[name=organization]"].selectOptions.collection = this.orgs.pluck('organization_name');
        this.bindings["[name=country]"].selectOptions.collection = this.countries.pluck('country_name');
        this.bindings["[name=state]"].selectOptions.collection = this.states.pluck('state_name');
        this.stickit();
        this.$el.append(this.modalDialog.el);
        return this;
    },

    submit: function () {
        var self = this;
        if ((self.$el.find('input[type="checkbox"]#terms_agree').is(":checked"))){
            // Check if the model is valid before saving
            // See: http://thedersen.com/projects/backbone-validation/#methods/isvalid
            //  on submit check for the role then change the role_id to the correct int
            if (this.model.isValid(true)) {
                //this.model.set("role_id", this.roles.findWhere({role_name: this.model.get('role_name')}).get('id'));
                this.model.set("organization_id", this.orgs.findWhere({organization_name: this.model.get('organization')}).get('id'));
                this.model.set('_csrf_token', ooi.csrf_token);
                // Needs to be dynamic (update)
                this.model.set('active', true);
                this.model.save(null, {
                  success: function(model, response) {
                    self.modalDialog.show({
                      message: "Account created and activated. Email the helpdesk for enhanced permissions requests.",
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
                      type: "danger"
                    });
                    console.error(model);
                    console.error(response.responseText);
                  }
                });
            }
        }
    },
    reset: function(){
        // resests the page. Not sure it's the correct procedure??
        this.$el.find('input[type="checkbox"]#terms_agree').prop('checked', false);
        this.$el.find('#submitButton').attr( "disabled", 'disabled' );
        this.$el.find("input[type=text], textarea").val("");
        this.$el.find("input[type=password], textarea").val("");
        this.$el.find("input[type=email], textarea").val("");

        // maybe this?? this.model.set({name: "","email":""})
    },

    show_other_organization: function() {
        var val = this.orgs.findWhere({organization_name: this.model.get('organization')}).get('id');
        var element=document.getElementById('other_org_div');

        if(val=='9')
            element.style.display='block';
        else
            element.style.display='none';
    },

    show_states: function() {
        var val = $('#country').val();
        if(val=='United States')
            $('#state_div').show();
        else
            $('#state_div').hide();
    },

    remove: function () {
        // Remove the validation binding
        // See: http://thedersen.com/projects/backbone-validation/#using-form-model-validation/unbinding
        Backbone.Validation.unbind(this);
        return Backbone.View.prototype.remove.apply(this, arguments);
    }
});
