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
        }

    }
});

var TocPageControlModel = Backbone.Model.extend({
    defaults : {
        toggles : [
            ['refDesToggle', 'Reference Designators'],
            ['engToggle', 'Engineering Instruments'],
//            ['metaDataToggle', 'Meta Data']
        ],

        params : {
            "General":[
                ["temperature", "Temperature"],
                ["pressure", "Pressure"],
                ['ph', 'pH'],
                ['nitrate', 'Nitrate'],
                ["co2", "CO2"],
                ['density', 'Density'],
                ['salinity', 'Salinity']
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
                ['par', 'PAR'],
                ['chlorophyll', 'Chlorophyll'],
                ['dissolved_o2', 'Dissolved O2'],
                ['water_velocity', 'Water Velocity'],
                ['microbial_dna', 'Microbial DNA'],
                ['depth', 'Depth'],
                ['turbidity', 'Turbidity'],
                ['seismic_activity', 'Seismic Activity'],
            ],
            "Seafloor": [
                ['seafloor_movement', 'Seafloor Movement'],
                ['hydrothermal_vent_fluid_chemistry', 'Hydrothermal Vent Fluid Chemistry'],
                ['bethnic_fluid_flow_rate', 'Benthic Fluid Flow Rate'],
            ],
            "Large Format Data":[
                ['antelope', 'Hydrophone'],
                ['camds', 'Still Images'],
                ['camhd', 'HD Video'],
                ['zplsc', 'Bioacoustic Sonar']
            ]
        }
    }
});
