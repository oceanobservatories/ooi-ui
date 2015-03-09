
Backbone.Validation.configure({
    forceUpdate: false
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

var AlertModel = Backbone.Model.extend({
    defaults: {
        array: "",
        Instrument: "",
        Platform: ""
    },
    url:" ",
    
    validation: {
        array: {
            required: false
        },
        Platform: {
            required: false
        },
        Instrument: {
            required: false
        },
        User: {
            required: false
        },
        OtherUser:{
            required: false
        },
        Name: {
            required: false
        },
        Priority: {
            required: false
        },
        Description:{
            required: false
        },
        Email: {
            required: false
        },
        Redmine: {
            required: false
        },
        PhoneCall:{
            required: false
        },
        TextMessage: {
            required: false
        },
        LogEvent:{
            required: false
        }




    }
});

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



var AlertFilterView = Backbone.View.extend({
           
 
  template: JST['ooiui/static/js/partials/AlertFilter.html'],

 


   events: {
        'click #saveAlert': function (e) {
            e.preventDefault();
            this.submit();
        },
        'click #resetButton': function (e){
            
            this.reset();

        },
        'change #ConditionsFilter': 'conditionsFilter',
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
                validate: false
            }
        },
        '[name=Platform]': {
            observe: 'Platform',
            setOptions: {
                validate: false
            }
        },
        '[name=Instrument]': {
            observe: 'Instrument',
            selectOptions:{
              collections: []
            },
            setOptions: {
                validate: false
            }
        },
        '[name=ConditionsFilter]': {
            observe: 'ConditionsFilter',
            selectOptions:{
              collections: [],
              valuePath:'key',
              defaultOption:{
                label: 'Select Filter'
              }  
            },
            onSet: function(val){
              this.addDiv(val);
              return val;
              
              
            },

            setOptions: {
                validate: false
            }
        },
           '[name=ConditionsInput]':{
             observe: 'ConditionsInput',
             events: ['keypress'],

         },
            '[name=Float]': {
            observe: 'Float',
            setOptions: {
                validate: false
            }
        },
         '[name=FloatTwo]': {
            observe: 'FloatTwo',
            setOptions: {
                validate: false
            }
        },
            '[name=ThreeOne]': {
            observe: 'ThreeOne',
                setOptions: {
                validate: false
            }
        },     
            '[name=ThreeTwo]': {
            observe: 'ThreeTwo',
                        setOptions: {
                validate: false
            }
        },
             '[name=User]': {
            observe: 'User',
            setOptions: {
                validate: false
            }
        },
            '[name=OtherUser]': {
            observe: 'OtherUser',
            setOptions: {
                validate: false
            }
        },
            '[name=UserFilter]': {
            observe: 'UserFiler',
            setOptions: {
                validate: false 
            },
            selectOptions:{
              collection: [],
              defaultOption: {
                label: 'Select Filter'
              }
            }
        },
         '[name=Name]': {
            observe: 'Name',
            setOptions: {
                validate: false
            }
        },
            '[name=Priority]': {
            observe: 'Priority',
                setOptions: {
                validate: false
            }
        },     
            '[name=Description]': {
            observe: 'Description',
            setOptions: {
                validate: false
            }
        },
          '[name=Email]': {
            observe: 'Email',
            setOptions: {
                validate: false
            }
          },
           '[name=Redmine]': {
            observe: 'Redmine',
            setOptions: {
                validate: false
            }
          },

           '[name=PhoneCall]': {
            observe: 'PhoneCall',
            setOptions: {
                validate: false
            }
          },

           '[name=TextMessage]': {
            observe: 'TextMessage',
            setOptions: {
                validate: false
            }
          },
            '[name=LogEvent]': {
            observe: 'LogEvent',
            setOptions: {
                validate: false
            }
          },
            //link the #id : to a function output Onset 
            //when ConitionsFilter changes so will 
            //# ConditionsInput. cool function
            //but didn't use it
            //'#ConditionsInput': 'ConditionsFilter',
            //'#ConditionTwo': 'ConditionsFilter'





        
    },

    initialize: function () {
        // This hooks up the validation
        // See: http://thedersen.com/projects/backbone-validation/#using-form-model-validation/validation-binding
        Backbone.Validation.bind(this);
        _.bindAll(this, "render", "submit", "reset", "remove", "conditionsFilter", "addDiv");
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
       // this.roles = ooi.collections.roles;
       // this.orgs = ooi.collections.orgs;
       // this.modalDialog = new ModalDialogView();
         return this;
    },

    render: function () {
        
        var assetTen = ooi.collections.assetTen;
        this.bindings["[name=ConditionsFilter]"].selectOptions.collection = (ooi.collections.assetTen.pluck('key'));
        this.bindings["[name=array]"].selectOptions.collection = this.collection.pluck('display_name');
        // will be dynamic 
        this.bindings["[name=Instrument]"].selectOptions.collection = [
    "Mooring", 
    "Sensor", 
    "Sensor Part", 
    "Coastal Glider", 
    "Open Ocean Glider", 
    "GWFP", 
    "CWFP", 
    "FBB", 
    "ISU", 
    "SBD", 
    "FreeWave", 
    "XEOS", 
    "ACOMM", 
    "WiFi", 
    "GPS", 
    "Battery Pack", 
    "Wind Turbine", 
    "Power", 
    "EM Chain", 
    "Backup Recovery Bouyancy 2", 
    "STC", 
    "Syntactic Sphere", 
    "Riser Instruments", 
    "Bouy Components", 
    "Anchor", 
    "Acoustic Release 1", 
    "Instruments", 
    "Telemetry", 
    "RTE", 
    "Acoustic Release 2", 
    "MOPAK", 
    "Flasher", 
    "IMM", 
    "Backup Recovery Bouyancy 1", 
    "Riser Telemetry", 
    "ISU SIM", 
    "Surface Bouy (Submersible)", 
    "Inductive Wire Rope", 
    "Conducting Stretch Hose", 
    "Riser", 
    "Blipper", 
    "Light"
  ];
        //this.bindings["[name=role_name]"].selectOptions.collection = this.roles.pluck('role_name');
        //this.bindings["[name=organization]"].selectOptions.collection = this.orgs.pluck('organization_name');

        this.stickit();
        return this;
    },
    addDiv: function(val){
      //adds a div and input under conditions on the html
      //adds bindings 
      //need to remove white space. may use _
      var value = val.replace(/\s+/g, '_');
      

      $('#Conditions').append('<div class="form-group"> <div class="form-control" name='+value+'> '+ val +' </div> <span class="help-block hidden"></span> </div>');

    
     $('#ConditionsInput').append('<div class="form-group"> <input class="form-control" id='+  value   + ' name="FloatOne"></input> <span class="help-block hidden"></span></div>');
     this.addBinding(null, '#'+value, value);
     console.log(this.bindings);
    },

    submit: function () {
        var self = this;
        console.log(this.model);
        // Check if the model is valid before saving
        // See: http://thedersen.com/projects/backbone-validation/#methods/isvalid
        //  on submit check for the role then change the role_id to the correct int
        if (this.model.isValid(false)) {
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
    reset: function(){
        this.$el.find("input[type=text], textarea").val("");
        //this.$el.find("input[type=password], textarea").val("");
        //this.$el.find("input[type=email], textarea").val("");
    },
    conditionsFilter: function(e){
     // not needed. I use onSet in the above binding
     console.log('conditions filter changed'); 
    },
  
    remove: function () {
        // Remove the validation binding
        // See: http://thedersen.com/projects/backbone-validation/#using-form-model-validation/unbinding
        Backbone.Validation.unbind(this);
        return Backbone.View.prototype.remove.apply(this, arguments);
    }
});
