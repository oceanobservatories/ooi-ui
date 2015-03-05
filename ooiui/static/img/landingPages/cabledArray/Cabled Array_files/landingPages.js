this["JST"] = this["JST"] || {};

this["JST"]["ooiui/static/js/partials/DropdownMessages.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<a class="dropdown-toggle" data-toggle="dropdown" href="#">\n  <!-- mail envelope -->\n  <i class="fa fa-envelope fa-fw"></i>  <i class="fa fa-caret-down"></i>\n</a>\n<!-- message list goes here -->\n<ul class="dropdown-menu dropdown-messages">\n  <li>\n    <a class="text-center" href="/opLog.html">\n      <strong>Read All Messages</strong>\n      <i class="fa fa-angle-right"></i>\n    </a>\n  </li>\n</ul>\n';

}
return __p
};

this["JST"]["ooiui/static/js/partials/DropdownMessage.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<a href="#">\n  <div>\n    <strong>' +
((__t = ( author )) == null ? '' : __t) +
'</strong>\n    <span class="pull-right text-muted">\n      <em>' +
((__t = ( date )) == null ? '' : __t) +
'</em>\n    </span>\n  </div>\n  <div>\n    ' +
((__t = ( message )) == null ? '' : __t) +
'\n  </div>\n</a>\n\n';

}
return __p
};

this["JST"]["ooiui/static/js/partials/DropdownUserLoggedIn.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<!-- <li class="dropdown"> -->\n  <a class="dropdown-toggle" data-toggle="dropdown" href="#">\n    <i class="fa fa-user fa-fw"></i> ' +
((__t = ( user.get('user_name') )) == null ? '' : __t) +
' <i class="fa fa-caret-down"></i>\n  </a>\n  <ul class="dropdown-menu dropdown-user">\n   \n    <li>\n     \n      <a href="#"><i class="fa fa-user fa-fw"></i> User Profile</a>\n    </li>\n    ';
 if(user.get('scopes').indexOf('user_admin') !== -1) { ;
__p += '\n    <li>\n      <a href="/users/"><i class="fa fa-gear fa-fw"></i> Edit Users</a>\n    </li>\n    ';
 } ;
__p += '\n    <li class="divider"></li>\n    <li><a id="logout" href="/"><i class="fa fa-sign-out fa-fw"></i> Logout</a>\n    </li>\n  </ul>\n  <!-- /.dropdown-user -->\n<!-- </li> -->\n';

}
return __p
};

this["JST"]["ooiui/static/js/partials/DropdownUserLoggedOut.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<!-- <li class="dropdown"> -->\n  <a class="dropdown-toggle" data-toggle="dropdown" href="#">\n    <i class="fa fa-user fa-fw"></i>  <i class="fa fa-caret-down"></i>\n  </a>\n  <ul class="dropdown-menu dropdown-user">\n    <li>\n      <a id=\'login\' href="#">\n        <i class="fa fa-sign-out fa-fw"></i> Log In\n      </a>\n    </li>\n    <li class="divider"></li>\n    <li>\n      <a href="/signup">\n        <i class="fa fa-user fa-fw"></i> Register\n      </a>\n    </li>\n  </ul>\n  <div id="loginView"></div>\n  <!-- /.dropdown-user -->\n<!-- </li> -->\n';

}
return __p
};

this["JST"]["ooiui/static/js/partials/LoginForm.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '\n\n<div class="lgn btn-launch">\n  <!--Modal-->\n  <!-- data-backdrop prevents the modal from closeing when backtorp is clicked\n  tabindex allows the escape key to be used to close the modal -->\n  <div class="modal fade" id="loginModal" data-backdrop="static" tabindex="-1">\n    <div class="modal-dialog">\n      <div class="modal-content">\n        <!--Header-->\n        <div class="lgn-header">\n          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\n          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&quest;</span></button>\n\n        </div> <!-- lgn-header -->\n\n        <!--Body-->\n        <div class="lgn-body">\n          <div class="lgn-center">\n             <div class="image"></div>\n             <div class="lgn-message"></div>\n             <br>\n             <input class="lgn-input" id="usrInput" type="text" name="username" size="25" placeholder="&#xf007; Email/Username">\n             <input class="lgn-input" id="passInput" type="password" name="password" size="25" placeholder="&#xf023; Password" />\n             <button class="lgn btn btn-default btn-logIn enableOnInput" type="button" id="btnLogin" disabled="disabled">Log In</button>\n          </div> <!-- lgn-center -->\n        </div> <!-- lgn-body -->\n\n        <!--Footer-->\n        <div class="lgn-footer">\n          <div class="lgn-footerPass">\n            <a href="#" data-toggle="modal">Forgot Password</a>\n          </div> <!-- lgn-footerPass -->\n          <div class="lgn-footerNewUser">\n            <a href="/signup" data-toggle="modal">New User</a>\n          </div> <!-- lgn-footerNewUser -->\n        </div> <!-- lgn-footer -->\n      </div>  <!-- modal-content -->\n    </div> <!-- modal-dialog -->\n  </div> <!-- modal fade -->\n</div> <!-- lgn btn-launch -->\n';

}
return __p
};

this["JST"]["ooiui/static/js/partials/ModalDialog.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<!-- set up the modal to start hidden and fade in and out -->\n<!-- <div id="myModal" class="modal fade"> -->\n  <div class="modal-dialog">\n    <div class="modal-content">\n      <!-- dialog body -->\n      <div class="modal-body">\n        <button type="button" class="close" data-dismiss="modal">&times;</button>\n        ' +
((__t = ( message )) == null ? '' : __t) +
'\n      </div>\n    </div>\n  </div>\n<!-- </div> -->\n';

}
return __p
};

this["JST"]["ooiui/static/js/partials/Navbar.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="navbar navbar-default navbar-fixed-top" role="navigation" style="margin-bottom: 0">\n  <div class="navbar-header">\n    <a class="navbar-brand" href="/infrastructure">OOI</a>\n  </div> <!-- navbar-header -->\n  <div class="container">\n    <div class="navbar-collapse collapse">\n      <ul id="navbar-menus" class="nav navbar-top-links navbar-left">\n        <li class="active"><a href="/">Home</a></li>\n      </ul> <!-- nav navbar-top-link navbar-left -->\n      <ul id="navbar-right" class="nav navbar-top-links navbar-right">\n        <li>\n            <a class="image-link" href="http://www.oceanobservatories.org" target="_blank">\n              <img src="/img/OOI_BannerNew_01.png" style="width:80px;">\n            </a>\n        </li>\n        <li>\n            <a class="image-link" href="https://www.nsf.gov" target="_blank">\n              <img src="/img/nsf-logo.png" style="width:50px;">\n            </a>\n        </li>\n        <li>\n            <a class="image-link" href="http://www.oceanleadership.org" target="_blank">\n              <img src="/img/OceanLeadershipLogoCS2.png" style="width:75px;">\n            </a>\n        </li>\n      </ul> <!-- nav navbar-top-links navbar-right -->\n    </div><!--/.nav-collapse -->\n  </div> <!-- container -->\n</div>\n';

}
return __p
};

this["JST"]["ooiui/static/js/partials/MenuToggle.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<li>\n  <a id="menu-toggle" href="#">\n    <i id class="glyphicon glyphicon-th-list fa-fw"></i>\n    <i id="collapse-button" class="fa fa-caret-left"></i>\n  </a>\n</li>\n\n';

}
return __p
};

this["JST"]["ooiui/static/js/partials/Panel.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="panel-heading">\n  <strong><span class="fa fa-globe"></span> ' +
((__t = ( heading )) == null ? '' : __t) +
'</strong>\n</div> <!-- panel-heading -->\n<div class="panel-body">\n  ' +
((__t = ( body )) == null ? '' : __t) +
'\n</div> <!-- panel-body -->\n';

}
return __p
};

this["JST"]["ooiui/static/js/partials/Alert.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="alert alert-' +
((__t = ( type )) == null ? '' : __t) +
'" role="alert">\n  <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>\n  <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>\n  <span class="sr-only">' +
((__t = ( title )) == null ? '' : __t) +
':</span>\n  ' +
((__t = ( message )) == null ? '' : __t) +
'\n</div>\n';

}
return __p
};

this["JST"]["ooiui/static/js/partials/Chart.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '\n<span>' +
((__t = ( title )) == null ? '' : __t) +
'</span>\n<div class=\'view-chart\'>\n  <div class=\'chart-contents\'></div>\n  <button class=\'delete\'>remove chart</button>\n  <span class=\'edit\'>edit chart</span>\n</div>\n\n<div class=\'edit-chart hidden\'>\n  <div class=\'edit-contents\'>\n    <div>Edit chart:</div>\n    <div class=\'column-labels\'>\n      <span>labels</span>\n      <span>values:</span>\n    </div>\n  </div>\n  <span class=\'done\'>done</span>\n</div>\n\n';

}
return __p
};

this["JST"]["ooiui/static/js/partials/FakeTable.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<!-- <div> -->\n<table class="table">\n  <thead>\n  <tr>\n    <th>Team</th>\n    <th>W/L Ratio</th>\n    <th>Quarterback</th>\n    <th>Awesome Stat</th>\n  </tr>\n  </thead>\n\n  <tbody>\n  ';
 collection.each(function(model) { ;
__p += '\n  <tr>\n    <td>' +
((__t = ( model.get("team") )) == null ? '' : __t) +
'</td>\n    <td>' +
((__t = ( model.get("wlratio") )) == null ? '' : __t) +
'</td>\n    <td>' +
((__t = ( model.get("qb") )) == null ? '' : __t) +
'</td>\n    <td>' +
((__t = ( model.get("awesome_stat") )) == null ? '' : __t) +
'</td>\n  </tr>\n  ';
 }); ;
__p += '\n  </tbody>\n</table>\n<!-- </div> -->\n';

}
return __p
};

this["JST"]["ooiui/static/js/partials/OrgSidebar.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<li class="sidebar-search">\n  <div class="input-group custom-search-form">\n    Organizations\n  </div>\n  <!-- /input-group -->\n</li>\n';
 collection.each(function(model) { ;
__p += '\n<li class="org-item">\n  <a data-id="' +
((__t = ( model.get('id') )) == null ? '' : __t) +
'" href="#">\n    ' +
((__t = ( model.get('organization_name') )) == null ? '' : __t) +
'\n  </a>\n</li>\n';
 }); ;
__p += '\n\n';

}
return __p
};

this["JST"]["ooiui/static/js/partials/LandingPagesTOC.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<li class="sidebar-search">\n  <div class="input-group custom-search-form">\n    Infrastructure\n  </div>\n</li>\n\n<ul>\n<li class="sidebar-search"><a href="/pioneerarray" title="Pioneer Array">Pioneer Array</a></li>\n<li class="sidebar-search"><a href="http://oceanobservatories.org/infrastructure/ooi-station-map/endurance-array/oregon-newport-line/" title="Endurance Array">Endurance Array</a></li>\n<li class="sidebar-search"><a href="http://oceanobservatories.org/infrastructure/ooi-station-map/regional-scale-nodes/" title="Cabled Array">Cabled Array</a></li>\n<li class="sidebar-search"><a href="http://oceanobservatories.org/infrastructure/ooi-station-map/station-papa/" title="Station Papa">Station Papa</a></li>\n<li class="sidebar-search"><a href="http://oceanobservatories.org/infrastructure/ooi-station-map/irminger-sea/" title="Irminger Sea">Irminger Sea</a></li>\n<li class="sidebar-search"><a href="http://oceanobservatories.org/infrastructure/ooi-station-map/argentine-basin/" title="Argentine Basin">Argentine Basin</a></li>\n<li class="sidebar-search"><a href="http://oceanobservatories.org/infrastructure/ooi-station-map/southern-ocean/" title="Southern Ocean">Southern Ocean</a></li>\n</ul>\n\n\n\n<!-- <ul>\n  <li class="sidebar-search">three</li>\n  <a href="http://oceanobservatories.org/wp-content/uploads/2011/04/Pioneer_Array_Config_SER_Feb2013_wLegend.png"\n  target="_blank">Final Pioneer Mooring Array Configuration (plan view)</a>\n  <li class="sidebar-search">two</li>\n  <li class="sidebar-search">thsdfasdfsadfree</li>\n\n</ul>\n -->\n';

}
return __p
};

this["JST"]["ooiui/static/js/partials/EnduranceArray.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="col-md-6">\n  <div style="float:left;">\n    <h3 align="left"title="Disclaimer: All data are subject to revision without notice; exact locations of mooring sites are not yet finalized; exact depths of sensors will be determined at the time of deployment.">Description<i class="fa fa-info-circle" style="font-size: 12px;"></i></h3>\n    <em class="disclamer"></em></strong>\n\n    <p>Description goes here....\n      The Endurance Array, located on the continental shelf and slope off Oregon and Washington, will provide a long-term network of moorings, benthic nodes, cabled and uncabled sensors, and gliders. The array will consist of two lines of moorings, one off Newport, Oregon (the Oregon Line) and the other off Grays Harbor, Washington (the Washington Line). Gliders will sample between the mooring lines. The array will focus on observing the influence of the Columbia River on the coastal ecosystem as well as sample a prototypical upwelling regime on a narrow continental shelf where anoxia events are common. Some of the Endurance Array Oregon Line infrastructure will be connected to the RSN cabled network providing enhanced power and communications for observing water column and seafloor processes.</p>\n    </div>  <!-- col-md-6 -->\n\n    <div style="clear:both;">\n      <h3>Summary</h3>\n      <p>The first phase of the Pioneer Array deployment took place in November 2013, with the installation of three moorings – a surface mooring at the central site, a profiler mooring at the upstream inshore site and a profiler mooring at the upstream offshore site. In April 2014, during the second deployment phase, five Wire-Following Profile Moorings were deployed at the Pioneer Array with three gliders. The third and final deployment phase is scheduled for Fall 2014.</p>\n    </div>  <!-- col-md-6 -->\n  </div>  <!-- col-md-6 -->\n\n  <!-- HEADER IMAGE -->\n  <div class="col-md-6">\n    <div  id="contact">\n      <img class="delayImg" delayedSrc="/img/landingPages/EnduranceArray/Endurance-Array-Map_2013_04-17_ver_0-02.jpg" style="width:411px; height:500px;" />\n    </div>  <!-- col-md-6 -->\n  </div>  <!-- Description-row -->\n\n  <!-- fade in image -->\n  <script>\n  $(document).ready(function() {\n    $(".delayImg").each(function() {\n      this.onload = function() {\n        $(this).animate({opacity: 1}, 2000);\n      };\n      this.src = this.getAttribute("delayedSrc");\n    });\n  });\n  </script>\n';

}
return __p
};

this["JST"]["ooiui/static/js/partials/EnduranceLocationSampling.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '\n<!-- ==========================================((((((((((())))))))))))==================================================== -->\n<!-- ===========================================Location and Sampleing====================================================== -->\n<!-- ==========================================((((((((((())))))))))))==================================================== -->\n<div class="panel panel-default">\n  <div class="panel-heading" role="tab" id="headingOne">\n    <h4 class="panel-title">\n      <a data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne">\n        Location and Sampling\n      </a>\n    </h4>\n  </div>\n  <div id="collapseOne" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingOne">\n    <div class="panel-body">\n      <div class="row">\n        <div class="col-sm-4">\n          <dt>Oregon (Newport) Line </dt> \n          <dl style="list-style-type:disk">\n            <li>Location: 44° 22’N, 125°W to coast</li>\n            <li>Approximate Water Depth: 25-600 m</li>\n          </dl>\n          <dt>Washington (Grays Harbor) Line</dt>\n          <dl style="list-style-type:disk">\n            <li>Location: 46° 51’N, 125°W to coast</li>\n            <li>Approximate Water Depth: 30-550 m</li>\n          </dl>\n          <dt>Glider sampling area (approximate):</dt>\n        </div><!-- col-sm-4 -->\n        <div class="col-md-12">\n          <dl style="list-style-type:disk">\n            <li>An array of ~6 gliders will travel along five east-west transect lines from approximately the 20-m isobaths to 126 W (and out to 128 W along the Oregon and Washington lines), as well as a north-south transect along 126 W and a north-south transect along the 200 m isobath.</li>\n            <li> Coastal gliders (Teledyne-Webb Slocum Gliders) will fly through the water column along saw-tooth paths, penetrating the sea surface and diving down to depth. These Coastal Gliders will be outfitted with one of two buoyancy engines allowing for maximum efficiency for either shallow (able to dive to 200 m) or deep (able to dive to 1000 m) dives. A roughly even combination of deep and shallow diving coastal gliders will be deployed, sufficient to survey the Endurance Array area.</li>\n          </dl>\n        </div>\n      </div><!-- row -->\n    </div><!-- panel-body -->\n  </div><!-- collapseOne -->\n</div><!-- panel panel-default 1-->\n';

}
return __p
};

this["JST"]["ooiui/static/js/partials/EnduranceDescriptionInfrastructureArray.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<!-- ==========================================((((((((((())))))))))))==================================================== -->\n<!-- ========================================Description Infrastructure=================================================== -->\n<!-- ==========================================((((((((((())))))))))))==================================================== -->\n<div class="panel panel-default">\n  <div class="panel-heading" role="tab" id="headingTwo">\n    <h4 class="panel-title">\n      <a class="collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">\n        Description of Infrastructure\n      </a>\n    </h4>\n  </div>\n  <div id="collapseTwo" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingTwo">\n    <div class="panel-body">\n      <div class="row">\n        <dl style="list-style-type:disk">\n          <div class="col-md-12">\n            <li>Two mooring lines: Oregon and Washington Lines</li>\n            <li>Each of these lines contains three fixed sites spanning the slope (~500-600 m), shelf (~80-90 m) and inner-shelf (~25-30 m)</li>\n            <li>Some components of the Oregon Line will be connected to the <a href="ooi-ui/ooiui/templates/landing/cabledArray.html">Cabled Array</a></li>\n            <li>Six glider</li>\n          </dl>\n        </div>\n      </div><!-- row -->\n    </div>\n  </div>\n</div><!-- panel panel-default 2-->\n';

}
return __p
};

this["JST"]["ooiui/static/js/partials/EnduranceStationSummary.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<!-- ==========================================((((((((((())))))))))))==================================================== -->\n<!-- =============================================Station Summary========================================================= -->\n<!-- ==========================================((((((((((())))))))))))==================================================== -->\n<div class="panel panel-default">\n  <div class="panel-heading" role="tab" id="headingTwo">\n    <h4 class="panel-title">\n      <a class="collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapseThree" aria-expanded="false" aria-controls="collapseTwo">\n        Station Summary\n      </a>\n    </h4>\n  </div>\n  <div id="collapseThree" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingTwo">\n    <div class="panel-body">\n      <div class="row">\n        <dl style="list-style-type:disk">\n          <div class="col-md-12">\n            <li>The Endurance Array is a multi-scaled array utilizing fixed and mobile assets to observe cross-shelf and along-shelf variability in the coastal upwelling region of the Oregon and Washington coasts. The array also provides an extensive spatial footprint that encompasses a prototypical eastern boundary current regime and connectivity with the Cabled Array. The backbone of the Endurance Array includes two cross-shelf moored array lines, the Oregon Line (also called the Newport Line) and the Washington Line (also known as the Grays Harbor Line). Each these lines contain three fixed sites spanning the slope (~500-600 m), shelf (~80-90 m) and inner-shelf (~25-30 m). The three sites across the shelf and slope are associated with unique physical, geological, and biological processes.</li>\n          </dl>\n        </div>\n      </div><!-- row -->\n    </div>\n  </div>\n</div><!-- panel panel-default 2-->\n';

}
return __p
};

this["JST"]["ooiui/static/js/partials/EnduranceDeploymentSchedule.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<!-- ==========================================((((((((((())))))))))))==================================================== -->\n<!-- ========================================Description Infrastructure=================================================== -->\n<!-- ==========================================((((((((((())))))))))))==================================================== -->\n<div class="panel panel-default">\n  <div class="panel-heading" role="tab" id="headingTwo">\n    <h4 class="panel-title">\n      <a class="collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapseFour" aria-expanded="false" aria-controls="collapseTwo">\n        Endurance Array Deployment Schedule\n      </a>\n    </h4>\n  </div>\n  <div id="collapseFour" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingTwo">\n    <div class="panel-body">\n      <div class="row">\n        <dl style="list-style-type:disk">\n          <div class="col-md-12">\n            <li><a href="http://oceanobservatories.org/infrastructure/planned-installation-schedule/">OOI Planned Installation Schedule</a></li>\n            <li><a href="http://oceanobservatories.org/ocean-observatories-initiative-ooi-deploys-coastal-infrastructure-components/">Click here for the full story on the April 2014 Endurance Array Deployments.</a></li>\n            <li><a href="http://oceanobservatories.org/cabled-uncabled-endurance-array-components-deployed/" title="Click here for the full story on the October 2014 Endurance Array Deployments.">Click here for the full story on the October 2014 Endurance Array Deployments.</a></li>\n            <li><i>As Deployed configurations below represent those deployed during the April 2014 cruise</i></li>\n          </dl>\n        </div>\n      </div><!-- row -->\n    </div>\n  </div>\n</div><!-- panel panel-default 2-->\n';

}
return __p
};

this["JST"]["ooiui/static/js/partials/EnduranceInfrastructureTables.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<!-- ==========================================((((((((((())))))))))))==================================================== -->\n<!-- ======================================Detailed Infrastructure Tables================================================= -->\n<!-- ==========================================((((((((((())))))))))))==================================================== -->\n<div class="panel panel-default">\n  <div class="panel-heading" role="tab" id="headingTwo">\n    <h4 class="panel-title">\n      <a class="collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapseFive" aria-expanded="false" aria-controls="collapseTwo">\n        Detailed Infrastructure Tables\n      </a>\n    </h4>\n  </div>\n\n  <div id="collapseFive" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingTwo">\n    <div class="panel-body">\n      <div class="row">\n        <div class="col-sm-6">\n          <p>&nbsp;<a class="fa fa-download" style="padding-top:15px; padding-bottom:10px;" href="http://oceanobservatories.org/wp-content/uploads/Inst_Tables_Endurance_2014-12-11_ver_3-02.pdf" target="_blank">&nbsp;&nbsp;Click here to download a PDF of all Infrastructure Tables</a><span style="font-size: medium;"></p>\n          <dl style="list-style-type:disk">\n            <li><a class="highslide img_22" href="http://oceanobservatories.org/wp-content/uploads/Inst_Tables_Endurance_ver_3-01_OR_A_Inshore_SPP.jpg" target="_blank" onclick="return hs.expand(this)">(A) Oregon Inshore Surface-Piercing Profiler Mooring</a>&nbsp;(As Deployed)</li>\n            <li><a class="highslide img_23" href="http://oceanobservatories.org/wp-content/uploads/Inst_Tables_Endurance_ver_3-01_OR_B_Inshore_Surf.jpg" target="_blank" onclick="return hs.expand(this)">(B) Oregon Inshore Surface Mooring</a>&nbsp;(As Deployed)</li>\n            <li><a class="highslide img_24" href="http://oceanobservatories.org/wp-content/uploads/Inst_Tables_Endurance_ver_3-01_OR_C_Shelf_BEP.jpg" target="_blank" onclick="return hs.expand(this)">(C) Oregon Shelf Benthic Experiment Package</a></li>\n            <li><a class="highslide img_25" href="http://oceanobservatories.org/wp-content/uploads/Inst_Tables_Endurance_ver_3-01_OR_D_Shelf_SPP.jpg" target="_blank" onclick="return hs.expand(this)">(D) Oregon Shelf Surface-Piercing Profiler Mooring</a></li>\n            <li><a class="highslide img_26" href="http://oceanobservatories.org/wp-content/uploads/Inst_Tables_Endurance_ver_3-01_OR_E_Shelf_Surf.jpg" target="_blank" onclick="return hs.expand(this)">(E) Oregon Shelf Surface Mooring</a></li>\n            <li><a class="highslide img_27" href="http://oceanobservatories.org/wp-content/uploads/Inst_Tables_Endurance_ver_3-02_F_OR_Offshore_Shallow_Profiler_Mooring.jpg" target="_blank" onclick="return hs.expand(this)">(F) Oregon Offshore Shallow Profiler Mooring</a></li>\n            <li><a class="highslide img_28" href="http://oceanobservatories.org/wp-content/uploads/Inst_Tables_Endurance_ver_3-01_OR_G_Offshore_Deep_Profiler.jpg" target="_blank" onclick="return hs.expand(this)">(G) Oregon Offshore Deep Profiler Mooring</a></li>\n            <li><a class="highslide img_29" href="http://oceanobservatories.org/wp-content/uploads/Inst_Tables_Endurance_ver_3-01_OR_H_Offshore_BEP.jpg" target="_blank" onclick="return hs.expand(this)">(H) Oregon Offshore Benthic Experiment Package</a></li>\n            <li><a class="highslide img_30" href="http://oceanobservatories.org/wp-content/uploads/Inst_Tables_Endurance_ver_3-01_OR_I_Offshore_Surf.jpg" target="_blank" onclick="return hs.expand(this)">(I) Oregon Offshore Surface Mooring</a></li>\n            <li><a class="highslide img_31" href="http://oceanobservatories.org/wp-content/uploads/Inst_Tables_Endurance_ver_3-01_Glider.jpg" target="_blank" onclick="return hs.expand(this)">Mobile Assets – Glider</a></li>\n          </dl>\n        </div>\n        <div class="col-sm-6">\n          <a href="#ORImgModal" data-toggle="modal"><img src="/img/landingPages/enduranceArray/Endurance_OR_2013-04-03_ver_1-02.png" style="width:480px; padding-top:15px; padding-bottom:10px;" /></a>\n          <div id="ORImgModal" class="modal fade" tabindex="-1">\n            <div class="modal-header">\n              <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>\n            </div>\n            <div class="modal-body" style="text-align:center;">\n              <img src="/img/landingPages/enduranceArray/Endurance_OR_2013-04-03_ver_1-02.png" style="width:1091px;" />\n            </div>\n            <div class="modal-footer">\n              <button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>\n            </div>\n          </div>\n        </div>\n      </div>  <!-- row -->\n\n      <div class="row">\n        <br />\n        <div class="col-sm-6">\n          <p>&nbsp;<a class="fa fa-download" style="padding-top:15px; padding-bottom:10px;" href="http://oceanobservatories.org/wp-content/uploads/Inst_Tables_Endurance_2014-12-11_ver_3-02.pdf" target="_blank">&nbsp;&nbsp;Click here to download a PDF of all Infrastructure Tables</a></p>\n          <dl style="list-style-type:disk">\n            <li><a class="highslide img_22" href="http://oceanobservatories.org/wp-content/uploads/Inst_Tables_Endurance_ver_3-01_OR_A_Inshore_SPP.jpg" target="_blank" onclick="return hs.expand(this)">(A) Oregon Inshore Surface-Piercing Profiler Mooring</a>&nbsp;(As Deployed)</li>\n            <li><a class="highslide img_23" href="http://oceanobservatories.org/wp-content/uploads/Inst_Tables_Endurance_ver_3-01_OR_B_Inshore_Surf.jpg" target="_blank" onclick="return hs.expand(this)">(B) Oregon Inshore Surface Mooring</a> (As Deployed)</li>\n            <li><a class="highslide img_24" href="http://oceanobservatories.org/wp-content/uploads/Inst_Tables_Endurance_ver_3-01_OR_C_Shelf_BEP.jpg" target="_blank" onclick="return hs.expand(this)">(C) Oregon Shelf Benthic Experiment Package</a></li>\n            <li><a class="highslide img_25" href="http://oceanobservatories.org/wp-content/uploads/Inst_Tables_Endurance_ver_3-01_OR_D_Shelf_SPP.jpg" target="_blank" onclick="return hs.expand(this)">(D) Oregon Shelf Surface-Piercing Profiler Mooring</a></li>\n            <li><a class="highslide img_26" href="http://oceanobservatories.org/wp-content/uploads/Inst_Tables_Endurance_ver_3-01_OR_E_Shelf_Surf.jpg" target="_blank" onclick="return hs.expand(this)">(E) Oregon Shelf Surface Mooring</a></li>\n            <li><a class="highslide img_27" href="http://oceanobservatories.org/wp-content/uploads/Inst_Tables_Endurance_ver_3-02_F_OR_Offshore_Shallow_Profiler_Mooring.jpg" target="_blank" onclick="return hs.expand(this)">(F) Oregon Offshore Shallow Profiler Mooring</a></li>\n            <li><a class="highslide img_28" href="http://oceanobservatories.org/wp-content/uploads/Inst_Tables_Endurance_ver_3-01_OR_G_Offshore_Deep_Profiler.jpg" target="_blank" onclick="return hs.expand(this)">(G) Oregon Offshore Deep Profiler Mooring</a></li>\n            <li><a class="highslide img_29" href="http://oceanobservatories.org/wp-content/uploads/Inst_Tables_Endurance_ver_3-01_OR_H_Offshore_BEP.jpg" target="_blank" onclick="return hs.expand(this)">(H) Oregon Offshore Benthic Experiment Package</a></li>\n            <li><a class="highslide img_30" href="http://oceanobservatories.org/wp-content/uploads/Inst_Tables_Endurance_ver_3-01_OR_I_Offshore_Surf.jpg" target="_blank" onclick="return hs.expand(this)">(I) Oregon Offshore Surface Mooring</a></li>\n            <li><a class="highslide img_31" href="http://oceanobservatories.org/wp-content/uploads/Inst_Tables_Endurance_ver_3-01_Glider.jpg" target="_blank" onclick="return hs.expand(this)">Mobile Assets – Glider</a></li>\n          </dl>\n        </div>\n        <div class="col-sm-6">\n          <a href="#WAImgModal" data-toggle="modal"><img src="/img/landingPages/enduranceArray/Endurance_WA_2013-04-17_ver_1-02.png" style="width:480px; padding-top:15px; padding-bottom:10px;" /></a>\n          <div id="WAImgModal" class="modal fade" tabindex="-1">\n            <div class="modal-header">\n              <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>\n            </div>\n            <div class="modal-body" style="text-align:center;">\n              <img src="/img/landingPages/enduranceArray/Endurance_WA_2013-04-17_ver_1-02.png" style="width:1091px;" />\n            </div>\n            <div class="modal-footer">\n              <button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n</div>\n</div>  <!-- panel panel-default 2-->\n';

}
return __p
};

this["JST"]["ooiui/static/js/partials/EnduranceTechnicalDrawings.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<!-- ==========================================((((((((((())))))))))))==================================================== -->\n<!-- =============================================Technical Drawings====================================================== -->\n<!-- ==========================================((((((((((())))))))))))==================================================== -->\n<div class="panel panel-default">\n  <div class="panel-heading" role="tab" id="headingOne">\n    <h4 class="panel-title">\n      <a data-toggle="collapse" data-parent="#accordion" href="#collapseSix" aria-expanded="true" aria-controls="collapseSix">\n        Technical Drawings\n      </a>\n    </h4>\n  </div>\n\n  <div id="collapseSix" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingSix">\n    <div class="panel-body">\n      <div class="row">\n        <div class="col-sm-6">\n          <p>&nbsp;<a class="fa fa-download" style="padding-top: 15px; padding-bottom: 15px;" href="http://oceanobservatories.org/infrastructure/technical-data-package/" target="_blank" title="Click here for the online Technical Data Package">&nbsp;&nbsp;Click here for the online Technical Data Package</a></p>\n            &nbsp;<h6 class="fa fa-info-circle fa-xs">&nbsp;Click the below links for High-Level Technical Drawings</h6></p>\n            <dt>Oregon Line</dt>\n            <dl style="list-style-type:disk">\n              <li><a href="http://oceanobservatories.org/wp-content/uploads/2011/04/3605-00016_CE01ISSM_ENDURANCE_OREGON_INSHORE_MOORING.pdf" target="_blank" title="Oregon Inshore Surface-Piercing Profiler Mooring">(A) Oregon Inshore Surface-Piercing Profiler Mooring</a></li>\n              <li><a href="http://oceanobservatories.org/wp-content/uploads/2011/04/3605-00016_CE01ISSM_ENDURANCE_OREGON_INSHORE_MOORING.pdf" target="_blank" title="Oregon Inshore Surface Mooring">(B) Oregon Inshore Surface Mooring</a>></li>\n              <li><a href="http://oceanobservatories.org/wp-content/uploads/2011/04/3715-10000_BEP_ASM.pdf" target="_blank" title="Oregon Shelf Benthic Experiment Package">(C) Oregon Shelf Benthic Experiment Package</a></li>\n              <li>(D) Oregon Shelf Surface-Piercing Profiler Mooring<span style="font-size: x-small;">&nbsp;(COMING SOON)</span></li>\n              <li><a href="http://oceanobservatories.org/wp-content/uploads/2011/04/3605-00014_CE02SHSM_ENDURANCE_OREGON_SHELF_MOORING.pdf" target="_blank" title="Oregon Shelf Surface Mooring">(E) OregonShelf Surface Mooring</a></li>\n              <li>(F) Oregon Offshore Shallow Profiler Mooring<span style="font-size: x-small;">&nbsp;(COMING SOON)</span></li>\n              <li>(G) Oregon Offshore Deep Profiler Mooring<span style="font-size: x-small;">&nbsp;(COMING SOON)</span></li>\n              <li><a href="http://oceanobservatories.org/wp-content/uploads/2011/04/3715-10000_BEP_ASM.pdf" target="_blank" title="Oregon Offshore Benthic Experiment Package">(H) OregonOffshore Benthic Experiment Package</a></li>\n              <li><a href="http://oceanobservatories.org/wp-content/uploads/2011/04/3605-00015_CE04OSSM_ENDURANCE_OREGON_OFFSHORE_MOORING.pdf" target="_blank" title="Oregon Offshore Surface Mooring">(I) Oregon Offshore Surface Mooring</a></li>\n            </dl>\n          </div>\n        </div>  <!-- row -->\n\n        <div class="row">\n          <div class="col-sm-6">\n            <dt>Washington Line</dt>\n            <dl style="list-style-type:disk">\n              <li>(A) Oregon Inshore Surface-Piercing Profiler Mooring</a><span style="font-size: x-small;">&nbsp;(COMING SOON)</span></li>\n              <li><a href="http://oceanobservatories.org/wp-content/uploads/2011/04/3605-00017_CE06ISSM_ENDURANCE_WASHINGTON_INSHORE_MOORING.pdf" target="_blank" title="Washington Inshore Surface Mooring">(B) Oregon&nbsp;Inshore Surface Mooring</a><span style="font-size: x-small;"></span></li>\n              <li>(C) Oregon Shelf Benthic Experiment Package</a><span style="font-size: x-small;">&nbsp;(COMING SOON)</span></li>\n              <li><a href="http://oceanobservatories.org/wp-content/uploads/2011/04/3605-00012_CE07SHSM_ENDURANCE_WASHINGTON_SHELF_MOORING.pdf" target="_blank" title="Washington Shelf Surface Mooring ">(D) Oregon Shelf Surface-Piercing Profiler Mooring</a></li>\n              <li><a href="http://oceanobservatories.org/wp-content/uploads/2011/04/3605-00001_CE09OSPM_ENDURANCE_WASHINGTON_OFFSHORE_MOORING.pdf" target="_blank" title="Washington Offshore Profiler Mooring">(E) OregonShelf Surface Mooring</a></li>\n              <li><a href="http://oceanobservatories.org/wp-content/uploads/2011/04/3605-00013_CE09OSSM_ENDURANCE_WASHINGTON_OFFSHORE_MOORING.pdf" target="_blank" title="Washington Offshore Surface Mooring ">(F) Oregon Offshore Shallow Profiler Mooring</a></li>\n            </dl>\n          </div>\n        </div>\n      </div>\n    </div><!-- collapseSix -->\n</div>  <!-- panel panel-default -->\n';

}
return __p
};

this["JST"]["ooiui/static/js/partials/CabledArray.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="col-md-6">\n  <div style="float:left;">\n    <h3 align="left"title="Disclaimer: All data are subject to revision without notice; exact locations of mooring sites are not yet finalized; exact depths of sensors will be determined at the time of deployment.">Description<i class="fa fa-info-circle" style="font-size: 12px;"></i></h3>\n    <em class="disclamer"></em>\n\n    <p>Description goes here....</p>\n    </div>  <!-- col-md-6 -->\n\n    <div style="clear:both;">\n      <h3>Summary</h3>\n      <p>????????????????????????????</p>\n    </div>  <!-- col-md-6 -->\n  </div>  <!-- col-md-6 -->\n\n  <!-- HEADER IMAGE -->\n  <div class="col-md-6">\n    <div  id="contact">   \n      <a href="#headerImgModal" data-toggle="modal"><img class="delayImg" delayedSrc="/img/landingPages/cabledArray/Cabled_Array_Map_2014-12-02.jpg" style="width:446px; height:358px;" /></a>\n      <div id="headerImgModal" class="modal fade" tabindex="-1">\n        <div class="modal-header">\n          <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>\n        </div>\n        <div class="modal-body" style="text-align:center;">\n          <img class="delayImg" delayedSrc="/img/landingPages/cabledArray/Cabled_Array_Map_2014-12-02.jpg" style="width:800px; margin-top:30px;" />\n        </div>\n        <div class="modal-footer">\n          <button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>\n        </div>\n      </div>\n    </div>  <!-- col-md-6 -->\n  </div>  <!-- Description-row -->\n\n  <!-- fade in image -->\n  <script>\n  $(document).ready(function() {\n    $(".delayImg").each(function() {\n      this.onload = function() {\n        $(this).animate({opacity: 1}, 2000);\n      };\n      this.src = this.getAttribute("delayedSrc");\n    });\n  });\n  </script>\n';

}
return __p
};

this["JST"]["ooiui/static/js/partials/CabledArrayLocationSampling.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<!-- ==========================================((((((((((())))))))))))==================================================== -->\n<!-- ===========================================Location and Sampleing==================================================== -->\n<!-- ==========================================((((((((((())))))))))))==================================================== -->\n<div class="panel panel-default">\n  <div class="panel-heading" role="tab" id="headingTwo">\n    <h4 class="panel-title">\n      <a class="collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="false" aria-controls="collapseTwo">\n        Locations and Sampling\n      </a>\n    </h4>\n  </div>\n  <div id="collapseOne" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingTwo">\n    <div class="panel-body">\n      <div class="row">\n        <div class="col-md-4">\n\n          <dt>Southern Hydrate Ridge &amp; Slope Base</dt>\n          <dl style="list-style-type:disk">\n            <li>Location: 45°N, 125°W</li>\n            <li>Approximate Water Depth: 807 to 2909 m</li>\n          </dl>\n          <dt>Axial Seamount &amp; Axial Base</dt>\n          <dl style="list-style-type:disk">\n            <li>Location: 46°N, 130°W</li>\n            <li>Approximate Water Depth: 1516 to 2654 m</li>\n          </dl>\n        </div>\n      </div><!-- row -->\n    </div>\n  </div>\n</div><!-- panel panel-default -->\n';

}
return __p
};

this["JST"]["ooiui/static/js/partials/CabledArrayPrimaryInfrastructure.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<!-- ==========================================((((((((((())))))))))))==================================================== -->\n<!-- ===========================================Primary Infrastructure==================================================== -->\n<!-- ==========================================((((((((((())))))))))))==================================================== -->\n<div class="panel panel-default">\n  <div class="panel-heading" role="tab" id="headingTwo">\n    <h4 class="panel-title">\n      <a class="collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">\n        Primary Infrastructure\n      </a>\n    </h4>\n  </div>\n  <div id="collapseTwo" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingTwo">\n    <div class="panel-body">\n      <div class="row">\n        <dl style="list-style-type:disk">\n          <div class="col-md-12">\n            <li>A Shore Station in Pacific City, Oregon</li>\n            <li>~ 900 km of high power (8kW) and high bandwidth (10 GbE) modified telecommunications cable</li>\n            <li>Seven subsea terminals called Primary Nodes to distribute power from the Shore Station to key sites along the Juan de Fuca Plate</li>\n          </dl>\n        </div>\n      </div><!-- row -->\n    </div>\n  </div>\n</div><!-- panel panel-default -->\n';

}
return __p
};

this["JST"]["ooiui/static/js/partials/CabledArraySecondaryInfrastructure.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<!-- ==========================================((((((((((())))))))))))==================================================== -->\n<!-- =========================================Secondary Infrastructure==================================================== -->\n<!-- ==========================================((((((((((())))))))))))==================================================== -->\n<div class="panel panel-default">\n  <div class="panel-heading" role="tab" id="headingThree">\n    <h4 class="panel-title">\n      <a class="collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapseThree" aria-expanded="false" aria-controls="collapseTwo">\n        Secondary Infrastructure\n      </a>\n    </h4>\n  </div>\n  <div id="collapseThree" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingTwo">\n    <div class="panel-body">\n      <div class="row">\n        <dl style="list-style-type:disk">\n          <div class="col-md-12">\n            <li>17 Medium-Power and Low-Power Junction Boxes (J-Box)</li>\n            <li>3 cabled water column sites (PN1A, PN1C and PN3A) each hosting two paired instrumented moorings (a deep profiling mooring from approximately 3000 m to 200 m and a shallow profiling mooring, hosting a platform at 200 m and a winched profiler from 200 m to near sea surface). One paired mooring (PN1C) is shared with the Endurance Oregon Line</li>\n            <li>100 water column and seafloor sensors deployed near the base of each mooring and at Southern Hydrate Ridge and Axial Seamount</li>\n            <li>61 km (29 km buried) of extension cables providing power and communications to secondary infrastructure and sensors</li>\n          </dl>\n        </div>\n      </div><!-- row -->\n    </div>\n  </div>\n</div><!-- panel panel-default -->\n';

}
return __p
};

this["JST"]["ooiui/static/js/partials/CabledArrayStationSummary.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<!-- ==========================================((((((((((())))))))))))==================================================== -->\n<!-- =============================================Station Summary========================================================= -->\n<!-- ==========================================((((((((((())))))))))))==================================================== -->\n<div class="panel panel-default">\n  <div class="panel-heading" role="tab" id="headingFour">\n    <h4 class="panel-title">\n      <a class="collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapseFour" aria-expanded="false" aria-controls="collapseTwo">\n        Station Summary\n      </a>\n    </h4>\n  </div>\n  <div id="collapseFour" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingTwo">\n    <div class="panel-body">\n      <div class="row">\n        <dl style="list-style-type:disk">\n          <div class="col-md-12">\n            The Cabled Array provides unprecedented power (10 kV, 8 kW) and bandwidth (10 GbE) to scientific sensor arrays on the seafloor and throughout the water column. Water column sensors are deployed on moorings with instrumented wire-following profilers, 200-m instrumented platforms, and winched profilers. A shore station in Pacific City, Oregon includes two cable landings serving key sites on the Cabled Array: Slope Base, Southern Hydrate Ridge, Axial Seamount, Axial Base, and the Endurance Array – Oregon Line. The ~ 900 km of modified telecommunications cable (installed in 2012) provides high power and bandwidth to seven Primary Nodes: PN1A (Slope Base), PN1B (Southern Hydrate Ridge), PN3A (Axial Base), PN3B (Axial Seamount), and PN5A (Mid-Plate). The last two primary nodes, PN1C and PN1D, extend from Southern Hydrate Ridge and are part of the Coastal Scale Nodes (CSN) Endurance Oregon Line. The Primary Nodes convert the high power voltage (10 kV) of the primary cable to a lower (375 V) level and distributes it to Science Ports along with communications and timing signals.\n          </dl>\n        </div>\n      </div><!-- row -->\n    </div>\n  </div>\n</div><!-- panel panel-default -->\n';

}
return __p
};

this["JST"]["ooiui/static/js/partials/CabledArrayDeploymentSchedual.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<!-- ==========================================((((((((((())))))))))))==================================================== -->\n<!-- ======================================Cabled Array Deployment Schedule=============================================== -->\n<!-- ==========================================((((((((((())))))))))))==================================================== -->\n<div class="panel panel-default">\n  <div class="panel-heading" role="tab" id="headingFive">\n    <h4 class="panel-title">\n      <a class="collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapseFive" aria-expanded="false" aria-controls="collapseTwo">\n        Cabled Array Deployment Schedule\n      </a>\n    </h4>\n  </div>\n  <div id="collapseFive" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingTwo">\n    <div class="panel-body">\n      <div class="row">\n        <dl style="list-style-type:disk">\n          <div class="col-md-12">\n            <li><a href="http://oceanobservatories.org/infrastructure/planned-installation-schedule/">OOI Planned Installation Schedule</a></li>\n          </dl>\n        </div>\n      </div><!-- row -->\n    </div>\n  </div>\n</div><!-- panel panel-default -->\n';

}
return __p
};

this["JST"]["ooiui/static/js/partials/CabledArrayDetailedInfrastructureTables.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<!-- ==========================================((((((((((())))))))))))==================================================== -->\n<!-- =======================================Detailed Infrastructure Tables================================================ -->\n<!-- ==========================================((((((((((())))))))))))==================================================== -->\n<div class="panel panel-default">\n  <div class="panel-heading" role="tab" id="headingSix">\n    <h4 class="panel-title">\n      <a class="collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapseSix" aria-expanded="false" aria-controls="collapseTwo">\n        Detailed Infrastructure Tables\n      </a>\n    </h4>\n  </div>\n  <div id="collapseSix" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingTwo">\n    <div class="panel-body">\n      <div class="row">\n        <div class="col-sm-6">\n          <p>&nbsp;<a class="fa fa-download" style="padding-top:15px; padding-bottom:10px;" href="http://oceanobservatories.org/wp-content/uploads/Inst_Tables_Endurance_2014-12-11_ver_3-02.pdf" target="_blank">&nbsp;&nbsp;Click here to download a PDF of all Infrastructure Tables</a><span style="font-size: medium;"></p>\n            <dl style="list-style-type:disk">\n              <h5>Axial Seamount (PN3B)</h5>\n              <li><a href="http://oceanobservatories.org/wp-content/uploads/Inst_Tables_Cabled_ver_3-01_MJ03B.jpg" target="_blank" onclick="return hs.expand(this)">MJ03B – Ashes</a></li>\n              <li><a href="http://oceanobservatories.org/wp-content/uploads/Inst_Tables_Cabled_ver_3-01_MJ03C.jpg" target="_blank" onclick="return hs.expand(this)">MJ03C – International District 1</a></li>\n              <li><a href="http://oceanobservatories.org/wp-content/uploads/Inst_Tables_Cabled_ver_3-01_MJ03D.jpg" target="_blank" onclick="return hs.expand(this)">MJ03D – International District 2</a></li>\n              <li><a href="http://oceanobservatories.org/wp-content/uploads/Inst_Tables_Cabled_ver_3-01_MJ03E.jpg" target="_blank" onclick="return hs.expand(this)">MJ03E – Eastern Caldera</a></li>\n              <li><a href="http://oceanobservatories.org/wp-content/uploads/Inst_Tables_Cabled_ver_3-01_MJ03F.jpg" target="_blank" onclick="return hs.expand(this)">MJ03F – Central Caldera</a></li>\n            </dl>\n          </div>\n          <div class="col-sm-6">\n            <a href="#cabledImgAxialSummit" data-toggle="modal"><img src="/img/landingPages/cabledArray/Axial_Summit_2013-06-06-web.jpg" style="width:480px; padding-top:15px; padding-bottom:10px;" /></a>\n            <div id="cabledImgAxialSummit" class="modal fade" tabindex="-1">\n              <div class="modal-header">\n                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>\n              </div>\n              <div class="modal-body" style="text-align:center;">\n                <img src="/img/landingPages/cabledArray/Axial_Summit_2013-06-06-web.jpg" style="width:1091px;" />\n              </div>\n              <div class="modal-footer">\n                <button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>\n              </div>\n            </div>\n          </div>\n        </div>  <!-- row -->\n\n        <div class="row">\n          <div class="col-sm-6">\n            <dl style="list-style-type:disk">\n              <h5>Axial Base (PN3A)</h5>\n              <li><a href="http://oceanobservatories.org/wp-content/uploads/Inst_Tables_Cabled_ver_3-01_MJ03A.jpg" target="_blank" onclick="return hs.expand(this)"></a>MJ03A – Axial Base Medium-Power J-Box</li>\n              <li><a href="http://oceanobservatories.org/wp-content/uploads/Inst_Tables_Cabled_ver_3-01_LV03A_Shallow.jpg" target="_blank" onclick="return hs.expand(this)">LV03A – Axial Base Mooring – Shallow Profiler & 200 m Platform</a></li>\n              <li><a href="http://oceanobservatories.org/wp-content/uploads/Inst_Tables_Cabled_ver_3-01_LV03A_Deep.jpg" target="_blank" onclick="return hs.expand(this)">LV03A – Axial Base Mooring – Deep Profiler</a></li>\n              <li><a href="http://oceanobservatories.org/wp-content/uploads/Inst_Tables_Cabled_ver_3-01_LJ03A.jpg" target="_blank" onclick="return hs.expand(this)">LJ03A – Axial Base Mooring – Seafloor Instruments</a></li>\n            </dl>\n          </div>\n          <div class="col-sm-6">\n            <a href="#cabledImgAxialBase" data-toggle="modal"><img src="/img/landingPages/cabledArray/Axial_Base_2013-06-06-web.jpg" style="width:480px; padding-top:15px; padding-bottom:10px;" /></a>\n            <div id="cabledImgAxialBase" class="modal fade" tabindex="-1">\n              <div class="modal-header">\n                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>\n              </div>\n              <div class="modal-body" style="text-align:center;">\n                <img src="/img/landingPages/cabledArray/Axial_Base_2013-06-06-web.jpg" style="width:1091px;" />\n              </div>\n              <div class="modal-footer">\n                <button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>\n              </div>\n            </div>\n          </div>\n        </div>  <!-- row -->\n\n        <div class="row">\n          <div class="col-sm-6">\n            <dl style="list-style-type:disk">\n              <h5>Southern Hydrate Ridge (PN1B)</h5>\n              <li><a href="http://oceanobservatories.org/wp-content/uploads/Inst_Tables_Cabled_ver_3-01_LJ01B.jpg" target="_blank" onclick="return hs.expand(this)">LJ01B – Southern Hydrate Ridge – Summit 1</a></li>\n              <li><a href="http://oceanobservatories.org/wp-content/uploads/Inst_Tables_Cabled_ver_3-01_MJ01B.jpg" target="_blank" onclick="return hs.expand(this)">MJ01B – Southern Hydrate Ridge – Summit 2</a></li>\n            </dl>\n          </div>\n          <div class="col-sm-6">\n            <a href="#cabledImgSoHydrate" data-toggle="modal"><img src="/img/landingPages/cabledArray/Southern_Hydrate_Ridge_2013-06-06-web.jpg" style="width:480px; padding-top:15px; padding-bottom:10px;" /></a>\n            <div id="cabledImgSoHydrate" class="modal fade" tabindex="-1">\n              <div class="modal-header">\n                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>\n              </div>\n              <div class="modal-body" style="text-align:center;">\n                <img src="/img/landingPages/cabledArray/Southern_Hydrate_Ridge_2013-06-06-web.jpg" style="width:1091px;" />\n              </div>\n              <div class="modal-footer">\n                <button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>\n              </div>\n            </div>\n          </div>\n        </div>  <!-- row -->\n\n        <div class="row">\n          <div class="col-sm-6">\n            <dl style="list-style-type:disk">\n              <h5>Slope Base (PN1A)</h5>\n              <li><a href="http://oceanobservatories.org/wp-content/uploads/Inst_Tables_Cabled_ver_3-01_MJ01A.jpg" target="_blank" onclick="return hs.expand(this)">MJ01A – Slope Base Medium-Power J-Box</a></li>\n              <li><a href="http://oceanobservatories.org/wp-content/uploads/Inst_Tables_Cabled_ver_3-01_LV01A_Shallow.jpg" target="_blank" onclick="return hs.expand(this)">LV01A – Slope Base Mooring – Shallow Profiler & 200 m Platform</a></li>\n              <li><a href="http://oceanobservatories.org/wp-content/uploads/Inst_Tables_Cabled_ver_3-01_LV01A_Deep.jpg" target="_blank" onclick="return hs.expand(this)">LV01A – Slope Base Mooring – Deep Profiler</a></li>\n              <li><a href="http://oceanobservatories.org/wp-content/uploads/Inst_Tables_Cabled_ver_3-01_LJ01A.jpg" target="_blank" onclick="return hs.expand(this)">LJ01A – Slope Base Mooring – Seafloor Instruments</a></li>\n            </dl>\n          </div>\n          <div class="col-sm-6">\n            <a href="#cabledImgSlopeBase" data-toggle="modal"><img src="/img/landingPages/cabledArray/Slope_Base_2013-06-06-web.jpg" style="width:480px; padding-top:15px; padding-bottom:10px;" /></a>\n            <div id="cabledImgSlopeBase" class="modal fade" tabindex="-1">\n              <div class="modal-header">\n                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>\n              </div>\n              <div class="modal-body" style="text-align:center;">\n                <img src="/img/landingPages/cabledArray/Slope_Base_2013-06-06-web.jpg" style="width:1091px;" />\n              </div>\n              <div class="modal-footer">\n                <button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>\n              </div>\n            </div>\n          </div>\n        </div>  <!-- row -->\n\n        <div class="row">\n          <div class="col-sm-6">\n            <dl style="list-style-type:disk">\n              <h5>Acronyms:</h5>\n              <li>PN = Primary Node</li>\n              <li>LV = Low Voltage Node</li>\n              <li>MJ = Medium Power J-Box</li>\n              <li>LJ = Low Voltage J-Box</li>\n            </dl>\n          </div>\n        </div>  <!-- row -->\n\n      </div>\n    </div>\n  </div><!-- panel panel-default 2-->\n';

}
return __p
};

this["JST"]["ooiui/static/js/partials/CabledArrayTechnicalDrawings.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<!-- ==========================================((((((((((())))))))))))==================================================== -->\n<!-- =============================================Technical Details======================================================= -->\n<!-- ==========================================((((((((((())))))))))))==================================================== -->\n<div class="panel panel-default">\n  <div class="panel-heading" role="tab" id="headingSeven">\n    <h4 class="panel-title">\n      <a class="collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapseSeven" aria-expanded="false" aria-controls="collapseTwo">\n        Technical Details\n      </a>\n    </h4>\n  </div>\n  <div id="collapseSeven" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingTwo">\n    <div class="panel-body">\n      <div class="row">\n        <div class="col-sm-6">\n          <p>&nbsp;<a class="fa fa-download" style="padding-top:15px; padding-bottom:10px;" href="http://oceanobservatories.org/infrastructure/technical-data-package/" target="_blank">&nbsp;&nbsp;Click here for the online Technical Data Package</a><span style="font-size: medium;"></p>\n          <p>&nbsp;<a class="fa fa-download" style="padding-top:15px; padding-bottom:10px;" href="http://oceanobservatories.org/design/technology/cabled-technology/" target="_blank">&nbsp;&nbsp;Click here for Cabled Technology Descriptions</a><span style="font-size: medium;"></p>\n            <br />\n            <p>&nbsp;Click the Links for High-Level Infrastructure Graphics</p>\n\n            <div class="col-sm-8">\n              <a href="#cabledImgPrimary" data-toggle="modal">Primary Infrastructure</a>\n              <div id="cabledImgPrimary" class="modal fade" tabindex="-1">\n                <div class="modal-header">\n                  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>\n                </div>\n                <div class="modal-body" style="text-align:center;">\n                  <img src="/img/landingPages/cabledArray/Primary-Infrastructure-2012-02-14-ver-0-01.jpg" style="width:1091px;" />\n                </div>\n                <div class="modal-footer">\n                  <button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>\n                </div>\n              </div>\n            </div>\n            <div class="col-sm-8">\n              <a href="#cabledImgSecondaryInf" data-toggle="modal">Secondary Infrastructure</a>\n              <div id="cabledImgSecondaryInf" class="modal fade" tabindex="-1">\n                <div class="modal-header">\n                  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>\n                </div>\n                <div class="modal-body" style="text-align:center;">\n                  <img src="/img/landingPages/cabledArray/SecondaryInfrastructure_2013-02-13_ver_0-01-web.jpg" style="width:1091px;" />\n                </div>\n                <div class="modal-footer">\n                  <button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>\n                </div>\n              </div>\n            </div>\n            <div class="col-sm-8">\n              <a href="#cabledImgMorrings" data-toggle="modal">Cabled Morrings</a>\n              <div id="cabledImgMorrings" class="modal fade" tabindex="-1">\n                <div class="modal-header">\n                  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>\n                </div>\n                <div class="modal-body" style="text-align:center;">\n                  <img src="/img/landingPages/cabledArray/Cabled_Array_Map_2014-12-02.jpg" style="width:1091px;" />\n                </div>\n                <div class="modal-footer">\n                  <button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>\n                </div>\n              </div>\n            </div>\n            <div class="col-sm-8">\n              <a href="#cabledImgSlopBase" data-toggle="modal">Slope Base Morring &amp; Endurance Array</a>\n              <div id="cabledImgSlopBase" class="modal fade" tabindex="-1">\n                <div class="modal-header">\n                  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>\n                </div>\n                <div class="modal-body" style="text-align:center;">\n                  <img src="/img/landingPages/cabledArray/Slope_Base_2013-06-06-web.jpg" style="width:1091px;" />\n                </div>\n                <div class="modal-footer">\n                  <button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>\n                </div>\n              </div>\n            </div>\n\n\n\n          </div>\n        </div>  <!-- row -->\n      </div>\n    </div>\n  </div><!-- panel panel-default 2-->\n';

}
return __p
};

this["JST"]["ooiui/static/js/partials/PioneerArray.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="col-md-6">\n  <div style="float:left;">\n    <h3 align="left"title="Disclaimer: All data are subject to revision without notice; exact locations of mooring sites are not yet finalized; exact depths of sensors will be determined at the time of deployment.">Description<i class="fa fa-info-circle" style="font-size: 12px;"></i></h3>\n    <em class="disclamer"></em></strong>\n\n    <p>Description goes here.... \n      The Pioneer Array is a network of platforms and sensors operating on the continental shelf and slope south of New England. A moored array will be centered at the shelf break in the mid-Atlantic Bight south of Cape Cod, Massachusetts. Autonomous underwater vehicles (AUVs) will sample the frontal region in the vicinity of the moored array, and gliders will resolve mesoscale features on the outer shelf and the slope sea between the shelf break front and the Gulf Stream.</p>\n    </div>  <!-- col-md-6 -->\n\n    <div style="clear:both;">\n      <h3>Summary</h3>\n      <p>The first phase of the Pioneer Array deployment took place in November 2013, with the installation of three moorings – a surface mooring at the central site, a profiler mooring at the upstream inshore site and a profiler mooring at the upstream offshore site. In April 2014, during the second deployment phase, five Wire-Following Profile Moorings were deployed at the Pioneer Array with three gliders. The third and final deployment phase is scheduled for Fall 2014.</p>\n    </div>  <!-- col-md-6 -->\n  </div>  <!-- col-md-6 -->\n\n  <!-- HEADER IMAGE -->\n  <div class="col-md-6">\n    <div  id="contact">\n      <a href="#headerImgModal" data-toggle="modal"><img class="delayImg" delayedSrc="/img/landingPages/pioneerArray/pioneerArray-header.png" style="width:446px; height:358px;" /></a>\n      <div id="headerImgModal" class="modal fade" tabindex="-1">\n        <div class="modal-header">\n          <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>\n        </div>\n        <div class="modal-body" style="text-align:center;">\n          <img class="delayImg" delayedSrc="/img/landingPages/pioneerArray/pioneerArray-header.png" style="width:800px; margin-top:30px;" />\n        </div>\n        <div class="modal-footer">\n          <button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>\n        </div>\n      </div>\n    </div>  <!-- col-md-6 -->\n  </div>  <!-- Description-row -->\n\n  <!-- fade in image -->\n  <script>\n  $(document).ready(function() {\n    $(".delayImg").each(function() {\n      this.onload = function() {\n        $(this).animate({opacity: 1}, 2000);\n      };\n      this.src = this.getAttribute("delayedSrc");\n    });\n  });\n  </script>\n';

}
return __p
};

this["JST"]["ooiui/static/js/partials/PioneerLocationSampling.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '\n<!-- ==========================================((((((((((())))))))))))==================================================== -->\n<!-- ===========================================Location and Sampleing====================================================== -->\n<!-- ==========================================((((((((((())))))))))))==================================================== -->\n<div class="panel panel-default">\n  <div class="panel-heading" role="tab" id="headingOne">\n    <h4 class="panel-title">\n      <a data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne">\n        Location and Sampling\n      </a>\n    </h4>\n  </div>\n\n  <div id="collapseOne" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingOne">\n    <div class="panel-body">\n      <div class="row">\n        <div class="col-sm-4">\n\n          <dt>Location, Central Mooring</dt>\n          <dl style="list-style-type:disk">\n            <br />\n            <li>\n              40.14°N, 70.78°W\n            </li>\n          </dl>\n          <dt>Approximate Water Depth</dt>\n          <dl style="list-style-type:disk">\n            <br />\n            <li>\n              133 meters at center of moored array\n            </li>\n          </dl>\n          <dt>AUV sampling at center of moored array</dt>\n          <dl style="list-style-type:disk">\n            <br />\n            <li>\n              80 x 110 km box centered on moored array\n            </li>\n          </dl>\n          <br />\n          <dl style="list-style-type:disk">\n            <li>\n              Box Corners:\n            </li>\n            <dl style="list-style-type:circle; padding-left: 20px;">\n              <li>SE: 39.67°N, 70.25°W</li>\n              <li>SW: 39.67°N, 71.17°W</li>\n              <li>NW: 40.67°N, 71.17°W</li>\n              <li>NE: 40.67°N, 70.25°W</li>\n            </dl>\n          </dl>\n          <dt>Glider sampling area (approximate)</dt>\n          <dl style="list-style-type:disk">\n            <br />\n            <li>\n              130 x 185 km box over outer shelf and slope sea\n            </li>\n          </dl>\n          <br />\n          <dl style="list-style-type:disk">\n            <li>\n              Gliders will sample along five tracks off the coast of New England\n              (click here for map) <– LINK TO CP_Glider_Tracks_2014-09-15.png\n            </li>\n          </dl>\n          <br />\n          <dl style="list-style-type:disk">\n            <li>\n              Box Corners:\n            </li>\n            <dl style="list-style-type:circle; padding-left: 20px;">\n              <li>SE: 39.00°N, 69.92°W</li>\n              <li>SW: 39.00°N, 71.50°W</li>\n              <li>NW: 40.67°N, 71.50°W</li>\n              <li>NE: 40.67°N, 69.92°W</li>\n            </dl>\n          </dl>\n          <br />\n          <dl>\n            <p>\n              <a href="#configImgModal" data-toggle="modal">Final Pioneer Mooring Array Configuration (plan view)</a>\n              <div id="configImgModal" class="modal fade" tabindex="-1">\n                <div class="modal-header">\n                  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>\n                </div>\n                <div class="modal-body" style="text-align:center;">\n                  <img src="/img/landingPages/pioneerArray/Pioneer_Array_Config.png"/>\n                </div>\n                <div class="modal-footer">\n                  <button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>\n                </div>\n              </div>\n              <!--      <a href="http://oceanobservatories.org/wp-content/uploads/2011/04/Pioneer_Array_Config_SER_Feb2013_wLegend.png">Final Pioneer Mooring Array Configuration (plan view)</a> -->\n              </p>\n\n              <p>\n              Nominal latitude and longitude, approximate depths, and distances\n              between mooring sites can be viewed in the plan view figure\n              linked below.  Contours are marked in fathoms, mooring site\n              centers are marked by a black “+” and encircled by an approximate\n              0.5-nautical mile radius buffer zone (voluntary area to avoid).\n              Distances between buffer zones are shown between arrows.  Red “X”\n              symbols denote the locations of know “hangs” avoided by mobile-gear\n              fishermen.\n            </p>\n          </dl>\n        </div><!-- col-sm-4 -->\n\n        <div class="col-sm-4">\n\n          <a href="#pioneerMapImgModal" data-toggle="modal"><img src="/img/landingPages/pioneerArray/pioneer_map.jpg" style="width:509px; float:left; margin-left: 100px; margin-top: 30px;" /></a>\n          <div id="pioneerMapImgModal" class="modal fade" tabindex="-1">\n            <div class="modal-header">\n              <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>\n            </div>\n            <div class="modal-body" style="text-align:center;">\n              <img src="/img/landingPages/pioneerArray/pioneer_map.jpg" style="width:800px; margin-top:30px;" />\n            </div>\n            <div class="modal-footer">\n              <button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>\n            </div>\n          </div>\n\n\n          <div  id="contact" style="width:509px; float:left; margin-left: 100px; margin-top: 30px;">\n\n            <div id="contact" class="caption">\n              <p>Map of approximate sampling areas of moorings (yellow box), AUVs (red box), and gliders (white box). Dominant currents are labelled, as well as locations of nearby existing monitoring sites. (Credit: Plueddemann, Sosik and Trowbridge, WHOI; Illustration by Jack Cook)</p>\n            </div>\n          </div>\n        </div><!-- col-sm-4 -->\n      </div><!-- row -->\n    </div><!-- panel-body -->\n  </div><!-- collapseOne -->\n</div><!-- panel panel-default 1-->\n';

}
return __p
};

this["JST"]["ooiui/static/js/partials/PioneerInfrastructureArray.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<!-- ==========================================((((((((((())))))))))))==================================================== -->\n<!-- =======================================Description of Infrastructure====================================================== -->\n<!-- ==========================================((((((((((())))))))))))==================================================== -->\n<div class="panel panel-default">\n  <div class="panel-heading" role="tab" id="headingTwo">\n    <h4 class="panel-title">\n      <a class="collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">\n        Description of Infrastructure\n      </a>\n    </h4>\n  </div>\n  <div id="collapseTwo" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingTwo">\n    <div class="panel-body">\n      <dl style="list-style-type:disk">\n        <br />\n        <li>Three electro-mechanical (EM) surface moorings with wind,\n          photovoltaic and fuel cell power generation, satellite\n          communications and meteorological sensors, and near surface\n          instrument frame (NSIF).</li>\n          <li>A multi-function node (MFN) at the base of each EM mooring; two MFNs supporting AUV docks</li>\n          <li>Five wire-following profiler moorings with small surface expressions.</li>\n          <li>Two surface-piercing profiler moorings</li>\n          <li>Three AUVs</li>\n          <li>Six gliders</li>\n        </dl>\n      </div>\n    </div>\n  </div><!-- panel panel-default 2-->\n';

}
return __p
};

this["JST"]["ooiui/static/js/partials/PioneerStationSummaryArray.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<!-- ==========================================((((((((((())))))))))))==================================================== -->\n<!-- =============================================Station Summary====================================================== -->\n<!-- ==========================================((((((((((())))))))))))==================================================== -->\n<div class="panel panel-default">\n  <div class="panel-heading" role="tab" id="headingThree">\n    <h4 class="panel-title">\n      <a class="collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapseThree" aria-expanded="false" aria-controls="collapseThree">\n        Station Summary\n      </a>\n    </h4>\n  </div>\n  <div id="collapseThree" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingThree">\n    <div class="panel-body">\n      <dl style="list-style-type:disk">\n        <br />\n        <p>\n          The first phase of the Pioneer Array deployment took place\n          in November 2013, with the installation of three moorings – a\n          surface mooring at the central site, a profiler mooring at\n          the upstream inshore site and a profiler mooring at the\n          upstream offshore site. In April 2014, during the second\n          deployment phase, five Wire-Following Profile Moorings were\n          deployed at the Pioneer Array with three gliders. The third\n          and final deployment phase is scheduled for Fall 2014.\n        </p>\n        <br />\n        <p>\n          The backbone of the Pioneer Array will be a frontal-scale\n          moored array with three electro-mechanical (EM) surface\n          moorings and seven profiler moorings. Each surface mooring\n          will incorporate a surface buoy with multiple sources of\n          power generation and multiple surface and subsurface\n          communications systems. Each surface mooring will be\n          anchored by a Multi-Function Node (MFN) on the seafloor.\n          Two MFNs will incorporate docking stations for AUVs. All\n          three MFNs will be capable of supporting multiple onboard\n          (e.g., frame-mounted) sensors as well as external sensor\n          packages connected by wet-mateable connectors. Five\n          profiler moorings with surface expressions for data\n          telemetry will support wire-following profiling packages\n          with a multidisciplinary sensor suite. Two surface-piercing\n          profiler moorings will use a buoyant instrument package\n          capable of profiling from a few meters above the bottom\n          up to the air-sea interface. In order to provide synoptic,\n          multi-scale observations of the outer continental shelf,\n          shelf break region, and continental slope, the moored array\n          will be supplemented by nine mobile platforms – six gliders\n          and three AUVs. The role of the gliders will be to monitor\n          the mesoscale field of the slope sea and outer shelf,\n          resolving rings, eddies and meanders from the Gulf Stream\n          as they impinge on the shelf break front. The AUVs will be\n          the primary tools for resolving cross- and along-front\n          “eddy fluxes” due to frontal instabilities, wind forcing,\n          and mesoscale variability.\n        </p>\n      </dl>\n    </div>\n  </div>\n</div><!-- panel panel-default 3-->\n';

}
return __p
};

this["JST"]["ooiui/static/js/partials/PioneerDeploymentSchedule.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<!-- ==========================================((((((((((())))))))))))==================================================== -->\n<!-- =====================================Pioneer Array Deployment Schedule====================================================== -->\n<!-- ==========================================((((((((((())))))))))))==================================================== -->\n<div class="panel panel-default">\n  <div class="panel-heading" role="tab" id="headingFour">\n    <h4 class="panel-title">\n      <a class="collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapseFour" aria-expanded="false" aria-controls="collapseFour">\n        Pioneer Array Deployment Schedule\n      </a>\n    </h4>\n  </div>\n  <div id="collapseFour" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingFour">\n    <div class="panel-body">\n      <dt>OOI Planned Installtion Schedual</dt>\n\n      <dl style="list-style-type:disk">\n        <br />\n        <p><a href="http://oceanobservatories.org/infrastructure/planned-installation-schedule/">\n          PDF</a></p>\n        </dl>\n      </div>\n    </div>\n  </div><!-- panel panel-default 4-->\n';

}
return __p
};

this["JST"]["ooiui/static/js/partials/PioneerInfrastructureTables.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<!-- ==========================================((((((((((())))))))))))==================================================== -->\n<!-- ======================================Detailed Infrastructure Tables====================================================== -->\n<!-- ==========================================((((((((((())))))))))))==================================================== -->\n<div class="panel panel-default">\n  <div class="panel-heading" role="tab" id="headingFive">\n    <h4 class="panel-title">\n      <a class="collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapseFive" aria-expanded="false" aria-controls="collapseFive">\n        Detailed Infrastructure Tables\n      </a>\n    </h4>\n  </div>\n\n  <div id="collapseFive" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingFive">\n    <div class="panel-body">\n      <dl style="list-style-type:disk">\n        <br />\n        <ul style="list-style:none;">\n          <li>(A) Inshore Surface-Piercing Profiler Mooring\n            <ul>\n              <div class="btn-group btn-group-xs">\n                <a class="btn btn-info" href="http://oceanobservatories.org/wp-content/uploads/2011/04/Inst_Tables_Pioneer_2013-06-14_ver_2-04_A_Inshore-SPP.jpg"><i class="icon-upload-alt"></i> Table</a>\n                <a class="disabled btn btn-default" href="#"><i class="icon-upload-alt"></i> Diagram</a>\n              </div>\n            </ul>\n          </li>\n          <li>(B) Inshore Surface Mooring\n            <ul>\n              <div class="btn-group btn-group-xs">\n                <a class="btn btn-info" href="http://oceanobservatories.org/wp-content/uploads/2011/04/Inst_Tables_Pioneer_2013-03-27_ver_2-03_Inshore_Surface_Mooring.jpg"><i class="icon-upload-alt"></i> Table</a>\n                <a class="btn btn-info" href="http://oceanobservatories.org/wp-content/uploads/2011/04/3604-00022_CP03ISSM_PIONEER_INSHORE_MOORING.pdf"><i class="icon-upload-alt"></i> Diagram</a>\n              </div>\n            </ul>\n          </li>\n          <li>(C) Central Inshore Profiler Mooring (As Deployed)\n            <ul>\n              <div class="btn-group btn-group-xs">\n                <a class="btn btn-info" href="http://oceanobservatories.org/wp-content/uploads/Inst_Tables_Pioneer_ver_3-02_C_Central_Inshore_Profiler.jpg"><i class="icon-upload-alt"></i> Table</a>\n                <a class="btn btn-info" href="http://oceanobservatories.org/wp-content/uploads/2011/04/3604-00010_CP02PMCI_PIONEER_CENTRAL_INSHORE_MOORING.pdf"><i class="icon-upload-alt"></i> Diagram</a>\n              </div>\n            </ul>\n          </li>\n          <li>(D) Central Surface-Piercing Profiler Mooring\n            <ul>\n              <div class="btn-group btn-group-xs">\n                <a class="btn btn-info" href="http://oceanobservatories.org/wp-content/uploads/2011/04/Inst_Tables_Pioneer_2013-06-14_ver_2-04_D_Central-SPP.jpg"><i class="icon-upload-alt"></i> Table</a>\n                <a class="disabled btn btn-default" href="#"><i class="icon-upload-alt"></i> Diagram</a>\n              </div>\n            </ul>\n          </li>\n          <li>(E) Central Surface Mooring\n            <ul>\n              <div class="btn-group btn-group-xs">\n                <a class="btn btn-info" href="http://oceanobservatories.org/wp-content/uploads/2011/04/Inst_Tables_Pioneer_2013-03-27_ver_2-03_Central_Surface_Mooring.jpg"><i class="icon-upload-alt"></i> Table</a>\n                <a class="btn btn-info" href="http://oceanobservatories.org/wp-content/uploads/2011/04/3604-00021_CP01CNSM_PIONEER_CENTRAL_MOORING.pdf"><i class="icon-upload-alt"></i> Diagram</a>\n              </div>\n            </ul>\n          </li>\n          <li>(F) Central Offshore Profiler Mooring (As Deployed)\n            <ul>\n              <div class="btn-group btn-group-xs">\n                <a class="btn btn-info" href="http://oceanobservatories.org/wp-content/uploads/Inst_Tables_Pioneer_ver_3-02_F_Central_Offshore_Profiler.jpg"><i class="icon-upload-alt"></i> Table</a>\n                <a class="btn btn-info" href="http://oceanobservatories.org/wp-content/uploads/2011/04/3604-00011_CP02PMCO_PIONEER_CENTRAL_OFFSHORE_MOORING.pdf"><i class="icon-upload-alt"></i> Diagram</a>\n              </div>\n            </ul>\n          </li>\n          <li>(G) Offshore Profiler Mooring (As Deployed)\n            <ul>\n              <div class="btn-group btn-group-xs">\n                <a class="btn btn-info" href="http://oceanobservatories.org/wp-content/uploads/Inst_Tables_Pioneer_ver_3-02_G_Offshore_Profiler.jpg"><i class="icon-upload-alt"></i> Table</a>\n                <a class="btn btn-info" href="http://oceanobservatories.org/wp-content/uploads/2011/04/3604-00014_CP04OSPM_PIONEER_OFFSHORE_MOORING.pdf"><i class="icon-upload-alt"></i> Diagram</a>\n              </div>\n            </ul>\n          </li>\n          <li>(H) Offshore Surface Mooring\n            <ul>\n              <div class="btn-group btn-group-xs">\n                <a class="btn btn-info" href="http://oceanobservatories.org/wp-content/uploads/2011/04/Inst_Tables_Pioneer_2013-03-27_ver_2-03_Offshore_Surface_Mooring.jpg"><i class="icon-upload-alt"></i> Table</a>\n                <a class="btn btn-info" href="http://oceanobservatories.org/wp-content/uploads/2011/04/3604-00023_CP04OSSM_PIONEER-OFFSHORE-MOORING.pdf"><i class="icon-upload-alt"></i> Diagram</a>\n              </div>\n            </ul>\n          </li>\n          <li>(I) Upstream Inshore Profiler Mooring (As Deployed)\n            <ul>\n              <div class="btn-group btn-group-xs">\n                <a class="btn btn-info" href="http://oceanobservatories.org/wp-content/uploads/Inst_Tables_Pioneer_ver_3-02_I_Upstream_Inshore.jpg"><i class="icon-upload-alt"></i> Table</a>\n                <a class="btn btn-info" href="http://oceanobservatories.org/wp-content/uploads/2011/04/3604-00012_CP02PMUI_PIONEER_UPSTREAM_INSHORE_MOORING.pdf"><i class="icon-upload-alt"></i> Diagram</a>\n              </div>\n            </ul>\n          </li>\n          <li>(J) Upstream Offshore Profiler Mooring (As Deployed)\n            <ul>\n              <div class="btn-group btn-group-xs">\n                <a class="btn btn-info" href="http://oceanobservatories.org/wp-content/uploads/Inst_Tables_Pioneer_ver_3-02_J_Upstream_Offshore.jpg"><i class="icon-upload-alt"></i> Table</a>\n                <a class="btn btn-info" href="http://oceanobservatories.org/wp-content/uploads/2011/04/3604-00013_CP02PMUO_PIONEER_UPSTREAM_OFFSHORE_MOORING.pdf"><i class="icon-upload-alt"></i> Diagram</a>\n              </div>\n            </ul>\n          </li>\n          <li>Mobile Assets – AUV’s\n            <ul>\n              <div class="btn-group btn-group-xs">\n                <a class="btn btn-info" href="http://oceanobservatories.org/wp-content/uploads/Inst_Tables_Pioneer_ver_3-02_AUV.jpg"><i class="icon-upload-alt"></i> Table</a>\n                <a class="disabled btn btn-default" href="#"><i class="icon-upload-alt"></i> Diagram</a>\n              </div>\n            </ul>\n          </li>\n          <li>Mobile Assets – Glider’s\n            <ul>\n              <div class="btn-group btn-group-xs">\n                <a class="btn btn-info" href="http://oceanobservatories.org/wp-content/uploads/Inst_Tables_Pioneer_ver_3-02_Gliders.jpg"><i class="icon-upload-alt"></i> Table</a>\n                <a class="disabled btn btn-default" href="#"><i class="icon-upload-alt"></i> Diagram</a>\n              </div>\n            </ul>\n          </li>\n        </ul>\n      </dl>\n\n      <dt>Infrastructure Tables</dt>\n      <dl style="list-style-type:disk">\n        <br />\n        <p><a href="http://oceanobservatories.org/wp-content/uploads/Inst_Tables_Pioneer_2014-09-15_ver_3-02.pdf" target="_blank">\n          PDF</a></p>\n        </dl>              </div>\n      </div>\n\n    </div><!-- panel panel-default 5-->\n';

}
return __p
};

this["JST"]["ooiui/static/js/partials/PioneerTechnicalDrawings.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<!-- ==========================================((((((((((())))))))))))==================================================== -->\n<!-- =============================================Technical Drawings====================================================== -->\n<!-- ==========================================((((((((((())))))))))))==================================================== -->\n<div class="panel panel-default">\n  <div class="panel-heading" role="tab" id="headingSix">\n    <h4 class="panel-title">\n      <a class="collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapseSix" aria-expanded="false" aria-controls="collapseSix">\n        Technical Drawings\n      </a>\n    </h4>\n  </div>\n\n  <div id="collapseSix" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingSix">\n    <div class="panel-body">\n      <div class="row">\n        <div class="col-sm-4">\n\n          <dl style="list-style-type:disk">\n            <ul style="list-style:none;">\n              <li>(A) Inshore Surface-Piercing Profiler Mooring (COMING SOON)\n              </li>\n              <li>(B) Inshore Surface Mooring\n                <ul>\n                  <div class="btn-group btn-group-xs">\n                    <a class="btn btn-info" href="http://oceanobservatories.org/wp-content/uploads/2011/04/3604-00022_CP03ISSM_PIONEER_INSHORE_MOORING.pdf"><i class="icon-upload-alt"></i>PDF</a>\n                  </div>\n                </ul>\n              </li>\n              <li>(C) Central Inshore Profiler Mooring\n                <ul>\n                  <div class="btn-group btn-group-xs">\n                    <a class="btn btn-info" href="http://oceanobservatories.org/wp-content/uploads/2011/04/3604-00010_CP02PMCI_PIONEER_CENTRAL_INSHORE_MOORING.pdf"><i class="icon-upload-alt"></i>PDF</a>\n                  </div>\n                </ul>\n              </li>\n              <li>(D) Central Surface-Piercing Profiler Mooring (COMING SOON)\n              </li>\n              <li>(E) Central Surface Mooring\n                <ul>\n                  <div class="btn-group btn-group-xs">\n                    <a class="btn btn-info" href="http://oceanobservatories.org/wp-content/uploads/2011/04/3604-00021_CP01CNSM_PIONEER_CENTRAL_MOORING.pdf"><i class="icon-upload-alt"></i>PDF</a>\n                  </div>\n                </ul>\n              </li>\n              <li>(F) Central Offshore Profiler Mooring\n                <ul>\n                  <div class="btn-group btn-group-xs">\n                    <a class="btn btn-info" href="http://oceanobservatories.org/wp-content/uploads/2011/04/3604-00011_CP02PMCO_PIONEER_CENTRAL_OFFSHORE_MOORING.pdf"><i class="icon-upload-alt"></i>PDF</a>\n                  </div>\n                </ul>\n              </li>\n              <li>(G) Offshore Profiler Mooring\n                <ul>\n                  <div class="btn-group btn-group-xs">\n                    <a class="btn btn-info" href="http://oceanobservatories.org/wp-content/uploads/2011/04/3604-00014_CP04OSPM_PIONEER_OFFSHORE_MOORING.pdf"><i class="icon-upload-alt"></i>PDF</a>\n                  </div>\n                </ul>\n              </li>\n              <li>(H) Offshore Surface Mooring\n                <ul>\n                  <div class="btn-group btn-group-xs">\n                    <a class="btn btn-info" href="http://oceanobservatories.org/wp-content/uploads/2011/04/3604-00023_CP04OSSM_PIONEER-OFFSHORE-MOORING.pdf"><i class="icon-upload-alt"></i>PDF</a>\n                  </div>\n                </ul>\n              </li>\n              <li>(I) Upstream Inshore Profiler Mooring\n                <ul>\n                  <div class="btn-group btn-group-xs">\n                    <a class="btn btn-info" href="http://oceanobservatories.org/wp-content/uploads/2011/04/3604-00012_CP02PMUI_PIONEER_UPSTREAM_INSHORE_MOORING.pdf"><i class="icon-upload-alt"></i>PDF</a>\n                  </div>\n                </ul>\n              </li>\n              <li>(J) Upstream Offshore Profiler Mooring\n                <ul>\n                  <div class="btn-group btn-group-xs">\n                    <a class="btn btn-info" href="http://oceanobservatories.org/wp-content/uploads/2011/04/3604-00013_CP02PMUO_PIONEER_UPSTREAM_OFFSHORE_MOORING.pdf"><i class="icon-upload-alt"></i>PDF</a>\n                  </div>\n                </ul>\n              </li>\n            </ul>\n          </dl>\n        </div><!-- col-sm-4 -->\n\n        <div class="col-sm-4">\n\n          <a href="#structureImgModal" data-toggle="modal"><img src="/img/landingPages/pioneerArray/PioneerArray_structure.png" style="width:509px; float:left; margin-left: 100px; margin-top: 30px;" /></a>\n          <div id="structureImgModal" class="modal fade" tabindex="-1">\n            <div class="modal-header">\n              <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>\n            </div>\n            <div class="modal-body" style="text-align:center;">\n              <img src="/img/landingPages/pioneerArray/pioneerArrayStructure.png" style="width:800px; margin-top:30px;" />\n            </div>\n            <div class="modal-footer">\n              <button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>\n            </div>\n          </div>\n\n\n          <div id="contact" class="caption">\n            <p>Map of approximate sampling areas of moorings (yellow box), AUVs (red box), and gliders (white box). Dominant currents are labelled, as well as locations of nearby existing monitoring sites. (Credit: Plueddemann, Sosik and Trowbridge, WHOI; Illustration by Jack Cook)</p>\n          </div>\n        </div>\n\n      </div><!-- col-sm-4 -->\n    </div><!-- row -->\n  </div><!-- panel body -->\n</div><!-- collapseSix -->\n</div><!-- panel panel-default -->\n';

}
return __p
};

this["JST"]["ooiui/static/js/partials/Watch.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<!-- <div class="panel"> -->\n  <div class="panel-heading">\n    <strong><span class="fa fa-navicon"></span> Watches</strong>\n    <div class="pull-right dropdown">\n      <a id="new-watch-dropdown" class="disabled dropdown-toggle" data-toggle="dropdown" href="#">\n        <i class="fa fa-caret-down"></i>\n      </a>\n      <ul class="dropdown-menu">\n        <li>\n          <a id="new-watch-link" href="#">New Watch</a>\n        </li>\n        <li>\n          <a id="end-watch-link" href="#">End Watch</a>\n        </li>\n      </ul>\n    </div> <!-- .pull-right .dropdown -->\n  </div> <!-- .panel-heading -->\n\n  <div id="panelWatch" class="panel-body">\n    <div class="list-group">\n      ';
 collection.each(function(model) { ;
__p += '\n      <div class="watch-item" data-id="' +
((__t = ( model.get('id') )) == null ? '' : __t) +
'">\n        ';
 if(model.get("end_time") != null) { ;
__p += '\n        <a class="list-group-item" href="#">\n        ';
 } else { ;
__p += '\n        <a class="list-group-item" href=\'#\'>\n        ';
 } ;
__p += '\n          <div class="watch-title">\n            ' +
((__t = ( model.getName() )) == null ? '' : __t) +
'\n          </div>\n          <div class="watch-when">\n            ' +
((__t = ( model.getDates() )) == null ? '' : __t) +
'\n          </div>\n        </a>\n      </div>\n      ';
 }); ;
__p += '\n    </div> <!-- .list-group -->\n  </div> <!-- #panelWatch -->\n  <div id=\'new-watch-modal\' class="modal fade">\n    <div class="modal-dialog">\n      <div class="modal-content">\n        <div class="modal-header">\n          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\n          <h4 class="modal-title">Begin a new watch?</h4>\n        </div>\n        <div class="modal-footer">\n          <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\n          <button type="button" id="new-watch" class="btn btn-primary" data-dismiss="modal">Start</button>\n        </div>\n      </div><!-- /.modal-content -->\n    </div><!-- /.modal-dialog -->\n  </div><!-- /.modal -->\n  <div id=\'end-watch-modal\' class="modal fade">\n    <div class="modal-dialog">\n      <div class="modal-content">\n        <div class="modal-header">\n          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\n          <h4 class="modal-title">End the current Watch?</h4>\n        </div>\n        <div class="modal-footer">\n          <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\n          <button type="button" id="end-watch" class="btn btn-primary" data-dismiss="modal">End Watch</button>\n        </div>\n      </div><!-- /.modal-content -->\n    </div><!-- /.modal-dialog -->\n  </div><!-- /.modal -->\n<!-- </div> -->\n';

}
return __p
};

this["JST"]["ooiui/static/js/partials/EventList.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 var i=0; ;
__p += '\n';
 collection.each(function(model) { ;
__p += '\n  <div class="accordion">\n    <div class="accordion-section">\n\n\n        <a class="fa fa-caret-right accordion-section-title" data-toggle="collapse" data-parent="#accordion" href="#collapse' +
((__t = ( i )) == null ? '' : __t) +
'" aria-expanded="false" aria-controls="collapse' +
((__t = ( i )) == null ? '' : __t) +
'">\n          ' +
((__t = ( model.get('event_title') )) == null ? '' : __t) +
'\n          <div class="pull-right">\n            ' +
((__t = (model.getTime() )) == null ? '' : __t) +
'\n          </div>\n        </a>\n      </div>\n\n    <div id="collapse' +
((__t = ( i )) == null ? '' : __t) +
'" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingOne">\n      <div class="panel-body">\n        ' +
((__t = ( model.get('event_comment') )) == null ? '' : __t) +
'\n      </div>\n  </div>\n</div>\n';
 i+= 1; ;
__p += '\n';
 }); ;
__p += '\n';

}
return __p
};

this["JST"]["ooiui/static/js/partials/TimeLineEvent.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '\n<ul class="timeline">   \n  ';
 var i=0; ;
__p += '\n  ';
 collection.each(function(model) { ;
__p += '\n  <li class="';
 if(i%2) {;
__p += 'timeline-inverted';
};
__p += '">\n    ';
 var type_name = model.get('event_type') && model.get('event_type').type_name; ;
__p += '\n    ';
 if(type_name == 'INFO') { ;
__p += '\n    <div class="timeline-badge info"><i class="glyphicon glyphicon-info-sign"></i></div>\n    ';
 } else if(type_name == 'WARN') { ;
__p += '\n    <div class="timeline-badge warning"><i class="glyphicon glyphicon-exclamation-sign"></i></div>\n    ';
 } else if(type_name == 'ERROR') { ;
__p += '\n    <div class="timeline-badge danger"><i class="glyphicon glyphicon-bell"></i></div>\n    ';
 } else if(type_name == 'CRITICAL') { ;
__p += '\n    <div class="timeline-badge danger"><i class="glyphicon glyphicon-remove-sign"></i></div>\n    ';
 } else { ;
__p += '\n    <div class="timeline-badge success"><i class="glyphicon glyphicon-check"></i></div>\n    ';
 } ;
__p += '\n\n    <div class="timeline-panel">\n      <div class="timeline-heading">\n        <h4 class="timeline-title">' +
((__t = ( model.get('event_title') )) == null ? '' : __t) +
'</h4>\n        <p>    \n          <small class="text-muted"><i class="glyphicon glyphicon-time"></i> \n          ' +
((__t = ( model.getTime() )) == null ? '' : __t) +
'\n          </small> \n      </div>\n      <div class="timeline-body">\n\n        <p>' +
((__t = ( model.get('event_comment') )) == null ? '' : __t) +
'</p>\n      </div>\n    </div>\n  </li>\n  ';
 i+= 1; ;
__p += '\n  ';
 }); ;
__p += '\n</ul>\n';

}
return __p
};

this["JST"]["ooiui/static/js/partials/NewEvent.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="newEvent btn-launch">\n\n  <!--Modal-->\n  <!-- data-backdrop prevents the modal from closeing when backtorp is clicked\n  tabindex allows the escape key to be used to close the modal -->\n  <div class="modal fade" id="newEventModal" data-backdrop="static" tabindex="-1">\n    <div class="modal-dialog">\n      <div class="modal-content">\n\n        <!--Header-->\n        <div class="newEvent-header">\n          <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>\n        </div><!-- newEvent-header -->\n\n        <!--Body-->\n        <div class="newEvent-body">\n          <div class="newEvent-center">\n            <div class="new-event-message">\n            </div>\n            <div class="newEventUser-message">\n              ' +
((__t = ( userModel.getFullName() )) == null ? '' : __t) +
'\n            </div>\n            <div class="newEventOrg-message">\n              ' +
((__t = ( orgModel.get('organization_name') )) == null ? '' : __t) +
'\n            </div>\n            <div id="dateTime">\n              ' +
((__t = ( moment().format("MMMM Do YYYY, h:mm:ss a") )) == null ? '' : __t) +
'\n            </div>\n            <input class="newEvent-input" id="newTitleInput" type="text" name="title" placeholder="&#xf022; Event Title" size="25px" />\n            <input class="newEvent-input" id="newCommentInput" type="text" name="comment" placeholder="&#xf0e5; Comment" size="25px" />\n          </div>\n          <div class="newEvent-center">\n            <select id="event-type-selection" class="typeDrop">\n              <option selected disabled>\n                --Choose Type--\n              </option>\n              ';
 operatorEventTypes.each(function(eventType) { ;
__p += '\n              <option value="' +
((__t = ( eventType.get('id') )) == null ? '' : __t) +
'">\n                ' +
((__t = ( eventType.get('type_name') )) == null ? '' : __t) +
'\n              </option>\n              ';
 }); ;
__p += '\n            </select>\n          </div>\n          <div class="newEvent-center">\n            <button class="newEvent btn btn-default" id="new-event-button" type="button">New Event</button>\n          </div>\n          <!-- newEvent-center -->\n        </div>\n        <!-- newEvent-body -->\n\n        <!-- newEvent-footer -->\n      </div>\n      <!-- modal-content -->\n    </div>\n    <!-- modal-dialog -->\n  </div>\n  <!-- modal fade -->\n</div>\n<!-- newEvent btn-launch -->\n';

}
return __p
};

this["JST"]["ooiui/static/js/partials/Event.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<!-- <div class="panel"> -->\n  <div id="new-event" class="panel-heading">\n    <strong><span class="fa fa-tasks"></span> Events</strong>\n      <div class="pull-right">\n        <div class="dropdown">\n          <a class="btn-sm btn-default" id=\'list-view\' href="#"><i class="fa fa-list"></i></a>\n          <a class="btn-sm btn-default" id=\'timeline-view\' href="#"><i class="fa fa-align-center"></i></a>\n\n          <a class="dropdown-toggle" data-toggle="dropdown" href="#">\n            <i class="fa fa-caret-down"></i>\n          </a>\n\n          <ul class="disabled dropdown-menu dropdown-menu-right">\n            <li>\n              <a id=\'new-event-link\' href="#">New Event</a>\n            </li>\n          </ul>\n        </div>\n      </div>\n  </div>\n  <div id="panel-events" class="panel-body"></div>\n  <div id="new-event-modal">\n    <!-- This div is hidden until the modal is shown -->\n  </div>\n<!-- </div> -->\n';

}
return __p
};

this["JST"]["ooiui/static/js/partials/LoggedInNavItems.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<li><a href="/streams/">\n    <span class="glyphicon glyphicon-hdd" aria-hidden="true">\n    </span> Data Catalog</a>\n<li>\n<li>\n    <a href="/troubleTicket">\n    \t<span class="fa fa-exclamation-triangle" aria-hidden="true">\n    \t</span> Submit a Trouble Ticket\n\t</a>\n</li>\n<li>\n<a href="/opLog.html">\n  <!-- mail envelope -->\n  <i class="fa fa-envelope fa-fw"></i>\n  </span> Operator Logs</a>\n</li>\n';

}
return __p
};