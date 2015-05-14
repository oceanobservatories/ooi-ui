// Define a model with some validation rules
var SecretPageModel = Backbone.Model.extend({
    defaults: {
        role_name: "Administrator",
        organization: "ASA",
        role_id: 0
    },
    url: "/api/user/",
    
    validation: {
        FCC_SF_Freewave_baud: {
            required: true
        },
         FCC_SF_Freewave_parity: {
            required: true
        },
        FCC_SF_Freewave_nbits : {
            required: true
        },
        FCC_SF_Freewave_stop: {
            required: true
        },
        FCC_SF_Freewave_flowctl: {
            required: true
        },
        FCC_SF_Freewave_debuglevel: {
            required: true
        },
        
        
        FCC_SF_Supervisor_baud: {
            required: true
        },
         FCC_SF_Supervisor_parity: {
            required: true
        },
        FCC_SF_Supervisor_nbits : {
            required: true
        },
        FCC_SF_Supervisor_stop: {
            required: true
        },
        FCC_SF_Supervisor_flowctl: {
            required: true
        },
        FCC_SF_Supervisor_debuglevel: {
            required: true
        },
        
        
        FCC_SF_GPS_baud: {
            required: true
        },
        FCC_SF_GPS_parity: {
            required: true
        },
        FCC_SF_GPS_nbits: {
            required: true
        },
         FCC_SF_GPS_stop: {
            required: true
        },
        FCC_SF_GPS_flowctl: {
            required: true
        },
        FCC_SF_GPS_debug_level: {
            required: true
        },


        FFC_SF_PwrSya_baud : {
            required: true
        },
        FFC_SF_PwrSya_parity: {
            required: true
        },
        FFC_SF_PwrSya_nbits: {
            required: true
        },
        FFC_SF_PwrSya_stop: {
            required: true
        },
        FFC_SF_PwrSya_flowctl: {
            required: true
        },
        FFC_SF_PwrSya_debuglevel: {
            required: true
        },

        FFC_SF_Irid9522B_baud : {
            required: true
        },
        FFC_SF_Irid9522B_parity: {
            required: true
        },
        FFC_SF_Irid9522B_nbits: {
            required: true
        },
        FFC_SF_Irid9522B_stop: {
          required: true
        },
        FFC_SF_Irid9522B_flowctl: {
          required: true
        },
        FFC_SF_Irid9522B_debuglevel: {
          required: true
        },

        FFC_DCL_DCLCon1_baud: {
          required: true
        },
        FFC_DCL_DCLCon1_parity: {
          required: true
        },
        FFC_DCL_DCLCon1_nbits: {
          required: true
        },
        FFC_DCL_DCLCon1_stop: {
          required: true
        },
        FFC_DCL_DCLCon1_flowctl: {
          required: true
        },
        FFC_DCL_DCLCon1_debuglevel: {
          required: true
        },


        FFC_DCL_DCLCon2_baud: {
          required: true
        },
        FFC_DCL_DCLCon2_parity: {
          required: true
        },
        FFC_DCL_DCLCon2_nbits: {
          required: true
        },
        FFC_DCL_DCLCon2_stop: {
          required: true
        },
        FFC_DCL_DCLCon2_flowctl: {
          required: true
        },
        FFC_DCL_DCLCon2_debuglevel: {
          required: true
        },

        FFC_DCL_DCLCon3_baud: {
          required: true
        },
        FFC_DCL_DCLCon3_parity: {
          required: true
        },
        FFC_DCL_DCLCon3_nbits: {
          required: true
        },
        FFC_DCL_DCLCon3_stop: {
          required: true
        },
        FFC_DCL_DCLCon3_flowctl: {
          required: true
        },
        FFC_DCL_DCLCon3_debuglevel: {
          required: true
        },

        FFC_DCL_DCLCon4_baud: {
          required: true
        },
        FFC_DCL_DCLCon4_parity: {
          required: true
        },
        FFC_DCL_DCLCon4_nbits: {
          required: true
        },
        FFC_DCL_DCLCon4_stop: {
          required: true
        },
        FFC_DCL_DCLCon4_flowctl: {
          required: true
        },
        FFC_DCL_DCLCon4_debuglevel: {
          required: true
        },

        FFC_DCL_DCLCon5_baud: {
          required: true
        },
        FFC_DCL_DCLCon5_parity: {
          required: true
        },
        FFC_DCL_DCLCon5_nbits: {
          required: true
        },
        FFC_DCL_DCLCon5_stop: {
          required: true
        },
        FFC_DCL_DCLCon5_flowctl: {
          required: true
        },
        FFC_DCL_DCLCon5_debuglevel: {
          required: true
        },
        FFC_DCL_DCLCon6_baud: {
          required: true
        },
        FFC_DCL_DCLCon6_parity: {
          required: true
        },
        FFC_DCL_DCLCon6_nbits: {
          required: true
        },
        FFC_DCL_DCLCon6_stop: {
          required: true
        },
        FFC_DCL_DCLCon6_flowctl: {
          required: true
        },
        FFC_DCL_DCLCon6_debuglevel: {
          required: true
        },

        FFC_DCL_DCLCon7_baud: {
          required: true
        },
        FFC_DCL_DCLCon7_parity: {
          required: true
        },
        FFC_DCL_DCLCon7_nbits: {
          required: true
        },
        FFC_DCL_DCLCon7_stop: {
          required: true
        },
        FFC_DCL_DCLCon7_flowctl: {
          required: true
        },
        FFC_DCL_DCLCon7_debuglevel: {
          required: true
        },

        FFC_NCU_NC8_baud: {
          required: true
        },
        FFC_NCU_NC8_parity: {
          required: true
        },
        FFC_NCU_NC8_nbits: {
          required: true
        },
        FFC_NCU_NC8_stop: {
          required: true
        },
        FFC_NCU_NC8_flowctl: {
          required: true
        },
        FFC_NCU_NC8_debuglevel: {
          required: true
        },


        FFC_NCU_NC11_baud: {
          required: true
        },
        FFC_NCU_NC11_parity: {
          required: true
        },
        FFC_NCU_NC11_nbits: {
          required: true
        },
        FFC_NCU_NC11_stop: {
          required: true
        },
        FFC_NCU_NC11_flowctl: {
          required: true
        },
        FFC_NCU_NC11_debuglevel: {
          required: true
        },


        DCL_SF_Console_baud: {
          required: true
        },
        DCL_SF_Console_parity: {
          required: true
        },
        DCL_SF_Console_nbits: {
          required: true
        },
        DCL_SF_Console_stop: {
          required: true
        },
        DCL_SF_Console_flowctl: {
          required: true
        },
        DCL_SF_Console_debuglevel: {
          required: true
        },

        DCL_SF_Supervisor_baud: {
          required: true
        },
        DCL_SF_Supervisor_parity: {
          required: true
        },
        DCL_SF_Supervisor_nbits: {
          required: true
        },
        DCL_SF_Supervisor_stop: {
          required: true
        },
        DCL_SF_Supervisor_flowctl: {
          required: true
        },
        DCL_SF_Supervisor_degbuglevel: {
          required: true
        },

        DCL_SF_GPS_baud: {
          required: true
        },
        DCL_SF_GPS_parity: {
          required: true
        },
        DCL_SF_GPS_nbits : {
          required: true
        },
        DCL_SF_GPS_stop: {
          required: true
        },
        DCL_SF_GPS_flowctl: {
          required: true
        },
        DCL_IPM_3dmgx3_baud: {
          required: true
        },
        DCL_IPM_3dmgx3_parity: {
          required: true
        },
        DCL_IPM_3dmgx3_nbits: {
          required: true
        },
        DCL_IPM_3dmgx3_stop: {
          required: true
        },
        DCL_IPM_3dmgx3_flowctl: {
          required: true
        },
        DCL_IPM_3dmgx3_debuglevel: {
          required: true
        },
        DCL_IMP_metbk_baud: {
          required: true
        },
        DCL_IMP_metbk_parity: {
          required: true
        },
        DCL_IMP_metbk_nbits: {
          required: true
        },
        DCL_IMP_metbk_stop: {
          required: true
        },
        DCL_IMP_metbk_flowctl: {
          required: true
        },
        DCL_IMP_metbk_debuglevel: {
          required: true
        },
        DCL_IMP_loadcell_baud: {
          required: true
        },
        DCL_IMP_loadcell_parity: {
          required: true
        },
        DCL_IMP_loadcell_nbits: {
          required: true
        },
        DCL_IMP_loadcell_stop: {
          required: true
        },
        DCL_IMP_loadcell_flowctl: {
          required: true
        },
        DCL_IMP_loadcell_debuglevel: {
          required: true
        },
        DCL_IMP_pco2_baud: {
          required: true
        },
        DCL_IMP_pco2_parity: {
          required: true
        },
        DCL_IMP_pco2_nbits: {
          required: true
        },
        DCL_IMP_pco2_stop: {
          required: true
        },
        DCL_IMP_pco2_flowctl: {
          required: true
        },
        DCL_IMP_pco2_deduglevel: {
          required: true
        },

        DCL_IMP_rreflect_baud: {
          required: true
        },
        DCL_IMP_rreflect_parity: {
          required: true
        },
        DCL_IMP_rreflect_nbits: {
          required: true
        },
        DCL_IMP_rreflect_stop: {
          required: true
        },
        DCL_IMP_rreflect_flowctl: {
          required: true
        },
        DCL_IMP_rreflect_debuglevel: {
          required: true
        },

        DCL_IMP_Inst6_baud: {
          required: true
        },
        DCL_IMP_Inst6_parity: {
          required: true
        },
        DCL_IMP_Inst6_nbits: {
          required: true
        },
        DCL_IMP_Inst6_stop: {
          required: true
        },
        DCL_IMP_Inst6_flowctl: {
          required: true
        },
        DCL_IMP_Inst6_debuglevel: {
          required: true
        },
        DCL_IMP_Inst7_baud: {
          required: true
        },
        DCL_IMP_Inst7_parity: {
          required: true
        },
        DCL_IMP_Inst7_nbits: {
          required: true
        },
        DCL_IMP_Inst7_stop: {
          required: true
        },
        DCL_IMP_Inst7_flowctl: {
          required: true
        },
        DCL_IMP_Inst7_debuglevel: {
          required: true
        },
        DCL_IMP_Inst8_baud: {
          required: true
        },
        DCL_IMP_Inst8_parity: {
          required: true
        },
        DCL_IMP_Inst8_nbits: {
          required: true
        },
        DCL_IMP_Inst8_stop: {
          required: true
        },
        DCL_IMP_Inst8_flowctl: {
          required: true
        },
        DCL_IMP_Inst8_debuglevel: {
          required: true
        },
        DCL_NCU_NC3_baud: {
          required: true
        },
        DCL_NCU_NC3_parity: {
          required: true
        },
        DCL_NCU_NC3_nbits: {
          required: true
        },
        DCL_NCU_NC3_stop: {
          required: true
        },
        DCL_NCU_NC3_flowctl: {
          required: true
        },
        DCL_NCU_NC3_debuglevel: {
          required: true
        },

        DCL_NCU_NC8_baud: {
          required: true
        },
        DCL_NCU_NC8_parity: {
          required: true
        },
        DCL_NCU_NC8_nbits: {
          required: true
        },
        DCL_NCU_NC8_stop: {
          required: true
        },
        DCL_NCU_NC8_flowctl: {
          required: true
        },
        DCL_NCU_NC8_debuglevel: {
          required: true
        },
        DCL_NCU_NC11_baud: {
          required: true
        },
        DCL_NCU_NC11_parity: {
          required: true
        },
        DCL_NCU_NC11_nbits: {
          required: true
        },
        DCL_NCU_NC11_stop: {
          required: true
        },
        DCL_NCU_NC11_flowctl: {
          required: true
        },
        DCL_NCU_NC11_debuglevel: {
          required: true
        },

        STC_SF_Freewave_baud: {
          required: true
        },
        STC_SF_Freewave_parity: {
          required: true
        },
        STC_SF_Freewave_nbits : {
          required: true
        },
        STC_SF_Freewave_stop: {
          required: true
        },
        STC_SF_Freewave_flowctl: {
          required: true
        },
        STC_SF_Freewave_debuglevel: {
          required: true
        },


        STC_SF_Supervisor_baud: {
          required: true
        },
        STC_SF_Supervisor_parity: {
          required: true
        },
        STC_SF_Supervisor_nbits : {
          required: true
        },
        STC_SF_Supervisor_stop: {
          required: true
        },
        STC_SF_Supervisor_flowctl: {
          required: true
        },
        STC_SF_Supervisor_debuglevel: {
          required: true
        },


        STC_SF_GPS_baud: {
          required: true
        },
        STC_SF_GPS_parity: {
          required: true
        },
        STC_SF_GPS_nbits: {
          required: true
        },
        STC_SF_GPS_stop: {
          required: true
        },
        STC_SF_GPS_flowctl: {
          required: true
        },
        STC_SF_GPS_debuglevel: {
          required: true
        },

        STC_SF_Irid9522B_baud: {
          required: true
        },
        STC_SF_Irid9522B_parity: {
          required: true
        },
        STC_SF_Irid9522B_nbits: {
          required: true
        },
        STC_SF_Irid9522B_stop: {
          required: true
        },
        STC_SF_Irid9522B_flowctl: {
          required: true
        },
        STC_SF_Irid9522B_debuglevel: {
          required: true
        },
        STC_IP_Unused1_baud: {
          required: true
        },
        STC_IP_Unused1_parity: {
          required: true
        },
        STC_IP_Unused1_nbits: {
          required: true
        },
        STC_IP_Unused1_stop: {
          required: true
        },
        STC_IP_Unused1_flowctl: {
          required: true
        },
        STC_IP_Unused1_debuglevel: {
          required: true
        },
        STC_IP_imm_baud: {
          required: true
        },
        STC_IP_imm_parity: {
          required: true
        },
        STC_IP_imm_nbits: {
          required: true
        },
        STC_IP_imm_stop: {
          required: true
        },
        STC_IP_imm_flowctl: {
          required: true
        },
        STC_IP_imm_debuglevel: {
          required: true
        },
        STC_IP_Unused2_baud: {
          required: true
        },
        STC_IP_Unused2_parity: {
          required: true
        },
        STC_IP_Unused2_nbits: {
          required: true
        },
        STC_IP_Unused2_stop: {
          required: true
        },
        STC_IP_Unused2_flowctl: {
          required: true
        },
        STC_IP_Unused2_debuglevel: {
          required: true
        },



        STC_IP_3dmgx3_baud: {
          required: true
        },
        STC_IP_3dmgx3_parity: {
          required: true
        },
        STC_IP_3dmgx3_nbits: {
          required: true
        },
        STC_IP_3dmgx3_stop: {
          required: true
        },
        STC_IP_3dmgx3_flowctl: {
          required: true
        },
        STC_IP_3dmgx3_debuglevel: {
          required: true
        },
        STC_IP_Unused3_baud: {
          required: true
        },
        STC_IP_Unused3_parity: {
          required: true
        },
        STC_IP_Unused3_nbits: {
          required: true
        },
        STC_IP_Unused3_stop: {
          required: true
        },
        STC_IP_Unused3_flowctl: {
          required: true
        },
        STC_IP_Unused3_debuglevel: {
          required: true
        },


        STC_NCU_NC3_baud: {
          required: true
        },
        STC_NCU_NC3_parity: {
          required: true
        },
        STC_NCU_NC3_nbits: {
          required: true
        },
        STC_NCU_NC3_stop: {
          required: true
        },
        STC_NCU_NC3_flowctl: {
          required: true
        },
        STC_NCU_NC3_debuglevel: {
          required: true
        },
        STC_NCU_NC5_baud: {
          required: true
        },
        STC_NCU_NC5_parity: {
          required: true
        },
        STC_NCU_NC5_nbits: {
          required: true
        },
        STC_NCU_NC5_stop: {
          required: true
        },
        STC_NCU_NC5_flowctl: {
          required: true
        },
        STC_NCU_NC5_debuglevel: {
          required: true
        },
        STC_NCU_NC7_baud: {
          required: true
        },
        STC_NCU_NC7_parity: {
          required: true
        },
        STC_NCU_NC7_nbits: {
          required: true
        },
        STC_NCU_NC7_stop: {
          required: true
        },
        STC_NCU_NC7_flowctl: {
          required: true
        },
        STC_NCU_NC7_debuglevel: {
          required: true
        },
        STC_NCU_NC8_baud: {
          required: true
        },
        STC_NCU_NC8parity: {
          required: true
        },
        STC_NCU_NC8_nbits: {
          required: true
        },
        STC_NCU_NC8_stop: {
          required: true
        },
        STC_NCU_NC8_flowctl: {
          required: true
        },
        STC_NCU_NC8_debuglevel: {
          required: true
        },
        STC_NCU_NC11_baud: {
          required: true
        },
        STC_NCU_NC11_parity: {
          required: true
        },
        STC_NCU_NC11_nbits: {
          required: true
        },
        STC_NCU_NC11_stop: {
          required: true
        },
        STC_NCU_NC11_flowctl: {
          required: true
        },
        STC_NCU_NC11_debuglevel: {
          required: true
        },







    }
});


