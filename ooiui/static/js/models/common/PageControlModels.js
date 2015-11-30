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
            ['humidity', 'Humidity'],
            ['wind_velocity', 'Wind Velocity'],
            ['atmospheric_co2', 'Atmospheric CO2'],
            ['air_temperature', 'Air Temperature'],
            ['atmospheric_pressue', 'Atmospheric Pressure'],
            ['precipitation', 'Precipitation'],
            ['air_sea_co2_flux', 'Air Sea CO2 Flux'],
            ['air_sea_heat_flux', 'Air Sea Heat Flux'],
            ['downwelling_irradiance', 'Downwelling Irradiance'],
            ['ph', 'PH'],
            ['par', 'PAR'],
            ['chlorophyll', 'Chlorophyll'],
            ['wave_properties', 'Wave Properties'],
            ['dissolved_o2', 'Dissolved O2'],
            ['density', 'Density'],
            ['water_temperature', 'Water Temperature'],
            ['water_velocity', 'Water Velocity'],
            ['salinity', 'Salinity'],
            ['seawater_co2', 'Seawater CO2'],
            ['hd_video', 'HD Video'],
            ['still_images', 'Still Images'],
            ['no3-', 'NO3-'],
            ['microbial_dna', 'Microbial DNA'],
            ['depth', 'Depth'],
            ['turbidity', 'Turbidity'],
            ['seismic_activity', 'Seismic Activity'],
            ['acoustics', 'Acoustics'],
            ['seafloor_movement', 'Seafloor Movement'],
            ['seafloor_pressure', 'Seafloor Pressure'],
            ['hydrothermal_vent_fluid_chemistry', 'Hydrothermal Vent Fluid Chemistry'],
            ['bethnic_fluid_flow_rate', 'Bethnic Fluid Flow Rate']
            
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
