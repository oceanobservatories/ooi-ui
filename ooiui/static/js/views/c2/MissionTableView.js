"use strict";
/*
 * ooiui/static/js/views/c2/MissionTableView.js
 */

 var MissionExecutiveTableView = Backbone.View.extend({
  bindings: {
  },
  events: {
    "click #disableRow": "onClickDisable",
    "click #stopRow": "onClickStop",
  },
  initialize: function(options) {
    _.bindAll(this, "render","onClickStop","onClickDisable");
    if (options && options.collection){
      this.collection = options.collection;
    }
    this.initialRender();
  },
  initialRender:function(){
    this.$el.html('<i class="fa fa-spinner fa-spin" style="margin-top:50px;margin-left:50%;font-size:90px;color:#337ab7;"> </i>');
  },
  template: JST['ooiui/static/js/partials/StatusAlert.html'],
  deselectAll:function(){

    this.filter.searchBox().val("");
    this.filter.search();

    this.pageableGrid.clearSelectedModels();

    this.pageableGrid.collection.each(function (model, i) {
      model.trigger("backgrid:select", model, false);
    });

  },
  onClickDisable:function(ev){
    console.log("disable");
    var mission_id = $(ev.target).attr('mission_id')
    alert("Toggle State: "+ mission_id);
  },
  onClickStop:function(ev){
    console.log("stop");
    var mission_id = $(ev.target).attr('mission_id')
    alert("Stop: "+ mission_id);
  },
  render:function(options){
    var self = this;

    this.$el.html(this.template());

    var PageableModels = Backbone.PageableCollection.extend({
      model: MissionExecutiveModel,
      state: {
        pageSize: 10
      },
      mode: "client" // page entirely on the client side
    });

    var pageableCollection = new PageableModels(),
        longName;
    self.collection.each(function(model,i){
        console.log(model)        
        pageableCollection.add(model)
    });


    var ClickableRow = Backgrid.Row.extend({
      events: {
        "click": "onClick",
      },
      onClick: function (ev) {
        if ($(ev.target.parentElement).hasClass('selected')){
          this.model.trigger("backgrid:select", this.model,false);
          ooi.trigger('missionTable:rowDeselected',this.model);
        }else{
          this.model.trigger("backgrid:select", this.model,true);
          ooi.trigger('missionTable:rowSelected',this.model);
        }
      }
    });

    var HtmlCell = Backgrid.HtmlCell = Backgrid.Cell.extend({
      className: "html-cell",
      initialize: function () {
        Backgrid.Cell.prototype.initialize.apply(this, arguments);
      },
      render: function () {
        this.$el.empty();
        var rawValue = this.model.get(this.column.get("name"));
        var formattedValue = this.formatter.fromRaw(rawValue, this.model);
        this.$el.append(formattedValue);
        this.delegateEvents();
        return this;
      }
    });

    // Set up a grid to use the pageable collection
    self.pageableGrid = new Backgrid.Grid({
      row: ClickableRow,
      columns: self.columns,
      collection: pageableCollection
    });

    // Initialize the paginator
    var paginator = new Backgrid.Extension.Paginator({
      collection: pageableCollection
    });

    var nameClientFilter = Backgrid.Extension.ClientSideFilter.extend({
      makeMatcher: function(query){
        var q = query;
        return function (model) {
            try {
                var toFilter = (_.uniq(model.get('name').toLowerCase().split(' '))).join(' ');
                var keys = _.uniq(query.toLowerCase().split(' '));
                var valid = true;

                if (query.length > 1){
                  _.each(keys,function(key){
                    if (valid){
                      var idx = toFilter.indexOf(key);
                      if (idx == -1){
                        valid = false;
                      }
                    }
                  });
                }
                //console.log(toFilter,keys,valid)
                return valid;
            } catch(e) {
                //console.log(e);
                return false;
            }
        };
      }
    });

    self.filter = new nameClientFilter({
      collection: pageableCollection,
      placeholder: "Search...",
      fields: ['name','desc'],
      wait: 150
    });

    // Render the filter
    this.$el.find("#sampleTable").before(self.filter.render().el);

    // Add some space to the filter and move it to the right
    $(self.filter.el).css({float: "right", margin: "20px", "margin-top": "5px"});

    // Render the paginator
    this.$el.find("#sampleTable").before(paginator.render().el);

    // Render the grid and attach the root to your HTML document
    this.$el.find("#sampleTable").append(self.pageableGrid.render().el);

    this.$el.find('#sampleTable > table > thead > tr > th.select-all-header-cell').css('visibility','hidden');

    }
});

