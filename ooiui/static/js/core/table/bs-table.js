/**
 * modified from  https://github.com/lukaskral/bootstrap-table-filter
 */

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
            var ret = ''; 
            $.each(item, function(field, value) {
                if(value == null ||field == undefined|| value ===''){
                }
                //search into the individual array objects
                else if(typeof value === 'object'){
                    $.each(value, function(field1, value1) {
                        if(filterData[field1]){
                            if(value1 == null ||field1 == undefined|| value ===''){
                                ret = false;
                            }
                            else{
                                try {
                                    if(ret === "" || ret === true){
                                        ret = bootstrapTableFilter.checkFilterTypeValue(true, filterData[field1], value1);
                                    }
                                }
                                catch (e) {} 
                            }
                           
                        }
                    });
                }

                //only search searched fields
                else if(filterData[field]){

                    if(value ===''){
                        ret = false;
                    }
                    else{
                        filterType = false;
                        try {
                            filterType = true;//bootstrapTableFilter.getFilterType(field);
                            //filter = bootstrapTableFilter.getFilter(field);
                            /*if (typeof filter.values !== 'undefined') {
                                value = filter.values.indexOf(value);
                            }*/
                            //if (filterType && typeof filterData[field] !== 'undefined') {
                            if(ret === "" || ret === true){
                                ret = bootstrapTableFilter.checkFilterTypeValue(filterType, filterData[field], value);
                            }
                        }
                        catch (e) {}
                    }
                }          
            });  
        }
        if(ret == ''){
            ret = false;
        }
        
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
                    $bootstrapTable.bootstrapTable('updateSearch');
                });
            }
            else {
                $bootstrapTable.bootstrapTable('registerSearchCallback', rowFilter);
                bootstrapTableFilter.$toolbar.delegate('.remove-filters *', 'click', function() {
                    $bootstrapTable.bootstrapTable('updateSearch');
                    var data = $bootstrapTable.bootstrapTable('getData');
                    var cols = $bootstrapTable.bootstrapTable('getColumns');
                    var dataSourceServer = false;
                    var filters = getCols(cols, data, dataSourceServer);
                    
                    bootstrapTableFilter.filters = filters;
                });
                this.$el.on('submit.bs.table.filter', function() {
                    filterData = bootstrapTableFilter.getData();
                    
                    $bootstrapTable.bootstrapTable('updateSearch');
                    var searchdata = bootstrapTableFilter.getData();

                    filterData = {};//new empty object
                    //reapply the search criteria to filter down dropdown options
                    ////********

                    var data = $bootstrapTable.bootstrapTable('getData');
                    var cols = $bootstrapTable.bootstrapTable('getColumns');
                    var dataSourceServer = false;
                    var filters = getCols(cols, data, dataSourceServer);
                    
                    $.each(filters, function(field, filter) {
                        if(bootstrapTableFilter.filters[field].$dropdownList){
                            bootstrapTableFilter.filters[field].$dropdownList.empty(); 
                            bootstrapTableFilter.filters[field].$dropdownList.append($('<li class="static"><span><input type="text" class="form-control search-values" placeholder="Search"></span></li>'));
                            bootstrapTableFilter.filters[field].$dropdownList.append($('<li class="static divider"></li>'));
                            //add new values in
                            $.each(filter['values'], function(row,i) {
                                var checked = false;
                                bootstrapTableFilter.filters[field].$dropdownList.append($('<li data-val="' + i + '" class=""><a href="javascript:void(0)"><input type="checkbox" class="filter-enabled"' + (checked ? ' checked' : '') + '> ' + i + '</a></li>'));
                            });
                        }
                        else{
                            bootstrapTableFilter.filters[field] = filter;
                        }
                        //bootstrapTableFilter.fillFilterOptions(field,filterData,'static');
                    });
                });
            }
        }
    });

}(jQuery);