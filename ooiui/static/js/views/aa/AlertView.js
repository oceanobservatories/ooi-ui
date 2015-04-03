/*
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


var AlertFilterView = Backbone.View.extend({
   events: {
        'click #saveAlert': function (e) {
            e.preventDefault();
            this.submit();
        },
        'click #RemoveConditions':function(e) {
          e.preventDefault();
          this.removeConditions(e);
        }
    },

    // Use stickit to perform binding between
    // the model and the view
    bindings: {
        '[name=array]': {
            observe: 'array',
            selectOptions: {
                collection: []
            },

            setOptions: {
                validate:false 
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
                validate: true
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
    },

    initialize: function () {
        Backbone.Validation.bind(this);
        _.bindAll(this, "render", "triggerTOCClick","submit", "remove", "addConditions", "removeConditions", "addSelect" );
         
        this.listenTo(ooi, 'arrayItemView:arraySelect', this.triggerTOCClick);
        this.listenTo(ooi, 'platformDeploymentItemView:platformSelect',this.triggerTOCClick);
        this.listenTo(ooi, 'instrumentDeploymentItemView:instrumentSelect', this.triggerTOCClick);
        this.listenTo(ooi, 'streamItemView:streamSelect', this.changeStream);
        var self = this;

        this.OptionalModel = Backbone.Model.extend({
        });
       
        //this.listenTo(this.collection, 'reset', function(){
        self.render();
        //});
    },

    render: function () {

        var self = this;
        var AlertsFullCollectionPage = Backbone.PageableCollection.extend({
            model: AlertModel,
            url:"/api/aa/arrays",
            state: {
              pageSize: 7
            },
            mode: "client",
            parse: function(response, options) {
              //this.trigger("pageabledeploy:updated", { count : response.count, total : response.total, startAt : response.startAt } );
              return response.alert_alarm_definition;
            } 
        });

        var pageablealerts = new AlertsFullCollectionPage();
        self.collection = pageablealerts;

        var columns = [{
            name: "array_name", // The key of the model attribute
            label: "Array", // The name to display in the header
            editable: false, // By default every cell in a column is editable, but *ID* shouldn't be
            cell: "string"
        }, {
            name: "instrument_name",
            label: "Platform",
            editable: false,
            // The cell type can be a reference of a Backgrid.Cell subclass, any Backgrid.Cell subclass instances like *id* above, or a string
            cell: "string",
            formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
              fromRaw: function (rawValue, model) {
                return "Platform Q";
              }
            }),
            sortValue: function (model, colName) {
                return colName;
            }
        },{
            name: "instrument_name",
            label: "Instrument",
            editable: false,
            cell: "string",
            formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
              fromRaw: function (rawValue, model) {
                return rawValue;
              }
            }) ,
            sortValue: function (model, colName) {
                return model.attributes[colName]['owner'];
            }
        }, {
            name: "priority",
            label: "Priority",
            editable: false,
            cell: "string",
            formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
              fromRaw: function (rawValue, model) {
                return rawValue;
              }
            }),
            sortValue: function (model, colName) {
                return model.attributes[colName]['type'];
            }
        }, {
            name: "created_time",
            label: "Created",
            editable: false,
            cell: "string"
        },{
            name: "description",
            editable: false,
            label: "Descritption",
            cell: "string"
        }];

        //add click event
        var ClickableRow = Backgrid.Row.extend({
          highlightColor: "#eee",
          events: {
            "click": "onClick",
            mouseover: "rowFocused",
            mouseout: "rowLostFocus"
          },
          onClick: function () {
            Backbone.trigger("deployrowclicked", this.model);
            this.el.style.backgroundColor = this.highlightColor;
            var $table = $('#table-transform');
            $table.bootstrapTable();
          },
          rowFocused: function() {
            this.el.style.backgroundColor = this.highlightColor;
          },
          rowLostFocus: function() {
            this.el.style.backgroundColor = '#FFF';
          }
        });

        // Set up a grid to use the pageable collection
        var pageableGrid = new Backgrid.Grid({
          columns: columns,
          collection: pageablealerts,
          row: ClickableRow
        });

        // Render the grid and attach the root to your HTML document
        $("#alertslist").append(pageableGrid.render().el);

        // Initialize the paginator
        var paginator = new Backgrid.Extension.Paginator({
          collection: pageablealerts
        });

        // Render the paginator
        $("#alertslist").after(paginator.render().el);
        var AssetFilter = Backgrid.Extension.ClientSideFilter.extend({
          placeholder: "Search",
          makeMatcher: function(query){
               return function (model) {
                return true;
              };
          }
        });

        var filter = new AssetFilter({
          collection: pageablealerts
        });
        self.filter = filter;

        // Render the filter
        $("#alertslist").before(filter.render().el);
        // Add some space to the filter and move it to the right
        $(filter.el).css({float: "right", margin: "20px"});
        $(filter.el).find("input").attr('id', 'alert_search_box');

        pageablealerts.fetch({reset: true,
            error: (function (e) {
                alert(' Service request failure: ' + e);
            }),
            complete: (function (e) {
                
            })
        });

        //move clicked row to edit panel
        Backbone.on("deployrowclicked", function (model) {
            self.addConditions(model);
        });

        //needs model to stickit not using right now
        //this.stickit();
    },

    addConditions: function(val){
      //adds a div and input under conditions on the html
      //adds bindings 
      var streamName = val.stream_name; 
      val = val.param;
      
      var value = val.replace(/\s+/g, '_');
      var value_description = value + '_description';
      var value_priority = value + '_priority';
      var value_symbol = value + '_symbol';
      var value_user= value + '_user';
 
     $('#Conditions').prepend('<div class="form-group"> <div class="form-control"  name='+value+'> '+ val +' </div> <span class="help-block hidden"></span> </div>');

     $('#SymbolInput').prepend(' <div class="form-group"><select class="form-control" id='+value_symbol+' > <option> > </option> <option> < </option> <option> = </option> </select> <span class="help-block hidden"></span></div>');
    
     $('#ConditionsInput').prepend('<div class="form-group"> <input class="form-control" id='+value+'></input> <span class="help-block hidden"></span></div>');
     $('#RemoveConditions').prepend('<div class="form-group "> <button class="btn btn-success" id='+  value   + '>'+ 'X' +' </button> <span class="help-block hidden"></span></div>');
     $('#addtionalInformation').prepend('<div name='+value+' class="row col-sm-12"> <div class="col-sm-12"> <div class="form-group"> <label for="Name" class="col-sm-3 control-label">Name</label> <div class="col-sm-9"><div class="form-control"  name='+value+'> '+ val +' </div> <span class="help-block hidden"></span> </div> </div> </div> <div class="col-sm-12"> <div class="form-group"> <label for="priority" class="col-sm-3 control-label">Priority</label> <div class="col-sm-9"> <select class="form-control" id='+value_priority+' ></select> <span class="help-block hidden"></span> </div> </div> </div> <div class="col-sm-12"> <div class="form-group"> <label for="lastname" class="col-sm-3 control-label">Description</label> <div class="col-sm-9"> <textarea type="text" class="form-control" id='+value_description+'/></textarea> <span class="help-block hidden"></span> </div> </div> </div><hr width="80%"> </div> ');

     $('#Users').prepend('<div class="form-group"><select class="form-control" id='+value_user +'> </select> <span class="help-block hidden"></span> </div>');

     var optionalModel = new this.OptionalModel();
     optionalModel.set({
       'alert':value, 
       'stream_name': streamName, 
       'alert_id': ooi.collections.post.nextOrder(),
       'user_name': ooi.models.userModel.get('user_name'),
       'user_id': ooi.models.userModel.get('user_id')
     });
     
     this.addBinding(optionalModel, '#'+value_description, 'description');
     this.addBinding(optionalModel, '#'+value_priority, {
       observe:'priority',
       selectOptions:{
         collection: [{name:'Low', num: 1},{name:'Normal', num: 2},{name:'High', num:3},{name:'Urgent', num:4},{name:"Immediate", num:5}],
         labelPath:'name',
         valuePath:'num'
       }
       });
     this.addBinding(optionalModel, '#'+value, 'alert_input');
     this.addBinding(optionalModel, '#'+value_symbol, {
       observe:'symbol',
       selectOptions:{
         collection: ['<', '>', '='],
         defaultOption:{
           label:"Select Symbol"
         }
       }
     });
     this.addBinding(optionalModel, '#'+value_user, {
       observe:'assignee',
       selectOptions: {
         collection : this.collection.pluck('user_name'),
         defaultOption: {
          label: 'Add Assignee'
           }
       },
       onSet:function(val){
         console.log(val);
         var redmineId =this.collection.findWhere({user_name: val});
         redmineId = redmineId.get(val);
         optionalModel.set('assignee_id', redmineId);

         console.log(redmineId);
         return val;
       }
     });

     ooi.collections.post.add(optionalModel);
    },

    /*click on the left hand side of the TOC */
    triggerTOCClick:function(tocitem){
        console.log(tocitem);
        this.addSelect();
        //this.model.set('array',data.get('display_name')); 
    },

    addSelect: function(){
     // console.log('add select called');
      var self = this;
      $('#Filter').html('<select class="form-control" id="ConditionsFilter" name="ConditionsFilter"> </select> <span class="help-block hidden"></span>');
      
    },

    changeStream: function(data){

    },

    submit: function () {
        var self = this;
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
    
    conditionsFilter: function(e){

    },
    
    removeConditions: function(e){
      //need some assertions or check...
      //clicking too fast messes everything up.
      var remove = e.target.id;
      
      var button = e.target;
      
      button.remove();
      $('#'+remove).remove();
      $('#'+remove+'_priority').remove();
      $('#'+remove+'_description').remove();
      $('#'+remove+'_symbol').remove();
      $('[name='+remove+']').remove();
      $('#'+remove).remove();
      $('#'+remove+'_user').remove();
      
      ooi.collections.post.remove(ooi.collections.post.findWhere({'alert':remove}));
    },
  
    remove: function () {
        Backbone.Validation.unbind(this);
        return Backbone.View.prototype.remove.apply(this, arguments);
    }
});
