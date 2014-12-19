/*
__author = 'Matt Campbell'
Menu bar list generator
Requires: ooiservice.js included
*/
$(window).scroll( function() {
    if ($(window).scrollTop() > $('#nav-bar').offset().top)
        $('#slider').addClass('floating');
    else
        $('#slider').removeClass('floating');
    }
);
function BuildNavBar() {
    //TODO: Use the return to build a <li><a> of links
    getArrayList(function(result) {
        var data = JSON.parse(result);
        //Build a simple <li> element, where there is a onclick even.
        var unordered_list = '<nav id="slider"><ul id="nav">';
        for (var i = 0; i < data.length; i++) {
            unordered_list += '<div><h3><a id="nav-item" onclick="">' + data[i].name + '</a></h3></div>';
        }
        unordered_list += '</nav></ul>';
        document.getElementById('nav-bar').innerHTML = unordered_list;
    });
}
