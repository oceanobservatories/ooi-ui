var StatusModel = Backbone.Model.extend({

  defaults:{
    'display_name': "name",
    'reference_designator': "123",
    'type': 'none'
  }
})

var StatusCollection = Backbone.Collection.extend({})



var StatusViews= Backbone.View.extend({

  collection: StatusCollection,
  
  template: JST['ooiui/static/js/partials/StatusItems.html'],


  initialize: function(){
    _.bindAll(this, "render","filterByType");
    var self = this;
    this.collection_list =[] 
    this.on("change:filterType", this.filterByType, this);
    this.collection.on("add",this.render, this)
    this.collection.on("add", this.createSelect, this)
    this.collection.on("reset", this.render, this)
    return this
  },


  render :function(){
    var collection_list = this.collection_list   
    this.$el.html(this.template())


    _(this.collection.models).each(function(model){
      var str = model.get('display_name').toLowerCase()
      if(str.search('mooring') !==-1){
        model.set({type: 'mooring'})

      }else if(str.search('glider')!==-1){
        model.set({type: 'glider'})

      }else{
        model.set({type:'none'})
      }
      collection_list.push(model)
      var statusView = new StatusView({model: model});
      $('#status-view').append(statusView.el);
 
   
    })
  },

 
// functions below are used to create a dynamic selection options. 
// It will be used in conjunction with Uframe assests and events to create dynamic options


  //  getTypes:function(){
 //   console.log(" get types called")
//    console.log(this.collection.pluck("type"))
//    var unique = _.uniq(this.collection.pluck("type"))
//    console.log(unique) 
//    return unique
//  },
 // createSelect:function(){
 //   console.log(' create selectcalled')
 //   var filter = this.$el.find("#filter"),
    
 //   select = $("<select/>", {
 //     html: "<option value='all'>All</option>"
 //   });
 //   var get = this.getTypes()
 //   console.log(get)
 //    _(get).each(function(item){
 //      console.log(item)
  //     var option = $("<option/>", {
 //          value: item.toLowerCase(),
 //          text: item.toLowerCase()
 //      }).appendTo(select);
//     });
//     console.log(select)
     //this.$el.find("#filter").html(select);
     
 //    filter.html(select);
 //    return select;
 // },

  events: {
    "change #filter select": "setFilter"
  },

 // setFilter: function(event){
    //console.log('set filter is called')
    //console.log(event.currentTarget.value);
//    this.filterType = event.currentTarget.value;
//    this.trigger("change:filterType")
//  },
  filterByType:function(type){
    console.log(type)
    console.log(this.collection_list)
    var Array_models = this.collection_list 
    console.log('filter by type is called')
    if (type === "all"){
      this.collection.reset(Array_models);
    } 
    else{
     // console.log(this.collection)
      this.collection.reset(Array_models, { silent: true });
     // console.log(this.collection.models)
      var filterType = type,
        filtered = _.filter(this.collection.models,function (item){
        console.log(item.get("type"))
        return item.get("type").toLowerCase() === filterType;
                  });

            this.collection.reset(filtered);
            console.log(filtered)
          }
    
   // need to fix this 
     // this.$el.find("#filter").html(this.createSelect());
     }

      

})

var StatusView= Backbone.View.extend({
  collection: StatusCollection,

  initialize: function(){
    _.bindAll(this, "render");
    this.listenTo(ooi.views.statusFilterView, 'change:resetButton', this.reset)
    this.render()
    //console.log(this.collection)
    //this.listenTo(this.collection, 'add', this.addstatus)

  },
  events: {
    //"click button": "addstatus",
    "click button": "addstatus"
  },

  template: JST['ooiui/static/js/partials/StatusItem.html'],

  setFilter: function(){
    console.log('clicked')
  },

  render: function(){
   // console.log(this.collection)
   //console.log(this.model)
   this.$el.html(this.template({model: this.model}))
  
    //this.$el.html(this.template({collection: this.collection}))
  },

  addstatus:function(){
    console.log('I LISTENED')
    
  },
  reset:function(){
    console.log('statusview reset called')

    $('#assetButton').remove()
  }

})

var StatusFilterView = Backbone.View.extend({
  collection: StatusCollection,
  initialize: function(){
    _.bindAll(this, "render", "setFilter", "reset");
    this.render()
        
  },
  events:{
    "click #submitButton": "setFilter",
    "click #resetButton": "reset"

  },
  template: JST['ooiui/static/js/partials/StatusFilter.html'],

  render:function(){
    this.$el.html(this.template())
  },
  setFilter: function(){
    console.log('submit button render page')
    var assetType =$("#assetType").val()
    console.log(assetType)
    console.log(this.collection)
    ooi.views.statusViews.filterByType(assetType)
  },
  reset: function(){
    console.log('reset called')
    $('#assetButton').remove()
    this.trigger('change:resetButton')
  }


})
