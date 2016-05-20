"use strict";

var CabledArrayView = Backbone.View.extend({

  initialize: function() {
    _.bindAll(this, "render");
    var self = this;
    self.render();
  },
  template: JST['ooiui/static/js/partials/landing/cabled_array/CabledArray.html'],
  render: function() {
    this.$el.html(this.template());
    
    
    new CabledArrayLocationSamplingView({
      el: this.$el.find('#location-sampling-view')
    });
    new CabledArrayPrimaryInfrastructureView({
      el: this.$el.find('#primary-infrastructure-view')
    });

    new CabledArraySecondaryInfrastructureView({
      el: this.$el.find('#secondary-infrastructure-view')
    });

    new CabledArrayStationSummaryView({
      el: this.$el.find('#station-summary-view')
    });

    new CabledArrayDeploymentSchedualView({
      el: this.$el.find('#deployment-schedule-view')
    });

    new CabledArrayDetailedInfrastructureTablesView({
      el: this.$el.find('#detailed-infrastructure-tables-view')
    });

    new CabledArrayTechnicalDrawingsView({
      el: this.$el.find('#technical-drawings-view')
    });
  } 
});
