"use strict";


var PioneerArrayView = Backbone.View.extend({

    initialize: function() {
                    _.bindAll(this, "render");
                    var self = this;
                    self.render();
                },
    template: JST['ooiui/static/js/partials/landing/pioneer_array/PioneerArray.html'],
    render: function() {
        this.$el.html(this.template());
        
        new PioneerLocationSamplingView({
          el: this.$el.find('#pioneer-location-sampling-view')
        });

        new PioneerInfrastructureArrayView({
          el: this.$el.find('#infrastructureArray-view')
        });

        new PioneerStationSummaryArrayView({
          el: this.$el.find('#stationSummaryArray-view')
        });

        new PioneerDeploymentScheduleView({
          el: this.$el.find('#deploymentSchedule-view')
        });

        new PioneerTechnicalDrawingsView({
          el: this.$el.find('#technicalDrawings-view')
        });
    } 
});
