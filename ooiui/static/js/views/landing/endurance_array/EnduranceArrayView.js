"use strict";


var EnduranceArrayView = Backbone.View.extend({

  initialize: function() {
    _.bindAll(this, "render");
    var self = this;
    self.render();
  },
  template: JST['ooiui/static/js/partials/landing/endurance_array/EnduranceArray.html'],
  render: function() {
    this.$el.html(this.template());
    
    new EnduranceLocationSamplingView({
      el: this.$el.find('#endurance-location-sampling-view')
    });

    new EnduranceDescriptionInfrastructureArrayView({
      el: this.$el.find('#description-infrastructure-view')
    });

    new EnduranceStationSummaryView({
      el: this.$el.find('#endurance-station-summary-view')
    });

    new EnduranceDeploymentScheduleView({
      el: this.$el.find('#deployment-schedule-view')
    });

     new EnduranceInfrastructureTablesView({
      el: this.$el.find('#infrastructure-tables-view')
    });

    new EnduranceTechnicalDrawingsView({
      el: this.$el.find('#endurance-technical-drawings-view')
    });
  } 
});
