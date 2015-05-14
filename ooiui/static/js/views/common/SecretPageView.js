Backbone.Validation.configure({
    forceUpdate: true,
    
});

// Extend the callbacks to work with Bootstrap, as used in this example
// See: http://thedersen.com/projects/backbone-validation/#configuration/callbacks
_.extend(Backbone.Validation.callbacks, {
    valid: function (view, attr, selector) {
        var $el = view.$('[name=' + attr + ']'),
            $group = $el.closest('.form-group');

        $group.removeClass('has-error');
        $group.find('.help-block').html('').addClass('hidden');
    },
    invalid: function (view, attr, error, selector) {
        var $el = view.$('[name=' + attr + ']'),
            $group = $el.closest('.form-group');

        $group.addClass('has-error');
        $group.find('.help-block').html(error).removeClass('hidden');
    }
});

var SecretPageView = Backbone.View.extend({
    events: {
        'click #submitButton': function (e) {
            e.preventDefault();
            this.submit();
        },
        'click #resetButton': function (e){
            
            this.reset();
        }
    },

    // Use stickit to perform binding between
    // the model and the view
    // See: https://github.com/NYTimes/backbone.stickit
    bindings: {
        '[name=FCC_SF_Freewave_baud]': {
            observe: 'Freewave_baud',
            setOptions: {
                validate: true
            }
        },
        '[name=FCC_SF_Freewave_parity]': {
            observe: 'Freewave_parity',
            setOptions: {
                validate: true
            }
        },
        '[name=FCC_FC_Freewave_nbits]': {
            observe: 'Freewave_nbits',
            setOptions: {
                validate: true
            }
        },
            '[name=FCC_FC_Freewave_stop]': {
            observe: 'Freewave_stop',
            setOptions: {
                validate: true
            }
        },
            '[name=FCC_FC_Freewave_flowctl]': {
            observe: 'Freewave_flowctl',
            setOptions: {
                validate: true
            }
        },
            '[name=FCC_FC_Freewave_debuglevel]': {
            observe: 'Freewave_debuglevel',
            setOptions: {
                validate: true
            }
        },
            '[name= FCC_SF_Supervisor_baud]': {
            observe: 'primary_phone',
            setOptions: {
                validate: true
            }
        },
         '[name= FCC_SF_Supervisor_parity:]': {
            observe: 'secondary_phone',
            setOptions: {
                validate: true
            }
        },
            '[name=FCC_SF_Supervisor_nbits]': {
            observe: 'organization',
            selectOptions: {
              collection: []
            },
            setOptions: {
                validate: true
            }
        },      '[name= FCC_SF_Supervisor_stop:]': {
            observe: 'secondary_phone',
            setOptions: {
                validate: true
            }
        },
      '[name= FCC_SF_Supervisor_flowctl:]': {
            observe: 'secondary_phone',
            setOptions: {
                validate: true
            }
        },
       '[name= FCC_SF_Supervisor_debuglevel:]': {
            observe: 'secondary_phone',
            setOptions: {
                validate: true
            }
        },
       '[name= FCC_SF_GPS_baud:]': {
            observe: 'secondary_phone',
            setOptions: {
                validate: true
            }
        },
 '[name= FCC_SF_GPS_parity:]': {
            observe: 'secondary_phone',
            setOptions: {
                validate: true
            }
        },
 '[name= FCC_SF_GPS_nbits:]': {
            observe: 'secondary_phone',
            setOptions: {
                validate: true
            }
        },
 '[name= FCC_SF_GPS_flowctl:]': {
            observe: 'secondary_phone',
            setOptions: {
                validate: true
            }
        },
'[name= FCC_SF_GPS_debugleve:]': {
            observe: 'secondary_phone',
            setOptions: {
                validate: true
            }
        },
'[name= FCC_SF_PwrSya_baud:]': {
            observe: 'secondary_phone',
            setOptions: {
                validate: true
            }
        },
'[name= FCC_SF_PwrSya_parity:]': {
            observe: 'secondary_phone',
            setOptions: {
                validate: true
            }
        },
'[name= FCC_SF_PwrSya_nbits:]': {
            observe: 'secondary_phone',
            setOptions: {
                validate: true
            }
        },
'[name= FCC_SF_PwrSya_flowctrl:]': {
            observe: 'secondary_phone',
            setOptions: {
                validate: true
            }
        },
'[name= FCC_SF_PwrSya_debuglevel:]': {
            observe: 'secondary_phone',
            setOptions: {
                validate: true
            }
        },
//left off here
'[name= FCC_SF_Irid9522B_baud:]': {
            observe: 'secondary_phone',
            setOptions: {
                validate: true
            }
        },
'[name= FCC_SF_Irid9522B_parity:]': {
            observe: 'secondary_phone',
            setOptions: {
                validate: true
            }
        },

'[name= FCC_SF_Irid9522B_nbits:]': {
            observe: 'secondary_phone',
            setOptions: {
                validate: true
            }
        },

'[name= FCC_SF_Irid9522B_stop:]': {
            observe: 'secondary_phone',
            setOptions: {
                validate: true
            }
        },

'[name= FCC_SF_Irid9522B_flowctl:]': {
            observe: 'secondary_phone',
            setOptions: {
                validate: true
            }
        },

'[name= FCC_SF_Irid9522B_degbuglevel:]': {
            observe: 'secondary_phone',
            setOptions: {
                validate: true
            }
        },

'[name= FFC_DCL_DCLCon1_baud:]': {
            observe: 'secondary_phone',
            setOptions: {
                validate: true
            }
        },

'[name= FFC_DCL_DCLCon1_parity:]': {
            observe: 'secondary_phone',
            setOptions: {
                validate: true
            }
        },

'[name= FFC_DCL_DCLCon1_nbits:]': {
            observe: 'secondary_phone',
            setOptions: {
                validate: true
            }
        },

'[name= FFC_DCL_DCLCon1_stop:]': {
            observe: 'secondary_phone',
            setOptions: {
                validate: true
            }
        },

'[name= FFC_DCL_DCLCon1_flowctl:]': {
            observe: 'secondary_phone',
            setOptions: {
                validate: true
            }
        },
'[name= FFC_DCL_DCLCon2_baud:]': {
            observe: 'secondary_phone',
            setOptions: {
                validate: true
            }
        },

'[name= FFC_DCL_DCLCon2_parity:]': {
            observe: 'secondary_phone',
            setOptions: {
                validate: true
            }
        },

'[name= FFC_DCL_DCLCon2_nbits:]': {
            observe: 'secondary_phone',
            setOptions: {
                validate: true
            }
        },

'[name= FFC_DCL_DCLCon2_stop:]': {
            observe: 'secondary_phone',
            setOptions: {
                validate: true
            }
        },

'[name= FFC_DCL_DCLCon2_flowctl:]': {
            observe: 'secondary_phone',
            setOptions: {
                validate: true
            }
        },
'[name= FFC_DCL_DCLCon2_debuglevel:]': {
            observe: 'secondary_phone',
            setOptions: {
                validate: true
            }
        },
'[name= FFC_DCL_DCLCon3_baud:]': {
            observe: 'secondary_phone',
            setOptions: {
                validate: true
            }
        },

'[name= FFC_DCL_DCLCon3_parity:]': {
            observe: 'secondary_phone',
            setOptions: {
                validate: true
            }
        },

'[name= FFC_DCL_DCLCon3_nbits:]': {
            observe: 'secondary_phone',
            setOptions: {
                validate: true
            }
        },

'[name= FFC_DCL_DCLCon3_stop:]': {
            observe: 'secondary_phone',
            setOptions: {
                validate: true
            }
        },

'[name= FFC_DCL_DCLCon3_flowctl:]': {
            observe: 'secondary_phone',
            setOptions: {
                validate: true
            }
        },
'[name= FFC_DCL_DCLCon3_debuglevel:]': {
            observe: 'secondary_phone',
            setOptions: {
                validate: true
            }
        },
'[name= FFC_DCL_DCLCon4_baud:]': {
            observe: 'secondary_phone',
            setOptions: {
                validate: true
            }
        },

'[name= FFC_DCL_DCLCon4_parity:]': {
            observe: 'secondary_phone',
            setOptions: {
                validate: true
            }
        },

'[name= FFC_DCL_DCLCon4_nbits:]': {
            observe: 'secondary_phone',
            setOptions: {
                validate: true
            }
        },

'[name= FFC_DCL_DCLCon4_stop:]': {
            observe: 'secondary_phone',
            setOptions: {
                validate: true
            }
        },

'[name= FFC_DCL_DCLCon4_flowctl:]': {
            observe: 'secondary_phone',
            setOptions: {
                validate: true
            }
        },
'[name= FFC_DCL_DCLCon4_debuglevel:]': {
            observe: 'secondary_phone',
            setOptions: {
                validate: true
            }
        },
'[name= FFC_DCL_DCLCon5_baud:]': {
            observe: 'secondary_phone',
            setOptions: {
                validate: true
            }
        },

'[name= FFC_DCL_DCLCon5_parity:]': {
            observe: 'secondary_phone',
            setOptions: {
                validate: true
            }
        },

'[name= FFC_DCL_DCLCon5_nbits:]': {
            observe: 'secondary_phone',
            setOptions: {
                validate: true
            }
        },

'[name= FFC_DCL_DCLCon5_stop:]': {
            observe: 'secondary_phone',
            setOptions: {
                validate: true
            }
        },

'[name= FFC_DCL_DCLCon5_flowctl:]': {
            observe: 'secondary_phone',
            setOptions: {
                validate: true
            }
        },
'[name= FFC_DCL_DCLCon5_debuglevel:]': {
            observe: 'secondary_phone',
            setOptions: {
                validate: true
            }
        },
'[name= FFC_DCL_DCLCon6_baud:]': {
            observe: 'secondary_phone',
            setOptions: {
                validate: true
            }
        },

'[name= FFC_DCL_DCLCon6_parity:]': {
            observe: 'secondary_phone',
            setOptions: {
                validate: true
            }
        },

'[name= FFC_DCL_DCLCon6_nbits:]': {
            observe: 'secondary_phone',
            setOptions: {
                validate: true
            }
        },

'[name= FFC_DCL_DCLCon6_stop:]': {
            observe: 'secondary_phone',
            setOptions: {
                validate: true
            }
        },

'[name= FFC_DCL_DCLCon6_flowctl:]': {
            observe: 'secondary_phone',
            setOptions: {
                validate: true
            }
        },
'[name= FFC_DCL_DCLCon6_debuglevel:]': {
            observe: 'secondary_phone',
            setOptions: {
                validate: true
            }
        },
'[name= FFC_DCL_DCLCon7_baud:]': {
            observe: 'secondary_phone',
            setOptions: {
                validate: true
            }
        },

'[name= FFC_DCL_DCLCon7_parity:]': {
            observe: 'secondary_phone',
            setOptions: {
                validate: true
            }
        },

'[name= FFC_DCL_DCLCon7_nbits:]': {
            observe: 'secondary_phone',
            setOptions: {
                validate: true
            }
        },

'[name= FFC_DCL_DCLCon7_stop:]': {
            observe: 'secondary_phone',
            setOptions: {
                validate: true
            }
        },

'[name= FFC_DCL_DCLCon7_flowctl:]': {
            observe: 'secondary_phone',
            setOptions: {
                validate: true
            }
        },
'[name= FFC_DCL_DCLCon7_debuglevel:]': {
            observe: 'secondary_phone',
            setOptions: {
                validate: true
            }
        },

'[name= FFC_NCU_NC8_baud:]': {
            observe: 'secondary_phone',
            setOptions: {
                validate: true
            }
        },
'[name= FFC_NCU_NC8_parity:]': {
            observe: 'secondary_phone',
            setOptions: {
                validate: true
            }
        },
'[name= FFC_NCU_NC8_nbits:]': {
            observe: 'secondary_phone',
            setOptions: {
                validate: true
            }
        },
'[name= FFC_NCU_NC8_stop:]': {
            observe: 'secondary_phone',
            setOptions: {
                validate: true
            }
        },
'[name= FFC_NCU_NC8_flowctl:]': {
            observe: 'secondary_phone',
            setOptions: {
                validate: true
            }
        },
'[name= FFC_NCU_NC8_debuglevel:]': {
            observe: '',
            setOptions: {
                validate: true
            }
        },
'[name= FFC_NCU_NC11_baud:]': {
            observe: 'secondary_phone',
            setOptions: {
                validate: true
            }
        },
'[name= FFC_NCU_NC11_partiy:]': {
            observe: 'secondary_phone',
            setOptions: {
                validate: true
            }
        },

'[name= FFC_NCU_NC11_nbits:]': {
            observe: 'secondary_phone',
            setOptions: {
                validate: true
            }
        },
'[name= FFC_NCU_NC11_stop:]': {
            observe: 'secondary_phone',
            setOptions: {
                validate: true
            }
        },
'[name= FFC_NCU_NC11_flowctl:]': {
            observe: 'secondary_phone',
            setOptions: {
                validate: true
            }
        },

'[name= FFC_NCU_NC11_debuglevel:]': {
            observe: 'secondary_phone',
            setOptions: {
                validate: true
            }
        },

DCL_SF_Console_baud: {
          observe: , setOptions:{ validate:true}
        },
        DCL_SF_Console_parity: {
          observe: , setOptions:{ validate:true}
        },
        DCL_SF_Console_nbits: {
          observe: , setOptions:{ validate:true}
        },
        DCL_SF_Console_stop: {
          observe: , setOptions:{ validate:true}
        },
        DCL_SF_Console_flowctl: {
          observe: , setOptions:{ validate:true}
        },
        DCL_SF_Console_debuglevel: {
          observe: , setOptions:{ validate:true}
        },

        DCL_SF_Supervisor_baud: {
          observe: , setOptions:{ validate:true}
        },
        DCL_SF_Supervisor_parity: {
          observe: , setOptions:{ validate:true}
        },
        DCL_SF_Supervisor_nbits: {
          observe: , setOptions:{ validate:true}
        },
        DCL_SF_Supervisor_stop: {
          observe: , setOptions:{ validate:true}
        },
        DCL_SF_Supervisor_flowctl: {
          observe: , setOptions:{ validate:true}
        },
        DCL_SF_Supervisor_degbuglevel: {
          observe: , setOptions:{ validate:true}
        },

        DCL_SF_GPS_baud: {
          observe: , setOptions:{ validate:true}
        },
        DCL_SF_GPS_parity: {
          observe: , setOptions:{ validate:true}
        },
        DCL_SF_GPS_nbits : {
          observe: , setOptions:{ validate:true}
        },
        DCL_SF_GPS_stop: {
          observe: , setOptions:{ validate:true}
        },
        DCL_SF_GPS_flowctl: {
          observe: , setOptions:{ validate:true}
        },
        DCL_IPM_3dmgx3_baud: {
          observe: , setOptions:{ validate:true}
        },
        DCL_IPM_3dmgx3_parity: {
          observe: , setOptions:{ validate:true}
        },
        DCL_IPM_3dmgx3_nbits: {
          observe: , setOptions:{ validate:true}
        },
        DCL_IPM_3dmgx3_stop: {
          observe: , setOptions:{ validate:true}
        },
        DCL_IPM_3dmgx3_flowctl: {
          observe: , setOptions:{ validate:true}
        },
        DCL_IPM_3dmgx3_debuglevel: {
          observe: , setOptions:{ validate:true}
        },
        DCL_IMP_metbk_baud: {
          observe: , setOptions:{ validate:true}
        },
        DCL_IMP_metbk_parity: {
          observe: , setOptions:{ validate:true}
        },
        DCL_IMP_metbk_nbits: {
          observe: , setOptions:{ validate:true}
        },
        DCL_IMP_metbk_stop: {
          observe: , setOptions:{ validate:true}
        },
        DCL_IMP_metbk_flowctl: {
          observe: , setOptions:{ validate:true}
        },
        DCL_IMP_metbk_debuglevel: {
          observe: , setOptions:{ validate:true}
        },
        DCL_IMP_loadcell_baud: {
          observe: , setOptions:{ validate:true}
        },
        DCL_IMP_loadcell_parity: {
          observe: , setOptions:{ validate:true}
        },
        DCL_IMP_loadcell_nbits: {
          observe: , setOptions:{ validate:true}
        },
        DCL_IMP_loadcell_stop: {
          observe: , setOptions:{ validate:true}
        },
        DCL_IMP_loadcell_flowctl: {
          observe: , setOptions:{ validate:true}
        },
        DCL_IMP_loadcell_debuglevel: {
          observe: , setOptions:{ validate:true}
        },
        DCL_IMP_pco2_baud: {
          observe: , setOptions:{ validate:true}
        },
        DCL_IMP_pco2_parity: {
          observe: , setOptions:{ validate:true}
        },
        DCL_IMP_pco2_nbits: {
          observe: , setOptions:{ validate:true}
        },
        DCL_IMP_pco2_stop: {
          observe: , setOptions:{ validate:true}
        },
        DCL_IMP_pco2_flowctl: {
          observe: , setOptions:{ validate:true}
        },
        DCL_IMP_pco2_deduglevel: {
          observe: , setOptions:{ validate:true}
        },

        DCL_IMP_rreflect_baud: {
          observe: , setOptions:{ validate:true}
        },
        DCL_IMP_rreflect_parity: {
          observe: , setOptions:{ validate:true}
        },
        DCL_IMP_rreflect_nbits: {
          observe: , setOptions:{ validate:true}
        },
        DCL_IMP_rreflect_stop: {
          observe: , setOptions:{ validate:true}
        },
        DCL_IMP_rreflect_flowctl: {
          observe: , setOptions:{ validate:true}
        },
        DCL_IMP_rreflect_debuglevel: {
          observe: , setOptions:{ validate:true}
        },

        DCL_IMP_Inst6_baud: {
          observe: , setOptions:{ validate:true}
        },
        DCL_IMP_Inst6_parity: {
          observe: , setOptions:{ validate:true}
        },
        DCL_IMP_Inst6_nbits: {
          observe: , setOptions:{ validate:true}
        },
        DCL_IMP_Inst6_stop: {
          observe: , setOptions:{ validate:true}
        },
        DCL_IMP_Inst6_flowctl: {
          observe: , setOptions:{ validate:true}
        },
        DCL_IMP_Inst6_debuglevel: {
          observe: , setOptions:{ validate:true}
        },
        DCL_IMP_Inst7_baud: {
          observe: , setOptions:{ validate:true}
        },
        DCL_IMP_Inst7_parity: {
          observe: , setOptions:{ validate:true}
        },
        DCL_IMP_Inst7_nbits: {
          observe: , setOptions:{ validate:true}
        },
        DCL_IMP_Inst7_stop: {
          observe: , setOptions:{ validate:true}
        },
        DCL_IMP_Inst7_flowctl: {
          observe: , setOptions:{ validate:true}
        },
        DCL_IMP_Inst7_debuglevel: {
          observe: , setOptions:{ validate:true}
        },
        DCL_IMP_Inst8_baud: {
          observe: , setOptions:{ validate:true}
        },
        DCL_IMP_Inst8_parity: {
          observe: , setOptions:{ validate:true}
        },
        DCL_IMP_Inst8_nbits: {
          observe: , setOptions:{ validate:true}
        },
        DCL_IMP_Inst8_stop: {
          observe: , setOptions:{ validate:true}
        },
        DCL_IMP_Inst8_flowctl: {
          observe: , setOptions:{ validate:true}
        },
        DCL_IMP_Inst8_debuglevel: {
          observe: , setOptions:{ validate:true}
        },
        DCL_NCU_NC3_baud: {
          observe: , setOptions:{ validate:true}
        },
        DCL_NCU_NC3_parity: {
          observe: , setOptions:{ validate:true}
        },
        DCL_NCU_NC3_nbits: {
          observe: , setOptions:{ validate:true}
        },
        DCL_NCU_NC3_stop: {
          observe: , setOptions:{ validate:true}
        },
        DCL_NCU_NC3_flowctl: {
          observe: , setOptions:{ validate:true}
        },
        DCL_NCU_NC3_debuglevel: {
          observe: , setOptions:{ validate:true}
        },

        DCL_NCU_NC8_baud: {
          observe: , setOptions:{ validate:true}
        },
        DCL_NCU_NC8_parity: {
          observe: , setOptions:{ validate:true}
        },
        DCL_NCU_NC8_nbits: {
          observe: , setOptions:{ validate:true}
        },
        DCL_NCU_NC8_stop: {
          observe: , setOptions:{ validate:true}
        },
        DCL_NCU_NC8_flowctl: {
          observe: , setOptions:{ validate:true}
        },
        DCL_NCU_NC8_debuglevel: {
          observe: , setOptions:{ validate:true}
        },
        DCL_NCU_NC11_baud: {
          observe: , setOptions:{ validate:true}
        },
        DCL_NCU_NC11_parity: {
          observe: , setOptions:{ validate:true}
        },
        DCL_NCU_NC11_nbits: {
          observe: , setOptions:{ validate:true}
        },
        DCL_NCU_NC11_stop: {
          observe: , setOptions:{ validate:true}
        },
        DCL_NCU_NC11_flowctl: {
          observe: , setOptions:{ validate:true}
        },
        DCL_NCU_NC11_debuglevel: {
          observe: , setOptions:{ validate:true}
        },

        STC_SF_Freewave_baud: {
          observe: , setOptions:{ validate:true}
        },
        STC_SF_Freewave_parity: {
          observe: , setOptions:{ validate:true}
        },
        STC_SF_Freewave_nbits : {
          observe: , setOptions:{ validate:true}
        },
        STC_SF_Freewave_stop: {
          observe: , setOptions:{ validate:true}
        },
        STC_SF_Freewave_flowctl: {
          observe: , setOptions:{ validate:true}
        },
        STC_SF_Freewave_debuglevel: {
          observe: , setOptions:{ validate:true}
        },


        STC_SF_Supervisor_baud: {
          observe: , setOptions:{ validate:true}
        },
        STC_SF_Supervisor_parity: {
          observe: , setOptions:{ validate:true}
        },
        STC_SF_Supervisor_nbits : {
          observe: , setOptions:{ validate:true}
        },
        STC_SF_Supervisor_stop: {
          observe: , setOptions:{ validate:true}
        },
        STC_SF_Supervisor_flowctl: {
          observe: , setOptions:{ validate:true}
        },
        STC_SF_Supervisor_debuglevel: {
          observe: , setOptions:{ validate:true}
        },


        STC_SF_GPS_baud: {
          observe: , setOptions:{ validate:true}
        },
        STC_SF_GPS_parity: {
          observe: , setOptions:{ validate:true}
        },
        STC_SF_GPS_nbits: {
          observe: , setOptions:{ validate:true}
        },
        STC_SF_GPS_stop: {
          observe: , setOptions:{ validate:true}
        },
        STC_SF_GPS_flowctl: {
          observe: , setOptions:{ validate:true}
        },
        STC_SF_GPS_debuglevel: {
          observe: , setOptions:{ validate:true}
        },

        STC_SF_Irid9522B_baud: {
          observe: , setOptions:{ validate:true}
        },
        STC_SF_Irid9522B_parity: {
          observe: , setOptions:{ validate:true}
        },
        STC_SF_Irid9522B_nbits: {
          observe: , setOptions:{ validate:true}
        },
        STC_SF_Irid9522B_stop: {
          observe: , setOptions:{ validate:true}
        },
        STC_SF_Irid9522B_flowctl: {
          observe: , setOptions:{ validate:true}
        },
        STC_SF_Irid9522B_debuglevel: {
          observe: , setOptions:{ validate:true}
        },
        STC_IP_Unused1_baud: {
          observe: , setOptions:{ validate:true}
        },
        STC_IP_Unused1_parity: {
          observe: , setOptions:{ validate:true}
        },
        STC_IP_Unused1_nbits: {
          observe: , setOptions:{ validate:true}
        },
        STC_IP_Unused1_stop: {
          observe: , setOptions:{ validate:true}
        },
        STC_IP_Unused1_flowctl: {
          observe: , setOptions:{ validate:true}
        },
        STC_IP_Unused1_debuglevel: {
          observe: , setOptions:{ validate:true}
        },
        STC_IP_imm_baud: {
          observe: , setOptions:{ validate:true}
        },
        STC_IP_imm_parity: {
          observe: , setOptions:{ validate:true}
        },
        STC_IP_imm_nbits: {
          observe: , setOptions:{ validate:true}
        },
        STC_IP_imm_stop: {
          observe: , setOptions:{ validate:true}
        },
        STC_IP_imm_flowctl: {
          observe: , setOptions:{ validate:true}
        },
        STC_IP_imm_debuglevel: {
          observe: , setOptions:{ validate:true}
        },
        STC_IP_Unused2_baud: {
          observe: , setOptions:{ validate:true}
        },
        STC_IP_Unused2_parity: {
          observe: , setOptions:{ validate:true}
        },
        STC_IP_Unused2_nbits: {
          observe: , setOptions:{ validate:true}
        },
        STC_IP_Unused2_stop: {
          observe: , setOptions:{ validate:true}
        },
        STC_IP_Unused2_flowctl: {
          observe: , setOptions:{ validate:true}
        },
        STC_IP_Unused2_debuglevel: {
          observe: , setOptions:{ validate:true}
        },



        STC_IP_3dmgx3_baud: {
          observe: , setOptions:{ validate:true}
        },
        STC_IP_3dmgx3_parity: {
          observe: , setOptions:{ validate:true}
        },
        STC_IP_3dmgx3_nbits: {
          observe: , setOptions:{ validate:true}
        },
        STC_IP_3dmgx3_stop: {
          observe: , setOptions:{ validate:true}
        },
        STC_IP_3dmgx3_flowctl: {
          observe: , setOptions:{ validate:true}
        },
        STC_IP_3dmgx3_debuglevel: {
          observe: , setOptions:{ validate:true}
        },
        STC_IP_Unused3_baud: {
          observe: , setOptions:{ validate:true}
        },
        STC_IP_Unused3_parity: {
          observe: , setOptions:{ validate:true}
        },
        STC_IP_Unused3_nbits: {
          observe: , setOptions:{ validate:true}
        },
        STC_IP_Unused3_stop: {
          observe: , setOptions:{ validate:true}
        },
        STC_IP_Unused3_flowctl: {
          observe: , setOptions:{ validate:true}
        },
        STC_IP_Unused3_debuglevel: {
          observe: , setOptions:{ validate:true}
        },


        STC_NCU_NC3_baud: {
          observe: , setOptions:{ validate:true}
        },
        STC_NCU_NC3_parity: {
          observe: , setOptions:{ validate:true}
        },
        STC_NCU_NC3_nbits: {
          observe: , setOptions:{ validate:true}
        },
        STC_NCU_NC3_stop: {
          observe: , setOptions:{ validate:true}
        },
        STC_NCU_NC3_flowctl: {
          observe: , setOptions:{ validate:true}
        },
        STC_NCU_NC3_debuglevel: {
          observe: , setOptions:{ validate:true}
        },
        STC_NCU_NC5_baud: {
          observe: , setOptions:{ validate:true}
        },
        STC_NCU_NC5_parity: {
          observe: , setOptions:{ validate:true}
        },
        STC_NCU_NC5_nbits: {
          observe: , setOptions:{ validate:true}
        },
        STC_NCU_NC5_stop: {
          observe: , setOptions:{ validate:true}
        },
        STC_NCU_NC5_flowctl: {
          observe: , setOptions:{ validate:true}
        },
        STC_NCU_NC5_debuglevel: {
          observe: , setOptions:{ validate:true}
        },
        STC_NCU_NC7_baud: {
          observe: , setOptions:{ validate:true}
        },
        STC_NCU_NC7_parity: {
          observe: , setOptions:{ validate:true}
        },
        STC_NCU_NC7_nbits: {
          observe: , setOptions:{ validate:true}
        },
        STC_NCU_NC7_stop: {
          observe: , setOptions:{ validate:true}
        },
        STC_NCU_NC7_flowctl: {
          observe: , setOptions:{ validate:true}
        },
        STC_NCU_NC7_debuglevel: {
          observe: , setOptions:{ validate:true}
        },
        STC_NCU_NC8_baud: {
          observe: , setOptions:{ validate:true}
        },
        STC_NCU_NC8parity: {
          observe: , setOptions:{ validate:true}
        },
        STC_NCU_NC8_nbits: {
          observe: , setOptions:{ validate:true}
        },
        STC_NCU_NC8_stop: {
          observe: , setOptions:{ validate:true}
        },
        STC_NCU_NC8_flowctl: {
          observe: , setOptions:{ validate:true}
        },
        STC_NCU_NC8_debuglevel: {
          observe: , setOptions:{ validate:true}
        },
        STC_NCU_NC11_baud: {
          observe: , setOptions:{ validate:true}
        },
        STC_NCU_NC11_parity: {
          observe: , setOptions:{ validate:true}
        },
        STC_NCU_NC11_nbits: {
          observe: , setOptions:{ validate:true}
        },
        STC_NCU_NC11_stop: {
          observe: , setOptions:{ validate:true}
        },
        STC_NCU_NC11_flowctl: {
          observe: , setOptions:{ validate:true}
        },
        STC_NCU_NC11_debuglevel: {
          observe: , setOptions:{ validate:true}
        },







    initialize: function () {
        // This hooks up the validation
        // See: http://thedersen.com/projects/backbone-validation/#using-form-model-validation/validation-binding
        Backbone.Validation.bind(this);
        _.bindAll(this, "render", "submit", "reset", "remove");
        // functions defined within a function, need to be able to set attributes of "this"
        // so in order to do that, we define "self" which currently points to this, in this case the UserFormView
        //this.roles = ooi.collections.roles;
        //this.orgs = ooi.collections.orgs;
        //this.modalDialog = new ModalDialogView();
        this.render();
    },

    render: function () {
// this.bindings["[name=role_name]"].selectOptions.collection = this.roles.pluck('role_name');
  //      this.bindings["[name=organization]"].selectOptions.collection = this.orgs.pluck('organization_name');
        console.log("render");
        this.stickit();
        //this.$el.append(this.modalDialog.el);
        return this;
    },

    submit: function () {
        var self = this;
        // Check if the model is valid before saving
        // See: http://thedersen.com/projects/backbone-validation/#methods/isvalid
        //  on submit check for the role then change the role_id to the correct int
        if (this.model.isValid(true)) {
            this.model.set("role_id", this.roles.findWhere({role_name: this.model.get('role_name')}).get('id'));
            this.model.set("organization_id", this.orgs.findWhere({organization_name: this.model.get('organization')}).get('id'));
            this.model.set('_csrf_token', ooi.csrf_token)
            // Needs to be dynamic (update)
            this.model.save(null, {
              success: function(model, response) {
                self.modalDialog.show({
                  message: "User successfully registered",
                  type: "success",
                  ack: function() { 
                    window.location = "/"
                  }
                });
              },
              error: function(model, response) {
                try {
                  var errMessage = JSON.parse(response.responseText).error;
                } catch(err) {
                  console.error(err);
                  var errMessage = "Unable to submit user";
                }
                self.modalDialog.show({
                  message: errMessage,
                  type: "danger",
                });
                console.error(model);
                console.error(response.responseText);
              }
            });
        }
    },
    reset: function(){
      console.log('rsetclicked');
        // resests the page. Not sure it's the correct procedure?? 
        this.$el.find("input[type=text], textarea").val("");
        this.$el.find("input[type=password], textarea").val("");
        this.$el.find("input[type=email], textarea").val("");
        // maybe this?? this.model.set({name: "","email":""})
    },

    remove: function () {
        // Remove the validation binding
        // See: http://thedersen.com/projects/backbone-validation/#using-form-model-validation/unbinding
        Backbone.Validation.unbind(this);
        return Backbone.View.prototype.remove.apply(this, arguments);
    }
});

