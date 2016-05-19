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
            ['clearFilters', 'Clear Search']
        ]
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
                ['CTDAVN CTDBPC CTDBPD CTDBPE CTDBPF CTDBPN CTDBPO CTDBPP CTDGVM CTDMOG CTDMOH CTDMOQ CTDMOR CTDPFA CTDPFB CTDPFJ CTDPFK CTDPFL CTDWaterTempGen', 'Water Temperature'],
                ['PRESFA PRESFB PRESFC PRESTA PRESTB CTDAVN CTDBPC CTDBPD CTDBPE CTDBPF CTDBPN CTDBPO CTDBPP CTDGVM CTDMOG CTDMOH CTDMOQ CTDMOR CTDPFA CTDPFB CTDPFJ CTDPFK CTDPFL CTDPress', 'Pressure'],
                ['PHSENA PHSENB PHSEND PHSENE PHSENF PHpH', 'pH'],
                ['NUTNRB NUTNRA NUTNRM NUTNRNitrate', 'Nitrate'],
                ['CTDAVN CTDBPC CTDBPD CTDBPE CTDBPF CTDBPN CTDBPO CTDBPP CTDGVM CTDMOG CTDMOH CTDMOQ CTDMOR CTDPFA CTDPFB CTDPFJ CTDPFK CTDPFL CTDDensity', 'Density'],
                ['CTDAVN CTDBPC CTDBPD CTDBPE CTDBPF CTDBPN CTDBPO CTDBPP CTDGVM CTDMOG CTDMOH CTDMOQ CTDMOR CTDPFA CTDPFB CTDPFJ CTDPFK CTDPFL CTDSalinGen', 'Salinity'],
                ['OPTAAC OPTAAD OPTAAJ FLNTUA FLCDRA FLORDD FLORDL FLORDM FLORTD FLORTJ FLORTK FLORTM FLORTChloro', 'Chlorophyll'],
                ['OPTAAC OPTAAD OPTAAJ OPTAATurbid', 'Turbidity']
            ],
            "Air Sea Interface":[
                ['FDCHPA METBKA FDCMETAirTemp', 'Air Temperature'],
                ['FDCHPA METBKA FDCMETHumid', 'Humidity'],
                ['FDCHPA METBKA FDCMETWindVelo', 'Wind Velocity'],
                ['METBKA METBKAPrecip', 'Precipitation'],
                ['PC02AA PC02Atmo', 'Atmospheric CO2'],
                ['PC02AA PC02Air-Sea', 'Air-Sea CO2 Flux'],
                ['PC02WA PC02WB PC02WC PC02AA PC02Sea', 'Seawater CO2'],
                ['FDCHPA METBKA FDCMETAir-SeaHeat', 'Air-Sea Heat Flux'],
                ['METBKA METBKADownIrrad', 'Downwelling Irradiance'],
                ['METBKA METBKAAtmoPress', 'Atmospheric Pressure'],
                ['CTDAVN CTDBPC CTDBPD CTDBPE CTDBPF CTDBPN CTDBPO CTDBPP CTDGVM CTDMOG CTDMOH CTDMOQ CTDMOR CTDPFA CTDPFB CTDPFJ CTDPFK CTDPFL METBKA CTDWaterTempAir-Sea', 'Water Temperature'],
                ['CTDAVN CTDBPC CTDBPD CTDBPE CTDBPF CTDBPN CTDBPO CTDBPP CTDGVM CTDMOG CTDMOH CTDMOQ CTDMOR CTDPFA CTDPFB CTDPFJ CTDPFK CTDPFL METBKA CTDSalinAir-Sea', 'Salinity'],
                ['METBKA METBKAHumid', 'Humidity'],
                ['WAVSSA WAVSSAWave', 'Wave Properties']
            ],
            "Water Column": [
                ['SPKIRA SPKIRB SPKIRJ SPIKRSpectral', 'Spectral Irradiance'],
                ['PARADA PARADJ PARADK PARADM PARADPAR', 'PAR'],
                ['VADCPA VEL3DB VEL3DC VEL3DD VEL3DK VEL3DL VELPTA VELPTB VELPTD VELPTJ ADCPAM ADCPSI ADCPSJ ADCPSK ADCPSL ADCPSN ADCPTA ADCPTB ADCPTD ADCPTE ADCPTF ADCPTG ADCPTM ADCWaterVelo', 'Water Velocity'],
                ['ZPLSCB ZPLSCC ZPLSCBioacoustic', 'Bioacoustic Sonar'],
                ['ADCPTA ADCPTB ADCPTD ADCPTE ADCPTF ADCPTG ADCPTM ADCPWaveProps', 'Wave Properties'],
                ['FLNTUA FLCDRA FLORDD FLORDL FLORDM FLORTD FLORTJ FLORTK FLORTM FLORTTurbid', 'Turbidity']
            ],
            "Seafloor": [
                ['HYDBBA HYDLFA HYDHydroFloor', 'Hydrophone'],
                ['MASSPA THSPHA TRHPHA TMPSFA TMPHydroThermal', 'Hydrothermal Vent Chemistry'],
                ['HPIESA HPIESWaterVelo', 'Water Velocity'],
                ['TMPSFA HPIESA TMPPIEWaterTemp', 'Water Temperature'],
                ['OBSBBA OBSSPA OBSSeismic', 'Seismic Activity'],
                ['BOTPTA PRESFA PRESFB PRESFC PRESTA PRESTB HPIESA PRESSeaFloorPress', 'Seafloor Pressure']
            ],
            "Large Format Data":[
                ['HYDBBA HYDLFA HYDHydrophoneLarge', 'Hydrophone'],
                ['CAMDSC CAMDSB CAMLarge', 'Still Images'],
                ['CAMHDA HDLarge', 'HD Video'],
                ['ZPLSCB ZPLSCC ZPLBioacousticLarge', 'Bioacoustic Sonar'],
                ['OBSBBA OBSSPA OBSSeismicLarge', 'Seismic Activity']
            ]
        }
    }
});
