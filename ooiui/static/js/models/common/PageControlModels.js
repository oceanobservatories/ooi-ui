var DataCatalogPageControlModel = Backbone.Model.extend({
    defaults : {
        params : [
            ['oxygen', 'Oxygen'],
            ['nitrate', 'Nitrate'],
            ['temperature', 'Temperature'],
            ['salinity', 'Salinity'],
            ['optical', 'Optical'],
            ['velocity', 'Currents / Velocities']
        ]
    }
});

