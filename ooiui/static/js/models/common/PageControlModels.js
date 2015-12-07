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
        params : {
            "General":[
                ["temperature", "Temperature"],
                ["pressure", "Pressure"],
                ["co2", "CO2"]
            ],
            "Air Sea Interface":[
                ['humidity', 'Humidity'],
                ['wind_velocity', 'Wind Velocity'],
                ['precipitation', 'Precipitation'],
                ['air_sea_co2_flux', 'Air Sea CO2 Flux'],
                ['air_sea_heat_flux', 'Air Sea Heat Flux'],
                ['wave_properties', 'Wave Properties']
            ],
            "Water Column": [    
                ['downwelling_irradiance', 'Downwelling Irradiance'],
                ['ph', 'PH'],
                ['par', 'PAR'],
                ['chlorophyll', 'Chlorophyll'],
                ['dissolved_o2', 'Dissolved O2'],
                ['water_velocity', 'Water Velocity'],
                ['hd_video', 'HD Video'],
                ['still_images', 'Still Images'],
                ['no3-', 'NO3-'],
                ['microbial_dna', 'Microbial DNA'],
                ['depth', 'Depth'],
                ['turbidity', 'Turbidity'],
                ['seismic_activity', 'Seismic Activity'],
                ['acoustics', 'Acoustics']
            ],
            "Seafloor": [
                ['seafloor_movement', 'Seafloor Movement'],
                ['hydrothermal_vent_fluid_chemistry', 'Hydrothermal Vent Fluid Chemistry'],
                ['bethnic_fluid_flow_rate', 'Bethnic Fluid Flow Rate'],
                ['density', 'Density'],
                ['salinity', 'Salinity']
            ]
        }
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
