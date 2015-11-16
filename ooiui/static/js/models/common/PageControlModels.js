var AssetManagementPageControlModel = Backbone.Model.extend({
    defaults : {
        params : [
            ['past', 'Recovered'],
            ['present', 'Deployed']
        ]
    }
});

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

var TocPageControlModel = Backbone.Model.extend({
    defaults : {
        params : [
            ['refDesToggle', 'Toggle Reference Designators'],
//            ['engToggle', 'Engineering Instruments'],
//            ['metaDataToggle', 'Meta Data']
        ]
    }
});
