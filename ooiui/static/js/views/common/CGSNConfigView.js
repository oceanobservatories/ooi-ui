
var CGSNConfigView = Backbone.View.extend({
    events: {
        'click #submitButton': function (e) {
            var blob=new Blob([this.model.configOrg.join("\n")], {type: "application/octet-stream"});
            var link=document.createElement('a');
            link.href=window.URL.createObjectURL(blob);
            link.download="config.txt";
            document.body.appendChild(link)
            link.click();
            setTimeout(function () { URL.revokeObjectURL(link); }, 100)
            e.preventDefault();
        },
        'click #commitButton': function (e){
            $.ajax({
                url: "config_file",
                method:"POST",
                data:{txt: this.model.configOrg.join("\n")}
            }).done(function(data) {
                //TODO :Diff data comes back, send to redmine
                location.href="config_file?dl=1";
            });


        },
        'click #resetButton': function (e){
            //Not implemented
            this.reset();
        },
        'change input[type="text"]':function(e){
            var lineitem=this._fastGrep(this.model.configDefs,parseInt(e.target.id.replace("dr_","")));
            if(!this.model.validate(lineitem.rid,$(e.target).val())) {
                $(e.target).css("border","1px solid red");
                $("#floater").hide();
                return;
            }
            $(e.target).css("border","");
            if($.trim(lineitem.value)!=$.trim($(e.target).val()))  $(e.target).css("border","1px solid green");
            $("#floater").show();
            this.model.configOrg[parseInt(lineitem.rid)]=
                this.model.configOrg[parseInt(lineitem.rid)].replace($.trim(lineitem.value),$.trim($(e.target).val()));

        }
    },

    initialize: function (options) {

        _.bindAll(this, "render", "reset", "remove");
        $(window).scroll(function () {
            $("#floater").css("top", ($(this).scrollTop()+15) + "px");
        });
        this.render();
    },

    render: function () {
       console.log("render");
       //build the tables when object loaded
       if(this.model.configDefs.length!=0){
            for(var x=0;x<this.model.configRODefs.length;x++){
                for(var r=0;r<this.model.configRODefs[x].rows.length;r++){
                    $("#t" +x).append(jQuery("<tr>"+this._readOnlyRow(this.model.configRODefs[x].rows[r])+ "</tr>"));
                }
            }
            for(var y=0;y<this.model.configDefs.length;y++){
                // for each section
                for(var s=0;s<this.model.configDefs[y].section.length;s++){
                    //add name as rowsapn
                     $("#et" +y).append(jQuery("<tr><td colspan='2'><b>"+this.model.configDefs[y].section[s].name+"</b></td></tr>"));
                    //for each item name and value
                    for(var i=0;i<this.model.configDefs[y].section[s].items.length;i++){
                        var v=this.model.configDefs[y].section[s].items[i].rid;
                        var vald= $.grep(this.model._validator, function(e){ return e.lines.indexOf(v)!=-1; });
                        var style="";
                        if(vald.length!=0) style="";
                         $("#et" +y).append(jQuery("<tr><td>"+$.trim(this.model.configDefs[y].section[s].items[i].name)
                         +"</td><td " +style +"><input id='dr_"+this.model.configDefs[y].section[s].items[i].rid
                         + "' type='text' value='"+$.trim(this.model.configDefs[y].section[s].items[i].value)
                         +"' title='"
                         +(this.model.configDefs[y].section[s].items[i].def==undefined
                            ?(vald.length==0?"Not Set":vald[0].sample)
                            :this.model.configDefs[y].section[s].items[i].def)
                         +"'/><div style='display:none'>"+this.model.configDefs[y].section[s].items[i].rid+"</div></td></tr>"));
                    }
                }
            }
        }
        $("#page-content-wrapper").show();
        return this;
    },
    _readOnlyRow:function(data){
                return "<td>" + data[0] +"</td0>"
                + "<td>" + data[1] +"</td>"
                + "<td class='form-group'><input placeholder='" + data[2] +"' readonly></input></td>"
                + "<td class='form-group'><input placeholder='" + data[3] +"' readonly />  </td>"
                + "<td class='form-group'><input  placeholder='" + data[4] +"'  readonly /> </td>"
                + "<td class='form-group'><input   placeholder='" + data[5] +"' readonly /></td>"
                + "<td class='form-group'><input  placeholder='" + data[6] +"' readonly /></td>"
                + "<td class='form-group'><input  placeholder='" + data[7] +"' readonly /></td>";
    },
    _fastGrep:function(theObject,v){
        var result = null;
        if(theObject instanceof Array) {
            for(var i = 0; i < theObject.length; i++) {
                result = this._fastGrep(theObject[i],v);
                if (result) {
                    break;
                }
            }
        }
        else
        {
            for(var prop in theObject) {
                //console.log(prop + ':' + theObject[prop]);
                if(prop == 'rid') {
                    if(theObject[prop] == v) {
                        return theObject;
                    }
                }
                if(theObject[prop] instanceof Object || theObject[prop] instanceof Array) {
                    result = this._fastGrep(theObject[prop],v);
                    if (result) {
                        break;
                    }
                }
            }
        }
        return result;
    },

    reset: function(){

    },

});
