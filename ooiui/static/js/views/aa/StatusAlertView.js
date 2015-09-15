"use strict";
/*
 * ooiui/static/js/views/aa/StatusAlertView.js
 */

 var StatusAlertView = Backbone.View.extend({
  bindings: {
  },
  events: {    
  },
  initialize: function() {
    _.bindAll(this, "render");    
    this.initialRender();
  },
  initialRender:function(){
    this.$el.html('<i class="fa fa-spinner fa-spin" style="margin-top:50px;margin-left:50%;font-size:90px;color:#337ab7;"> </i>');
  },
  template: JST['ooiui/static/js/partials/StatusAlert.html'],
  render:function(options){
    var self = this;

    this.$el.html(this.template());

    console.log(self.collection);

    //create a mix of ref des, stream, and param and event id
    var ref_list_mix = _.uniq(this.collection.map(function(model){        
        return model.get('feature_id');
    }));

    var ref_collection = this.collection.where({feature_id: ref_list_mix[0]});

    var newmodel = null;
    var history = ""
    _.each(ref_collection, function(model,i) {
        newmodel = model;
        history+="<li>"+model.get('timestamp')+"_"+model.get('event_response')+"</li>"
    });

    // set fields, render
    this.$el.find('#ref').text(newmodel.get('reference_designator'));
    this.$el.find('#title').text(newmodel.get('aa_def_id'));
    this.$el.find('#type').text(newmodel.get('event_type'));
    this.$el.find('#outline').text(newmodel.get('feature_id'));

    this.$el.find('#history').html(history);

    }     
});

