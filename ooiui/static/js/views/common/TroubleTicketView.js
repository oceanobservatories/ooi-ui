/*"use strict";
* ooiui/static/js/views/common/TroubleTicketView.js
*
* Dependencies
* Partials
* - ooiui/static/js/partials/TroubleTicket.html
*/
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

var TroubleTicketView = Backbone.View.extend({
  events: {
    'click #submitTicketButton' : function(e) {
        e.preventDefault();
        
        this.submit(e);
    },
    'click #resetTicketButton' : 'reset'
  },
  initialize: function() {
    Backbone.Validation.bind(this);
    _.bindAll(this, 'render', 'submit', 'remove');
    var self = this;  
    this.listenTo(this.collection, "reset", function() {
      self.render();
    });
  },
  bindings:{
    '[name=subject]':{
      observe:'subject',
      setOptions:{
        validate: true
      }
    },
    '[name=username]':{
      observe:'username',

      onGet: function(options){
        var user_name = ooi.models.userModel.get('user_name');
        this.model.set('user_name',user_name); 
        return user_name;

      },
      onSet: function(){
        console.log('username set');
      }
    },
     '[name=description]':{
      observe:'description',
        setOptions:{
          validate:true
        }
    },
     '[name=priority_id]':{
      observe:'priority_id',       
      setOptions:{
        validate: false
      },
          
    },

    '[name=due_date]' :{
      observe:'due_date',
      setOptions:{
        validate: false
      }
    },
    '[name=assigned]':{
      observe:'assigned',
      setOptions:{
        validate: true
      },
      selectOptions:{
        collection: [],
        defaultOption:{
          label:'--Assignee--'
        }
      },
      onSet: function(val){
        var user_id = this.collection.findWhere({user_name: val});
        user_id = user_id.get(val);
        this.model.set('assigned_to_id', user_id);
        
        return val;
      },
     }
  },

  template: JST['ooiui/static/js/partials/TroubleTicket.html'],

  render: function() {
    this.$el.html(this.template());
    this.$el.find('#datePicker').datepicker({
        format: "yyyy-mm-dd",
        startDate: "+1d"
    });

    this.bindings["[name=assigned]"].selectOptions.collection= this.collection.pluck('user_name');
    this.stickit();
  },
  reset: function() {
    this.model.clear().set('user_name',ooi.models.userModel.get('user_name'));
        

    
  },
  submit: function() {
    console.log(this.model);
    // THIS IS A HACK TO ALWAYS ASSIGN TO SAGE
    this.model.set('assigned_to_id', 83);
    if (this.model.isValid(true)) {
      this.model.save(null, {
        
        success: function(model, response){

          console.log('Ticket created');
          ooi.trigger('RedmineModalSuccess:onSuccess', this.model);
          ooi.trigger('TroubleTicketView:submit', this.model);
        },
        error: function(model, response) {
          try {
            var errMessage = JSON.parse(response.responeText).error;
          } 
          catch(err){
            console.log(err);
            var errMessage = "Unable to submit ticket";
          }
          // console.error(model);
          console.error(response.responseText);
          ooi.trigger('RedmineModalFail:onFail', this.model);
        }
      });
    }
  },

  remove: function () {
        // Remove the validation binding
        // See: http://thedersen.com/projects/backbone-validation/#using-form-model-validation/unbinding
        Backbone.Validation.unbind(this);
        return Backbone.View.prototype.remove.apply(this, arguments);
    }

});
