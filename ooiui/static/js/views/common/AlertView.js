"use strict";
/*
 *
 * 
 * ooiui/static/js/models/common/FilterViewModel.js
 * Validation model for Alerts and Alarms Page.
 *
 * Dependencies
 * Partials
 * - ooiui/static/js/partials/compiled/alertPage.js
 * Libs
 * - ooiui/static/lib/underscore/underscore.js
 * - ooiui/static/lib/backbone/backbone.js
 * Usage
 * 
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

// collections are example only
var AlertCollection = Backbone.Collection.extend({
  url: '/api/array',
  parse: function(response, options){
    return response.arrays;
  }
});
//example only
var AssetTen = Backbone.Collection.extend({
  url:'json/asset_ten.json',
  parse: function(response, options){
    return response.assets[0].metaData;
  }
});

//Validations is turned off!!

var AlertFilterView = Backbone.View.extend({
           
 
 // template: JST['ooiui/static/js/partials/AlertFilter.html'],

 


   events: {
        'click #saveAlert': function (e) {
            e.preventDefault();
            this.submit();
        },
        'click #RemoveConditions':function(e) {
          e.preventDefault();
          this.removeConditions(e);
        },
        'click #RemoveUser': function(e) {
          e.preventDefault();
          this.removeUsers(e);
        }
    },

    // Use stickit to perform binding between
    // the model and the view
    // See: https://github.com/NYTimes/backbone.stickit
    bindings: {
        '[name=array]': {
            observe: 'array',
            selectOptions: {
                collection: []
            },

            setOptions: {
                validate: true
            }
        },
        '[name=Platform]': {
            observe: 'Platform',
            setOptions: {
                validate: true
            }
        },
        '[name=Instrument]': {
            observe: 'Instrument',
            selectOptions:{
              collections: []
            },
            setOptions: {
                validate: true
            }
        },
        '[name=ConditionsFilter]': {
            observe: 'ConditionsFilter',
            selectOptions:{
              collections: [],
              valuePath:'key',
              valueLabel:'Select To Add Filter',

              defaultOption:{
                label: 'Select To Add Filter'
              }  
            },
            onSet: function(val){
              this.addConditions(val);
              return val;
              
              
            },

            setOptions: {
                validate: true
            }
        },
           '[name=ConditionsInput]':{
             observe: 'ConditionsInput',
             events: ['keypress'],

         },
          '[name=User]': {
            observe: 'User',
            setOptions: {
                validate: true
            }
        },
            '[name=OtherUser]': {
            observe: 'OtherUser',
            setOptions: {
                validate: true
            }
        },
            '[name=UserFilter]': {
            observe: 'UserFiler',
            setOptions: {
                validate: true 
            },
            selectOptions:{
              collection: ['Administrator','Operator', 'Science User','Current User'],
              defaultOption: {
                label: 'Select To Add Filter'
              }
            },
            onSet: function(val){
              this.addUsers(val);
              return val;
            }

        },
         '[name=Name]': {
            observe: 'Name',
            setOptions: {
                validate: true
            }
        },
            '[name=Priority]': {
            observe: 'Priority',
                setOptions: {
                validate: true
            }
        },     
            '[name=Description]': {
            observe: 'Description',
            setOptions: {
                validate: true
            }
        },
          '[name=Email]': {
            observe: 'Email',
            setOptions: {
                validate: true
            }
          },
           '[name=Redmine]': {
            observe: 'Redmine',
            setOptions: {
                validate: true
            }
          },

           '[name=PhoneCall]': {
            observe: 'PhoneCall',
            setOptions: {
                validate: true
            }
          },

           '[name=TextMessage]': {
            observe: 'TextMessage',
            setOptions: {
                validate: true
            }
          },
            '[name=LogEvent]': {
            observe: 'LogEvent',
            setOptions: {
                validate: true
            }
          },





        
    },

    initialize: function () {
        // This hooks up the validation
        // See: http://thedersen.com/projects/backbone-validation/#using-form-model-validation/validation-binding
        Backbone.Validation.bind(this);
        _.bindAll(this, "render", "submit", "remove", "addConditions", "removeConditions", "addUsers", "removeUsers");
        //Cannot listen for a change, easily. All html elems are linked to the model
        //any event will be heard and then change the DOM, 
          var self = this;
         //example only
         //collections will be moved to main html page
          ooi.collections.assetTen.fetch({
            success: function(collection, response){
             
              return this;
            }
          });
         this.collection.fetch({
             success: function(collection, response){
             self.render();

             return this ; 
             }
          });
         return this;
    },

    render: function () {
        
        var assetTen = ooi.collections.assetTen;
        this.bindings["[name=ConditionsFilter]"].selectOptions.collection = (ooi.collections.assetTen.pluck('key'));
        this.bindings["[name=array]"].selectOptions.collection = this.collection.pluck('display_name');
        this.bindings["[name=Instrument]"].selectOptions.collection = [ "Mooring", "Sensor", "Sensor Part", "Coastal Glider", "Open Ocean Glider"]; 

        this.stickit();
        return this;
    },
    addConditions: function(val){
      //adds a div and input under conditions on the html
      //adds bindings 
      var value = val.replace(/\s+/g, '_');
      

     $('#Conditions').append('<div class="form-group"> <div class="form-control"  name='+value+'> '+ val +' </div> <span class="help-block hidden"></span> </div>');

    
     $('#ConditionsInput').append('<div class="form-group"> <input class="form-control" id='+value+ '></input> <span class="help-block hidden"></span></div>');
     
     $('#RemoveConditions').append('<div class="form-group center"> <button class="btn btn-success" id='+  value   + '>'+ 'X' +' </button> <span class="help-block hidden"></span></div>');
     
     this.addBinding(null, '#'+value, value);
    },
    addUsers: function(val){
      var value = val.replace(/\s+/g, '_');
       
      $('#Users').append('<div class="form-group"> <div class="form-control" id='+value+' > '+ val +' </div> <span class="help-block hidden"></span> </div>');

      $('#RemoveUser').append('<div class="form-group center"> <button class="btn btn-success" id='+  value   + '>'+ 'X' +' </button> <span class="help-block hidden"></span></div>');
      // It will set directly to the model
      // clicking multiple will override User attribute
      //this.addBinding(null,'#'+value, value);
      this.model.set({User: val});
    },

    submit: function () {
        var self = this;
        // Check if the model is valid before saving
        // See: http://thedersen.com/projects/backbone-validation/#methods/isvalid
        //  on submit check for the role then change the role_id to the correct int
        if (this.model.isValid(true)) {
            this.model.save(null, {
              success: function(model, response) {
               },
              error: function(model, response) {
                try {
                  var errMessage = JSON.parse(response.responseText).error;
                } catch(err) {
                  console.error(err);
                  var errMessage = "Unable to submit user";
                }
                console.error(model);
                console.error(response.responseText);
              }
            });
        }
    },
     conditionsFilter: function(e){
     // I use onSet in the above binding
    },
    removeConditions: function(e){
      //need some assertions or check...
      //clicking too fast messes everything up.
      var remove = e.target.id;
      var button = e.target;
      
      
      button.remove();
      $('#'+remove).remove();
      $('[name='+remove+']').remove();
      this.model.unset(remove);
    
    },
    removeUsers: function(e){
      //need assertions and checks in future.
      var remove = e.target.id;
      $('#'+remove).remove();
      $('#'+remove).remove();
      //not dynamic User is defined with adding a user
      this.model.unset('User');
    },
  
    remove: function () {
        // Remove the validation binding
        // See: http://thedersen.com/projects/backbone-validation/#using-form-model-validation/unbinding
        Backbone.Validation.unbind(this);
        return Backbone.View.prototype.remove.apply(this, arguments);
    }
});
