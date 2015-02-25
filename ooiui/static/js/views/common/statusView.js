var StatusModel = Backbone.Model.extend({

  defaults:{
    'display_name': "brian",
    'reference_designator': "smith",
    'type': 'Glider'
  }
})

var StatusCollection = Backbone.Collection.extend({})



var StatusViews= Backbone.View.extend({
  el:'.content',

  collection: StatusCollection,

  initialize: function(){
    _.bindAll(this, "render","getTypes","createSelect","setFilter","filterByType");
    this.render(this.collection)
    //this.$el.find("#filter").append(this.createSelect());
    this.createSelect()
    this.on("change:filterType", this.filterbyType, this);
  },
  //template: JST['ooiui/static/js/partials/statusItem.html'],


  render :function(collection){
    //console.log(collection)
    _(collection.models).each(function(model){
      var str = model.get('display_name').toLowerCase()
    //  console.log(str)
      if(str.search('mooring') !==-1){
        model.set({type: 'mooring'})

      }else if(str.search('glider')!==-1){
        model.set({type: 'glider'})

      }else{
        model.set({type:'none'})
      }
      console.log(model)

      var statusView = new StatusView({model: model});
      //var status_elem= statusView.render()
      $('#status-view').append(statusView.el);
    })
  },
  getTypes:function(){
    console.log(" get types called")
    console.log(this.collection.pluck("type"))
    var unique = _.uniq(this.collection.pluck("type"))
    console.log(unique) 
    return unique
    //return _.uniq(this.collection.pluck("type"), false, function(type){
    //  console.log(type)
    //  console.log(type)
   // return _(unique).each(function(type){  
     // console.log(type)
      //return type.toLowerCase();
     //});
  },
  createSelect:function(){
    console.log(' create selectcalled')
    var filter = this.$el.find("#filter"),
    select = $("<select/>", {
      html: "<option value='all'>All</option>"
    });
    console.log('after select')
    var get = this.getTypes()
    console.log(get)
     _(get).each(function(item){
       console.log(item)
       var option = $("<option/>", {
           value: item.toLowerCase(),
           text: item.toLowerCase()
       }).appendTo(select);
     });
     select.id ="type"
     console.log(select)
     $('#filter').append(select)
     //return select;
  },

  events: {
    "change #type select": "setFilter",
    "click #BUTTON": "setFilter"
  },

  setFilter: function(event){
    console.log('set filter is called')
    this.filterType = event.currentTraget.value;
    this.trigger("change:filterType")
  },
  filterByType:function(){
    console.log('filter by type is called')
//    if (this.filterType === "all"){
//      this.collection.reset(contacts);
             // contactsRouter.navigate("filter/all");
//    } 
//    else{
//      this.collection.reset(contacts, { silent: true });
//      var filterType = this.filterType,
//      filtered = _.filter(this.collection.models,function (item){
//        return item.get("type").toLowerCase() === filterType;
//                  });

  //            this.collection.reset(filtered);

              //contactsRouter.navigate("filter/" + filterType);
//          }
     }

})

var StatusView= Backbone.View.extend({
  collection: StatusCollection,

  initialize: function(){
    _.bindAll(this, "render");
    this.render()
    //console.log(this.collection)
    //this.listenTo(this.collection, 'add', this.addstatus)

  },
  events: {
    "change #type select": "setFilter",
    "click #BUTTON": "setFilter"
  },

  template: JST['ooiui/static/js/partials/statusItem.html'],

  setFilter: function(){
    console.log('clicked')
  },

  render: function(){
    //this.$el.html(this.template({model: this.model}))
  
    this.$el.html(this.template({model: this.model}))
  },

  addstatus:function(){
    console.log('I LISTENED')
  }

})


