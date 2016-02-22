"use strict";


var SouthernOceanView = Backbone.View.extend({

    initialize: function() {
                    _.bindAll(this, "render");
                    var self = this;
                    self.render();
                },
    template: JST['ooiui/static/js/partials/landing/southern_ocean/SouthernOcean.html'],
    render: function() {
        this.$el.html(this.template());
          
        new SouthernOceanLocationSamplingView({
          el: this.$el.find('#locationsampling-view')
        });

        new SouthernOceanDescriptionInfrastructureView({
          el: this.$el.find('#description-infrastructure-view')
        });

        new SouthernOceanStationSummaryView({
          el: this.$el.find('#station-summary-view')
        });

        new SouthernOceanDeploymentView({
          el: this.$el.find('#deployment-view')
        });

        new SouthernOceanDetailedInfrastructureTablesView({
          el: this.$el.find('#detailed-infrastructure-view')
        });

        new SouthernOceanTechnicalDrawingView({
          el: this.$el.find('#technical-drawing-view')
        });
    } 
});
