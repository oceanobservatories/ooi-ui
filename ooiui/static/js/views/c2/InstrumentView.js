"use strict";
/*
* ooiui/static/js/views/c2/InstrumentView.js
* View definitions for charts
*
* Dependencies
* Libs
* - ooiui/static/lib/underscore/underscore.js
* - ooiui/static/lib/backbone/backbone.js
* - ooiui/static/js/ooi.js
* Models
*
* Usage
*/
var InstrumentView = Backbone.View.extend({
  tagName: 'div',
  className: '',
  events: {
  },
  /*
   * When one of the links are clicked we trigger this method which gets the
   * data-id attribute in the tag and publishes a new event org:click with the
   * model_id as the parameter.
   */
  onClick: function(event) {
  },
  /*
   * During initialization of this view we fetch the collection and render when
   * it's complete.
   */
 initialize: function(options) {
    _.bindAll(this, "render");
    this.render();
  },


  render: function() {
    var self = this;

    var $wind = $("#instr_window");

    $wind.append("<h5><b>Instrument Name:  </b> "+this.collection.display_name+"</h5>");
    //$wind.append("<h5><b>Status:  </b> "+this.collection.operational_status+"</h5>");
    //until status is working
    $wind.append("<h5><b>Status:  </b> Unknown</h5>");
    if(this.collection.operational_status =='Online'){
        $wind.append("<h2><i style='pointer-events: none; font-size:25px;' class='fa fa-thumbs-up c2-online'></i></h2>");
    }
    else if(this.collection.operational_status =='Offline'){
        $wind.append("<h2><i style='pointer-events: none; font-size:25px;' class='ffa fa-thumbs-down c2-offline'></i></h2>");
    }
    else{
        $wind.append("<h2><i style='pointer-events: none; font-size:25px;' class='fa fa-question-circle c2-unknown'></i></h2>");
    }
  }
});
