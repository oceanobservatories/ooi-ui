// Define a model with some validation rules
var CGSNConfigModel = Backbone.Model.extend({
    rid:0,
    defaults:{
        role_name: "Administrator",
        organization: "ASA",
        role_id: 0

    },
    config:null,
    _validator:[
            {lines:[131,354,357,363,366,373,376,382,385,392,396,403,407,414,418,425,429,611,614,619,622,627,630,635,638,643,646],valid:function(v){return (this.pattern.exec(v)==null?false:true)},pattern:new RegExp("[0-1]:[0-2]-([0-2][0-3]{0,2}|23):([0-5][0-9]|60):([0-5][0-9]|60)$"),sample:"0:0-23:00:50"}
            ,{lines:[137,173],valid:function(v){return (this.pattern.exec(v)==null?false:true)},pattern:new RegExp("^([0-6][0-9]{0,2})$"),sample:"0 to max 499 mins"}
            ,{lines:[139,147,162,163,172,189,247,249,286,287,302,303,317,331,355,364,374,383,393,404,415,426,481,535,569,570,591,592,612,620,628,636,644],valid:function(v){return (this.pattern.exec(v)==null?false:true)},pattern:new RegExp("^([0-9][0-9]{0,3})$"),sample:"0 to max 9999 seconds"}
            ,{lines:[145,146,169,171,186,196,197,198,199,200,201,202,203,243,244,245,248,251,255,257,264,262,268,289,291,293,307,328,338,339,342,478,491,492,493,494,495,496,497,498,532,533,534,540,571,572,574,595],valid:function(v){return (this.pattern.exec(v)==null?false:true)},pattern:new RegExp("^[0-1]$"),sample:"0 or 1"}
            ,{lines:[164,165,166,167],valid:function(v){return (this.pattern.exec(v)==null?false:true)},pattern:new RegExp("^(-1|0|1)$"),sample:"-1 or 0 or 1"}
            ,{lines:[210,211,212,213,214,215,216,351,356,360,365,370,375,379,384,389,394,400,405,411,416,422,427,609,613,617,621,625,629,633,637,641,645],valid:function(v){return (this.pattern.exec(v)==null?false:true)},pattern:new RegExp("^(-1|0|1|t)$"),sample:"-1 or 0 or 1 or t"}
            ,{lines:[305,594],valid:function(v){return (this.pattern.exec(v)==null?false:true)},pattern:new RegExp("^([0-9][0-9])$|^([0-9][0-9])(,(([0-9][0-9]),([0-9][0-9])))*(,[0-9][0-9])*$|^$"),sample:"blank or 01 or 01,02,..."}
            ,{lines:[132,149,150,151,190,332,482],valid:function(v){return (this.pattern.exec(v)==null?false:true)},pattern:new RegExp("^([0-9])$|^([0-9])(,(([0-9]),([0-9])))*(,[0-9])*$|^$"),sample:"blank or 1 or 1,2,..."}
            ,{lines:[175,176,177,178,318,319,320,460,461,462,463,466],valid:function(v){return (this.pattern.exec(v)==null?false:true)},pattern:new RegExp("^(\\d*\\s\\d*\\s\\d*)$"),sample:"number number number"}
            ,{lines:[180,322,352,361,371,380,390,401,412,423,610,618,626,634,642],valid:function(v){return (this.pattern.exec(v)==null?false:true)},pattern:new RegExp("^(\\d*\\s\\d*\\s\\d\\s\\d*)$"),sample:"number number number number"}
            ,{lines:[187,188,329,330,479,480],valid:function(v){return (this.pattern.exec(v)==null?false:true)},pattern:new RegExp("^(\\d*(.)\\d*)$"),sample:"voltage decimal #.#"}
            ,{lines:[209,246,247,304,347,537,575,605],valid:function(v){return (this.pattern.exec(v)==null?false:true)},pattern:new RegExp("^(\\d*)$"),sample:"number #"}
            ,{lines:[283,284,285,301,310,566,567,568,590,593],valid:function(v){return (this.pattern.exec(v)==null?false:true)},pattern:new RegExp("^([1-9]\\d*)$"),sample:"+ number not equal 0 #"}
            ,{lines:[282,565],valid:function(v){return (this.pattern.exec(v)==null?false:true)},pattern:new RegExp("^[0-5]$"),sample:"0 - 5 "}
            ,{lines:[252,258,265],valid:function(v){return (this.pattern.exec(v)==null?false:true)}
                ,pattern:new RegExp("^$|^[0-9]{4}(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])$")
                ,sample:"20120101"}
            ,{lines:[159],valid:function(v){return (this.pattern.exec(v)==null?false:true)}
                ,pattern:new RegExp("^200$|^300$")
                ,sample:"200 or 300"}
            ,{lines:[226,227,228,229],valid:function(v){return (this.pattern.exec(v)==null?false:true)}
                ,pattern:new RegExp("^[0-1]:([0-9]|[1-1][0-9]|[2-2][0-3])(,(([0-9]|[1-1][0-9]|[2-2][0-3]),([0-9]|[1-1][0-9]|[2-2][0-3])))*(,([0-9]|[1-1][0-9]|[2-2][0-3]))*:([0-9]|[0-5][0-9]|60)*:([0-9]|[0-5][0-9]|60)$")
                ,sample:"1:0,4,8,12,16,20:10:20"}

            //Line numbers are 0 based
            //TODO line 148 has no validation
            //TODO check if line 159 is only 200 or 300
            //TODO Telemetry Configuration and Schedule check that 226-229 is #:comma list :hh:mm
        ],

    validate:function(l,v){
       var val= $.grep(this._validator, function(e){ return e.lines.indexOf(l)!=-1; });
       try{
        return val[0].valid($.trim(v));
       }catch(e) {return true;}
       return true;
    },
    initialize:function(){

    },
    url: "/api/user/",
    configRODefs:[],
    configDefs:[],

    buildTable:function(){
        //trash junk
        this.config.splice(0,38);
        //get the 3 readonly sections
        this.configRODefs.push({heading:"FFC VERSION",rows:this._buildRORows(this.config.splice(0,25))});
        this.config.splice(0,11);
        this.configRODefs.push({heading:"DCL SERIAL Config",rows:this._buildRORows(this.config.splice(0,19))});
        this.config.splice(0,10);
        this.configRODefs.push({heading:"STC SERIAL Config",rows:this._buildRORows(this.config.splice(0,23))});

        //get the configurable sections
        this.configDefs.push({parentGroup:"Sample CPM Mission Configuration"});
        this.configDefs[0].section=[];
        this.configDefs[0].section.push({name:"CPM Mission confirguration file"});
        this.config.splice(0,4);
        this.rid=this.configOrg.length-this.config.length;
        this.configDefs[0].section[0].items=this._buildRows(this.config.splice(0,10));
        this.config.splice(0,4);
        this.rid= this.rid+4;
        this.configDefs[0].section.push({name:"Power System Controller Section"})
        this.configDefs[0].section[1].items=this._buildRows(this.config.splice(0,10));
        this.config.splice(0,4);
        this.rid= this.rid+4;
        this.configDefs[0].section.push({name:"Supervisor mpic Section"});
        this.configDefs[0].section[2].items=this._buildRows(this.config.splice(0,23));
        this.config.splice(0,4);
        this.rid= this.rid+4;
        this.configDefs[0].section.push({name:"CPM Power Management Section"});
        this.configDefs[0].section[3].items=this._buildRows(this.config.splice(0,6));
        this.config.splice(0,4);
        this.rid= this.rid+4;
        this.configDefs[0].section.push({name:"Misc CE hotel loads"});
        this.configDefs[0].section[4].items=this._buildRows(this.config.splice(0,10));
        this.config.splice(0,3);
        this.rid= this.rid+3;
        this.configDefs[0].section.push({name:"CPM/DCL Configuration"});
        this.configDefs[0].section[5].items=this._buildRows(this.config.splice(0,9));
        this.config.splice(0,8);
        this.rid= this.rid+8;
        this.configDefs[0].section.push({name:"Telemetry Configuration and Schedule"});
        this.configDefs[0].section[6].items=this._buildRows(this.config.splice(0,6));
        this.config.splice(0,3);
        this.rid= this.rid+3;
        this.configDefs[0].section.push({name:"Shore server ip address, uname, deployment id"});
        this.configDefs[0].section[7].items=this._buildRows(this.config.splice(0,4));
        this.config.splice(0,4);
        this.rid= this.rid+4;
        this.configDefs[0].section.push({name:"Misc fleet broadband fb250 and rsync options"});
        this.configDefs[0].section[8].items=this._buildRows(this.config.splice(0,30));
        this.configDefs[0].section.push({name:"Misc Iridium 9522b options"});
        this.configDefs[0].section[9].items=this._buildRows(this.config.splice(0,26));
        this.configDefs[0].section.push({name:"Misc IMM options"});
        this.configDefs[0].section[10].items=this._buildRows(this.config.splice(0,13));
        this.config.splice(0,3);
        this.rid= this.rid+3;
        this.configDefs.push({parentGroup:"Sample DCL Mission Configuration"});
        this.configDefs[1].section=[];
        this.configDefs[1].section.push({name:"Supervisor mpic Section"});
        this.configDefs[1].section[0].items=this._buildRows(this.config.splice(0,11));
        this.configDefs[1].section.push({name:"DCL Power Management Section"});
        this.configDefs[1].section[1].items=this._buildRows(this.config.splice(0,10));
        this.configDefs[1].section.push({name:"Misc CE hotel loads"});
        this.configDefs[1].section[2].items=this._buildRows(this.config.splice(0,9));
        this.configDefs[1].section.push({name:"DCL Instrument Port Configuration"});
        this.configDefs[1].section[3].items=this._buildRows(this.config.splice(0,93));
        this.configDefs[1].section.push({name:"Supervisor mpic Section"});
        this.configDefs[1].section[4].items=this._buildRows(this.config.splice(0,34));
        this.configDefs[1].section.push({name:"STC Power Management Section"});
        this.configDefs[1].section[5].items=this._buildRows(this.config.splice(0,15));
        this.configDefs[1].section.push({name:"Misc CE hotel loads"});
        this.configDefs[1].section[6].items=this._buildRows(this.config.splice(0,16));
        this.configDefs[1].section.push({name:"Telemetry Configuration and Schedule"});
        this.configDefs[1].section[7].items=this._buildRows(this.config.splice(0,13));
        this.configDefs[1].section.push({name:"Shore server ip address, uname, deployment id"});
        this.configDefs[1].section[8].items=this._buildRows(this.config.splice(0,11));
        this.configDefs[1].section.push({name:"Misc fleet broadband fb250 and rsync options"});
        this.configDefs[1].section[9].items=this._buildRows(this.config.splice(0,19));
        this.configDefs[1].section.push({name:"Misc Iridium 9522b options"});
        this.configDefs[1].section[10].items=this._buildRows(this.config.splice(0,34));
        this.configDefs[1].section.push({name:"Misc IMM options"});
        this.configDefs[1].section[11].items=this._buildRows(this.config.splice(0,21));
        this.configDefs[1].section.push({name:"STC Instrument Port Configuration - port1,2,3,5,7"});
        this.configDefs[1].section[12].items=this._buildRows(this.config);
    },
    _buildRORows:function(r){
        var items=[];
        for(var x=0;x<r.length;x++){
            if(r[x].indexOf("#")==-1 && r[x].length>1 ) items.push(r[x].split(" ").filter(function(el) {return el.length != 0}));
        }
        return items
    },
    _buildRows:function(r){
        //return [name:"", val:"ll", def:"#jjd"
        var items=[];
        for(var x=0;x<r.length;x++){
            this.rid++;
            if(r[x].indexOf("=")>2){
                var item={}
                var i=r[x].split("#");
                item.def=i[1];
                var v=i[0].split("=");
                item.name=v[0];
                item.value=v[1];
                item.rid=this.rid-1;
                if(v.length==2) items.push(item);
            }
        }
        return items;
    },


});


