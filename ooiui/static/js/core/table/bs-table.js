!function($) {

    'use strict';

    var filterData = {};
    var bootstrapTableFilter;
    var serverUrl;

    var getTypeByValues = function(vals, useAjax) {
        var typeFloat = false, typeInt = false;
        $.each(vals, function(i, val) {
            if (typeInt && (parseInt(val) != val)) {
                typeInt = false;
            }
            if (typeFloat && (parseFloat(val) != val)) {
                typeFloat = false;
            }
        });
        if (typeInt || typeFloat) {
            return {type: 'range'};
        }
        if (useAjax) {
            return {type: 'selectAjax', source: 'XXXXX'}
        }
        return {type: 'select'};
    };
    var getCols = function(cols, data, useAjax) {
        var ret = {};
        $.each(cols, function(i, col) {
            /*if(col.col){
                ret[col.col] = {
                    field: col.field,
                    label: col.title,
                    values: []
                };
            }
            else{
                
            }*/
            ret[col.col] = {
                    field: col.field,
                    label: col.title,
                    col: col.col,
                    values: []
                };
        });
        $.each(data, function(i, row) {
            $.each(ret, function(field, filter) {
                if (ret[field].values.indexOf(row[field]) < 0) {
                    //get to the object in a object
                    if(row[filter.field]==null){
                        //ret[field].values.push(row[filter.field][field]);
                    }
                    else if(typeof row[filter.field] === 'object'){
                        if (ret[field].values.indexOf(String(row[filter.field][field])) < 0&&row[filter.field][field]!=null) {
                            ret[field].values.push(String(row[filter.field][field]));
                        }
                    }else{
                        ret[field].values.push(String(row[field]));    
                    }
                    
                }
            });
        });
        $.each(ret, function(field, def) {
            ret[field] = $.extend(ret[field], getTypeByValues(def.values));
        });
        return ret;
    };
    var rowFilter = function(item, i) {
        var filterType;
        if(Object.getOwnPropertyNames(filterData).length == 0){
            var ret = true;
        }
        else{
            var ret = false;    
        }
        $.each(item, function(field, value) {
            filterType = false;
            if(value == null){

            }
            else if(typeof value === 'object'){
                $.each(value, function(field1, value1) {
                    filterType = false;
                    if(filterData[field1]){
                       try {
                            filterType = bootstrapTableFilter.getFilterType(field1);
                            if (filterType && typeof filterData[field1] !== 'undefined') {
                                ret = bootstrapTableFilter.checkFilterTypeValue(filterType, filterData[field1], String(value1));
                                return ret;
                                //ret = true;
                            }
                        }
                        catch (e) {
                            //ret = false;
                        } 
                    }
                });
            }
            else{
                if(filterData[field]){
                   try {
                        filterType = bootstrapTableFilter.getFilterType(field);
                        if (filterType && typeof filterData[field] !== 'undefined') {
                            ret = bootstrapTableFilter.checkFilterTypeValue(filterType, filterData[field], String(value));
                            return ret;
                            //ret = true;
                        }
                    }
                    catch (e) {
                        //ret = false;
                    } 
                }
            }           
        });
        return ret;
    };

    $.fn.bootstrapTableFilter.externals.push(function() {
        if (this.options.connectTo) {
            bootstrapTableFilter = this;
            var $bootstrapTable = $(this.options.connectTo);
            var data = $bootstrapTable.bootstrapTable('getData');
            var cols = $bootstrapTable.bootstrapTable('getColumns');
            var dataSourceServer = false;
            var filters = getCols(cols, data, dataSourceServer);

            $.each(filters, function(field, filter) {
                bootstrapTableFilter.addFilter(filter);
            });
            serverUrl = $bootstrapTable.bootstrapTable('getServerUrl');
            if (serverUrl) {
                this.$el.on('submit.bs.table.filter', function() {
                    filterData = bootstrapTableFilter.getData();
                    var delimiter = serverUrl.indexOf('?') < 0 ? '?' : '&';
                    var url = serverUrl + delimiter + 'filter=' + encodeURIComponent(JSON.stringify(filterData));
//                    console.log(url);
                    $bootstrapTable.bootstrapTable('updateSearch');
                });
            }
            else {
                $bootstrapTable.bootstrapTable('registerSearchCallback', rowFilter);
                this.$el.on('submit.bs.table.filter', function() {
                    filterData = bootstrapTableFilter.getData();
                    $bootstrapTable.bootstrapTable('updateSearch');
                });
            }
        }
    });

}(jQuery);