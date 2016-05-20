"use strict";


var ArgentineBasinView = Backbone.View.extend({

  initialize: function() {
    _.bindAll(this, "render");
    var self = this;
    self.render();
  },
  template: JST['ooiui/static/js/partials/landing/argentine_basin/ArgentineBasin.html'],
  render: function() {
    this.$el.html(this.template());
    
    new ArgentineBasinLocationSamplingView({
      el: this.$el.find('#locationsampling-view')
    });

    new ArgentineBasinDescriptionInfrastructureView({
      el: this.$el.find('#description-infrastructure-view')
    });

     new ArgentineBasinStationSummaryView({
      el: this.$el.find('#station-summary-view')
    });

    new ArgentineBasinDeploymentView({
      el: this.$el.find('#deployment-view')
    });

    new ArgentineBasinDetailedInfrastructureTablesView({
      el: this.$el.find('#detailed-infrastructure-view')
    });

    new ArgentineBasinTechnicalDrawingView({
      el: this.$el.find('#technical-drawing-view')
    });
  } 
});
