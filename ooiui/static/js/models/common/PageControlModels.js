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
                ["CTDAVN CTDBPC CTDBPD CTDBPE CTDBPF CTDBPN CTDBPO CTDBPP CTDGVM CTDMOG CTDMOH CTDMOQ CTDMOR CTDPFA CTDPFB CTDPFJ CTDPFK CTDPFL", "Water Temperature"],
                ["PRESFA PRESFB PRESFC PRESTA PRESTB CTDAVN CTDBPC CTDBPD CTDBPE CTDBPF CTDBPN CTDBPO CTDBPP CTDGVM CTDMOG CTDMOH CTDMOQ CTDMOR CTDPFA CTDPFB CTDPFJ CTDPFK CTDPFL", "Pressure"],
                ['PHSENA PHSENB PHSEND PHSENE PHSENF', 'pH'],
                ['NUTNRB NUTNRA NUTNRM', 'Nitrate'],
                ['CTDAVN CTDBPC CTDBPD CTDBPE CTDBPF CTDBPN CTDBPO CTDBPP CTDGVM CTDMOG CTDMOH CTDMOQ CTDMOR CTDPFA CTDPFB CTDPFJ CTDPFK CTDPFL', 'Density'],
                ['CTDAVN CTDBPC CTDBPD CTDBPE CTDBPF CTDBPN CTDBPO CTDBPP CTDGVM CTDMOG CTDMOH CTDMOQ CTDMOR CTDPFA CTDPFB CTDPFJ CTDPFK CTDPFL', 'Salinity']
                ['OPTAAC OPTAAD OPTAAJ FLNTUA FLCDRA FLORDD FLORDL FLORDM FLORTD FLORTJ FLORTK FLORTM', 'Chlorophyll'],
                ['OPTAAC OPTAAD OPTAAJ', 'Turbidity']
            ],
            "Air Sea Interface":[
                ['FDCHPA METBKA', 'Air Temperature'],
                ['FDCHPA METBKA', 'Humidity'],
                ['FDCHPA METBKA', 'Wind Velocity'],
                ['METBKA', 'Precipitation'],
                ['PC02AA', 'Atmospheric CO2'],
                ['PC02AA', 'Air-Sea CO2 Flux'],
                ['PC02WA PC02WB PC02WC PC02AA', 'Seawater CO2'],
                ['METBKA FDCHPA', 'Air-Sea Heat Flux'],
                ['METBKA', 'Downwelling Irradiance'],
                ['METBKA', 'Atmospheric Pressure'],
                ['CTDAVN CTDBPC CTDBPD CTDBPE CTDBPF CTDBPN CTDBPO CTDBPP CTDGVM CTDMOG CTDMOH CTDMOQ CTDMOR CTDPFA CTDPFB CTDPFJ CTDPFK CTDPFL METBKA', 'Water Temperature'],
                ['CTDAVN CTDBPC CTDBPD CTDBPE CTDBPF CTDBPN CTDBPO CTDBPP CTDGVM CTDMOG CTDMOH CTDMOQ CTDMOR CTDPFA CTDPFB CTDPFJ CTDPFK CTDPFL METBKA', 'Salinity'],
                ['METBKA', 'Humidity'],
                ['WAVSSA', 'Wave Properties']
            ],
            "Water Column": [
                ['SPKIRA SPKIRB SPKIRJ', 'Spectral Irradiance'],
                ['PARADA PARADJ PARADK PARADM', 'PAR'],
                ['VADCPA VEL3DB VEL3DC VEL3DD VEL3DK VEL3DL VELPTA VELPTB VELPTD VELPTJ ADCPAM ADCPSI ADCPSJ ADCPSK ADCPSL ADCPSN ADCPTA ADCPTB ADCPTD ADCPTE ADCPTF ADCPTG ADCPTM', 'Water Velocity'],
                ['ZPLSCB ZPLSCC', 'Bioacoustic Sonar'],
                ['ADCPTA ADCPTB ADCPTD ADCPTE ADCPTF ADCPTG ADCPTM', 'Wave Properties'],
                ['FLNTUA FLCDRA FLORDD FLORDL FLORDM FLORTD FLORTJ FLORTK FLORTM', 'Turbidity']
            ],
            "Seafloor": [
                ['HYDBBA HYDLFA', 'Hydrophone'],
                ['MASSPA THSPHA TRHPHA TMPSFA', 'Hydrothermal Vent Chemistry'],
                ['HPIESA', 'Water Velocity'],
                ['TMPSFA HPIESA', 'Water Temperature'],
                ['BOTPTA', 'Seafloor Pressure'],
                ['OBSBBA OBSSPA', 'Seismic Activity'],
                ['PRESFA PRESFB PRESFC PRESTA PRESTB HPIESA', 'Seafloor Pressure']
            ],
            "Large Format Data":[
                ['HYDBBA HYDLFA', 'Hydrophone'],
                ['CAMDSC CAMDSB', 'Still Images'],
                ['CAMHDA', 'HD Video'],
                ['ZPLSCB ZPLSCC', 'Bioacoustic Sonar'],
                ['OBSBBA OBSSPA', 'Seismic Activity']
            ]
        }
    }
});
