"use strict";


var IrmingerSeaView = Backbone.View.extend({

    initialize: function() {
                    _.bindAll(this, "render");
                    var self = this;
                    self.render();
                },
    template: JST['ooiui/static/js/partials/landing/irminger_sea/IrmingerSea.html'],
    render: function() {
        this.$el.html(this.template());
         
        new IrmingerSeaLocationSamplingView({
          el: this.$el.find('#locationsampling-view')
        });

        new IrmingerSeaDescriptionInfrastructureView({
          el: this.$el.find('#description-infrastructure-view')
        });

        new IrmingerSeaStationSummaryView({
          el: this.$el.find('#station-summary-view')
        });

        new IrmingerSeaDeploymentView({
          el: this.$el.find('#deployment-view')
        });

        new IrmingerSeaDetailedInfrastructureView({
          el: this.$el.find('#detailed-infrastructur-view')
        });

        new IrmingerSeaTechnicalDrawingsView({
          el: this.$el.find('#technical-drawings-view')
        });
    } 
});
