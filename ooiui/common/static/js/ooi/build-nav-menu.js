/*
__author = 'Matt Campbell'
Table of contents generator for OOI.
Requires: ooiservice.js included
*/

function BuildNavMenu() {
    //TODO: Use the return to build a <li><a> of links
    getArrayList(function(result) {
        data = JSON.parse(result);
        //Build a simple <li> element, where there is a onclick even.
        var unordered_list = '<ul>';
        for (var i=0; i<data.length; i++) {
            unordered_list +=
                '<li id="nav-item" onclick="">'
                    + data[i].name + '( '
                    + data[i].id +
                ' )</li>';
        }
        document.write(unordered_list);
    });


}