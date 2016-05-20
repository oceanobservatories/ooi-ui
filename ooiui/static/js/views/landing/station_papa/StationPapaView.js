"use strict";


var StationPapaView = Backbone.View.extend({

    initialize: function() {
                    _.bindAll(this, "render");
                    var self = this;
                    self.render();
                },
    template: JST['ooiui/static/js/partials/landing/station_papa/StationPapa.html'],
    render: function() {
        this.$el.html(this.template());
        
        
        new StationPapaLocationSamplingView({
          el: this.$el.find('#location-sampling-view')
        });

        new StationPapaDescriptionInfrastructureView({
          el: this.$el.find('#description-infrastructure-view')
        });

        new StationPapaStationSummaryView({
          el: this.$el.find('#station-summary-view')
        });

        new StationPapaDeploymentView({
          el: this.$el.find('#deployment-view')
        });

        new StationPapaDetailedInfrastructureTablesView({
          el: this.$el.find('#detailed-infrastructure-tables-view')
        });

        new StationPapaTechnicalDrawingView({
          el: this.$el.find('#technical-drawing-view')
        });
    } 
});
