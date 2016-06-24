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

var PasswordResetForm = Backbone.View.extend({
  //events: {
  //    'click #submitButton': function (e) {
  //        e.preventDefault();
  //        this.submit();
  //    },
  //    'click #resetButton': function (e){
  //      console.log('clicked submit');
  //        this.reset();
  //    }
  //},
  events: {
    'click #submitButton' : 'submit',
    'click #closeButton' : 'close'
  },

  // Use stickit to perform binding between
  // the model and the view
  // See: https://github.com/NYTimes/backbone.stickit
  bindings: {
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
    }

  },

  initialize: function () {
    // This hooks up the validation
    // See: http://thedersen.com/projects/backbone-validation/#using-form-model-validation/validation-binding
    Backbone.Validation.bind(this);
    _.bindAll(this, "render", "submit", "reset", "remove");
    // functions defined within a function, need to be able to set attributes of "this"
    // so in order to do that, we define "self" which currently points to this, in this case the UserFormView
    this.modalDialog = new ModalDialogView();
    this.render();
  },

  render: function () {
    this.stickit();
    this.$el.append(this.modalDialog.el);
    return this;
  },

  submit: function () {
    //console.log('clicked submit');
    //console.log(ooi.reset_email);
    //console.log(ooi.reset_token);
    var self = this;

    // Check if the model is valid before saving
    if (this.model.isValid(true)) {
      this.model.set('_csrf_token', ooi.csrf_token);
      this.model.set('_reset_token', ooi.reset_token);
      this.model.set('_reset_email', ooi.reset_email);
      // Needs to be dynamic (update)
      this.model.save(null, {
        success: function(model, response) {
          self.modalDialog.show({
            message: "Password changed successfully.",
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
            var errMessage = "Unable to change your password at this time.";
          }
          self.modalDialog.show({
            message: errMessage,
            type: "danger"
          });
          //console.error(model);
          console.error(response.responseText);
        }
      });
    }

  },
  reset: function(){
    // resets the page. Not sure it's the correct procedure??
    //this.$el.find('#submitButton').attr( "disabled", 'disabled' );
    this.$el.find("input[type=password], textarea").val("");
  },

  remove: function () {
    // Remove the validation binding
    // See: http://thedersen.com/projects/backbone-validation/#using-form-model-validation/unbinding
    Backbone.Validation.unbind(this);
    return Backbone.View.prototype.remove.apply(this, arguments);
  }
});
