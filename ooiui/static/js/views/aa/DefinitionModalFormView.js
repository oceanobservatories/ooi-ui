"use strict";
/*
 * ooiui/static/js/views/aa/DefinitionModalFormView.js
 * View for alert definition modal
 */

var DefinitionModalFormView = ModalFormView.extend({
  bindings: {    
    
  },
  events: {
    "click #addDef": "onSubmit",
    "change input[name='alertalarm']": "updatedType"
  },
  initialize: function() {
    _.bindAll(this, "render","onSubmit","form_validate","updatedType");
    // Intentionally left blank to override parent
  },
  initalRender:function(){
    this.$el.html('<i class="fa fa-spinner fa-spin" style="margin-top:50px;margin-left:50%;font-size:90px;color:#337ab7;"> </i>');
  },
  template: JST['ooiui/static/js/partials/DefinitionModalForm.html'],
  updatedType : function(evt){
    //make escalate visible and or required
    if (this.$el.find('input[name="alertalarm"]:checked').attr('val') == "alert"){
      this.$el.find('#inputEscalateOn').closest('.escalate-field').css('visibility',"visible");
      this.$el.find('#inputEscalateBoundary').closest('.escalate-field').css('visibility',"visible");
      //this.$el.find('#inputEscalateBoundary')[0].setAttribute('required','')
      //this.$el.find('#inputEscalateOn')[0].setAttribute('required','')
    }else{
      this.$el.find('#inputEscalateOn').closest('.escalate-field').css('visibility',"hidden");
      this.$el.find('#inputEscalateBoundary').closest('.escalate-field').css('visibility',"hidden");
      //this.$el.find('#inputEscalateBoundary').removeAttr('required')
      //this.$el.find('#inputEscalateOn').removeAttr('required')
    }    
  },
  form_validate:function(attr_id){
    var result = true;
    $('#'+attr_id).validator('validate');
    $('#'+attr_id+' .form-group').each(function(){
        if($(this).hasClass('has-error')){
            result = false;
            return false;
        }
    });
    return result;
  },
  onSubmit: function(e) { 
    var self = this;

    this.$el.find('#addDefinitionForm').validator('validate');   
    
    var isValid = this.form_validate('addDefinitionForm');
    //stop the page redirect
    e.preventDefault();         
    if (!isValid) {
      // handle the invalid form...
      console.log('invalid form submit')  
    } else {      
      
      this.model.set('active',false);   //bool
      this.model.set('array_name',this.model.get('reference_designator').substr(0,2));   //str
      this.model.set('description',this.$el.find('#inputDescription').val()); //str
      this.model.set('event_type',this.$el.find('input[name="alertalarm"]:checked').attr('val')); //str
      this.model.set('high_value',this.$el.find('#inputMaxVal').val());  //str
      this.model.set('low_value',this.$el.find('#inputMinVal').val());   //str      
      this.model.set('severity',this.$el.find('#inputSeverityVal').val());   //str      

    
      var selected = this.$el.find("#paramSelection option:selected")
      this.model.set('instrument_name',this.model.get('reference_designator'));   //str
      this.model.set('instrument_parameter',selected.attr('param'));
      this.model.set('instrument_parameter_pdid',selected.attr('val'));   //str      

      this.model.set('platform_name',this.model.get('reference_designator').split('-').slice(0, 2).join('-'));   //str

      selected = this.$el.find("#operatorSelection option:selected")
      this.model.set('operator',selected.attr('val'));   //str

      this.model.set('escalate_on',0.0);   //float

      if (this.$el.find('input[name="alertalarm"]:checked').attr('val') == "alert"){
        this.model.set('escalate_boundary',parseFloat(this.$el.find('#inputEscalateBoundary').val()));   //float
        this.model.set('escalate_on',parseFloat(this.$el.find('#inputEscalateOn').val()));   //float
      }else{
        this.model.set('escalate_boundary',0);   //float/int
        this.model.set('escalate_on',0);   //float/int
      }
      

      var comMethods = this.$el.find('.com-method');
      _.each(comMethods, function(com_method) { 
        var name = $(com_method).attr('val')
        self.model.set(name,false);   //bool
      });

      //TODO UPDATE STATIC
      this.model.set('user_id',1);   //int

      this.model.save(null,{success: function(model, response, opts) { 
                                              console.log('OK!');
                                              ooi.trigger('addDefinitionForm:added'); 
                                            },
                            error: function(model, response, opts) { 
                                              console.log('Error!');
                                              ooi.trigger('addDefinitionForm:failed'); 
                                            }                   
                            });      
            
      this.hide();
    }
    
  },
  render: function() {   
    var self = this;

    //TODO FIX LATER
    var sample_stream = this.model.get('stream')
    this.model.set('stream',sample_stream.split('_').slice(1).join('_'))    
    //Backbone.Validation.bind(this);
    console.log(this.model,"model")

    this.$el.html(this.template({
      model: this.model,
      metadata_collection: this.metadata_collection,
      username: this.username
    }));

    this.$el.find('.selectpicker').selectpicker();
    this.$el.find('#addDefinitionForm').validator();     
    //this.stickit();      
  }
});
