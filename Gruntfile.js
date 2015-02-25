module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jst: {
      compile: {
        files: {
          "ooiui/static/js/partials/compiled/index.js" : [
            "ooiui/static/js/partials/TOC.html",
            "ooiui/static/js/partials/TOCItem.html",
            "ooiui/static/js/partials/ArrayItem.html",
            "ooiui/static/js/partials/StreamItem.html",
            "ooiui/static/js/partials/DropdownMessages.html",
            "ooiui/static/js/partials/DropdownMessage.html",
            "ooiui/static/js/partials/DropdownUserLoggedIn.html",
            "ooiui/static/js/partials/DropdownUserLoggedOut.html",
            "ooiui/static/js/partials/LoginForm.html",
            "ooiui/static/js/partials/NewEvent.html",
            "ooiui/static/js/partials/ModalDialog.html",
            "ooiui/static/js/partials/Navbar.html",
            "ooiui/static/js/partials/MenuToggle.html",
             "ooiui/static/js/partials/LoggedInNavItems.html"
          ],
          "ooiui/static/js/partials/compiled/loginDemo.js": [
            /*
            * This is the basic form partial that has the modal dialog
            * prompting the user for username and password
            */
            "ooiui/static/js/partials/loginForm.html",
            /*
            * This is a generic partial for displaying an alert
            */
            "ooiui/static/js/partials/Alert.html",
             "ooiui/static/js/partials/LoggedInNavItems.html"
          ],
          "ooiui/static/js/partials/compiled/newEvent.js": [
            "ooiui/static/js/partials/newEvent.html",
             "ooiui/static/js/partials/LoggedInNavItems.html"
          ],
          "ooiui/static/js/partials/compiled/signup.js": [
            "ooiui/static/js/partials/DropdownMessages.html",
            "ooiui/static/js/partials/DropdownMessage.html",
            "ooiui/static/js/partials/DropdownUserLoggedIn.html",
            "ooiui/static/js/partials/DropdownUserLoggedOut.html",
            "ooiui/static/js/partials/LoginForm.html",
            "ooiui/static/js/partials/NewEvent.html",
            "ooiui/static/js/partials/ModalDialog.html",
            "ooiui/static/js/partials/Navbar.html",
            "ooiui/static/js/partials/MenuToggle.html",
            "ooiui/static/js/partials/Alert.html",
            "ooiui/static/js/partials/LoggedInNavItems.html"
          ],
          "ooiui/static/js/partials/compiled/troubleTicket.js": [
            "ooiui/static/js/partials/DropdownMessages.html",
            "ooiui/static/js/partials/DropdownMessage.html",
            "ooiui/static/js/partials/DropdownUserLoggedIn.html",
            "ooiui/static/js/partials/DropdownUserLoggedOut.html",
            "ooiui/static/js/partials/LoginForm.html",
            "ooiui/static/js/partials/NewEvent.html",
            "ooiui/static/js/partials/ModalDialog.html",
            "ooiui/static/js/partials/Navbar.html",
            "ooiui/static/js/partials/TroubleTicket.html",
            "ooiui/static/js/partials/MenuToggle.html",
            "ooiui/static/js/partials/Alert.html",
            "ooiui/static/js/partials/LoggedInNavItems.html"
          ],
          "ooiui/static/js/partials/compiled/userEdit.js": [
            "ooiui/static/js/partials/DropdownMessages.html",
            "ooiui/static/js/partials/DropdownMessage.html",
            "ooiui/static/js/partials/DropdownUserLoggedIn.html",
            "ooiui/static/js/partials/DropdownUserLoggedOut.html",
            "ooiui/static/js/partials/LoginForm.html",
            "ooiui/static/js/partials/ModalDialog.html",
            "ooiui/static/js/partials/Navbar.html",
            "ooiui/static/js/partials/MenuToggle.html",
            "ooiui/static/js/partials/Alert.html",
            "ooiui/static/js/partials/UserEditForm.html",
            "ooiui/static/js/partials/LoggedInNavItems.html"
          ],
          "ooiui/static/js/partials/compiled/users.js": [
            "ooiui/static/js/partials/DropdownMessages.html",
            "ooiui/static/js/partials/DropdownMessage.html",
            "ooiui/static/js/partials/DropdownUserLoggedIn.html",
            "ooiui/static/js/partials/DropdownUserLoggedOut.html",
            "ooiui/static/js/partials/LoginForm.html",
            "ooiui/static/js/partials/ModalDialog.html",
            "ooiui/static/js/partials/Navbar.html",
            "ooiui/static/js/partials/MenuToggle.html",
            "ooiui/static/js/partials/Alert.html",
            "ooiui/static/js/partials/UserTable.html",
            "ooiui/static/js/partials/UserTableItem.html",
            "ooiui/static/js/partials/LoggedInNavItems.html"
          ],
          "ooiui/static/js/partials/compiled/basic.js": [
            "ooiui/static/js/partials/DropdownMessages.html",
            "ooiui/static/js/partials/DropdownMessage.html",
            "ooiui/static/js/partials/DropdownUserLoggedIn.html",
            "ooiui/static/js/partials/DropdownUserLoggedOut.html",
            "ooiui/static/js/partials/LoginForm.html",
            "ooiui/static/js/partials/NewEvent.html",
            "ooiui/static/js/partials/ModalDialog.html",
            "ooiui/static/js/partials/Navbar.html",
            "ooiui/static/js/partials/MenuToggle.html",
            "ooiui/static/js/partials/Panel.html",
            "ooiui/static/js/partials/Alert.html",
            "ooiui/static/js/partials/LoggedInNavItems.html"
          ],
          "ooiui/static/js/partials/compiled/svgplot.js": [
            "ooiui/static/js/partials/DropdownMessages.html",
            "ooiui/static/js/partials/DropdownMessage.html",
            "ooiui/static/js/partials/DropdownUserLoggedIn.html",
            "ooiui/static/js/partials/DropdownUserLoggedOut.html",
            "ooiui/static/js/partials/LoginForm.html",
            "ooiui/static/js/partials/NewEvent.html",
            "ooiui/static/js/partials/ModalDialog.html",
            "ooiui/static/js/partials/Navbar.html",
            "ooiui/static/js/partials/MenuToggle.html",
            "ooiui/static/js/partials/Panel.html",
            "ooiui/static/js/partials/Alert.html",
            "ooiui/static/js/partials/AnnotationTable.html",
            "ooiui/static/js/partials/AnnotationTableItem.html",
            "ooiui/static/js/partials/SVGPlotControl.html",
            "ooiui/static/js/partials/StreamTable.html",
            "ooiui/static/js/partials/StreamTableItem.html",
            "ooiui/static/js/partials/StreamDownloadForm.html",
            "ooiui/static/js/partials/ModalForm.html",
            "ooiui/static/js/partials/AnnotationModalForm.html",
            "ooiui/static/js/partials/LoggedInNavItems.html"
          ],
          "ooiui/static/js/partials/compiled/plotsDemo.js": [
            "ooiui/static/js/partials/DropdownMessages.html",
            "ooiui/static/js/partials/DropdownMessage.html",
            "ooiui/static/js/partials/DropdownUserLoggedIn.html",
            "ooiui/static/js/partials/DropdownUserLoggedOut.html",
            "ooiui/static/js/partials/LoginForm.html",
            "ooiui/static/js/partials/NewEvent.html",
            "ooiui/static/js/partials/ModalDialog.html",
            'ooiui/static/js/partials/AnnotationModal.html',
            "ooiui/static/js/partials/Navbar.html",
            "ooiui/static/js/partials/MenuToggle.html",
            "ooiui/static/js/partials/Panel.html",
            "ooiui/static/js/partials/Alert.html",
            'ooiui/static/js/partials/Chart.html',
            'ooiui/static/js/partials/ChartTypeTemplate.html',
            'ooiui/static/js/partials/ChartFilterTemplate.html',
            "ooiui/static/js/partials/LoggedInNavItems.html"
          ],
          "ooiui/static/js/partials/compiled/OpLog.js": [
            "ooiui/static/js/partials/DropdownMessages.html",
            "ooiui/static/js/partials/DropdownMessage.html",
            "ooiui/static/js/partials/DropdownUserLoggedIn.html",
            "ooiui/static/js/partials/DropdownUserLoggedOut.html",
            "ooiui/static/js/partials/LoginForm.html",
            "ooiui/static/js/partials/ModalDialog.html",
            "ooiui/static/js/partials/Navbar.html",
            "ooiui/static/js/partials/MenuToggle.html",
            "ooiui/static/js/partials/Panel.html",
            "ooiui/static/js/partials/Alert.html",
            "ooiui/static/js/partials/Chart.html",
            "ooiui/static/js/partials/FakeTable.html",
            "ooiui/static/js/partials/Watch.html",
            "ooiui/static/js/partials/OrgSidebar.html",
            "ooiui/static/js/partials/EventList.html",
            "ooiui/static/js/partials/TimeLineEvent.html",
            "ooiui/static/js/partials/NewEvent.html",
            "ooiui/static/js/partials/Event.html",
            "ooiui/static/js/partials/LoggedInNavItems.html"
          ],
          "ooiui/static/js/partials/compiled/pioneerArray.js": [
            "ooiui/static/js/partials/TOC.html",
            "ooiui/static/js/partials/TOCItem.html",
            "ooiui/static/js/partials/ArrayItem.html",
            "ooiui/static/js/partials/StreamItem.html",
            "ooiui/static/js/partials/DropdownMessages.html",
            'ooiui/static/js/partials/statusItem.html',
            "ooiui/static/js/partials/DropdownMessage.html",
            "ooiui/static/js/partials/DropdownUserLoggedIn.html",
            "ooiui/static/js/partials/DropdownUserLoggedOut.html",
            "ooiui/static/js/partials/LoginForm.html",
            "ooiui/static/js/partials/NewEvent.html",
            "ooiui/static/js/partials/ModalDialog.html",
            "ooiui/static/js/partials/Navbar.html",
            "ooiui/static/js/partials/MenuToggle.html"
          ],
           "ooiui/static/js/partials/compiled/statusPage.js" : [
            "ooiui/static/js/partials/TOC.html",
            "ooiui/static/js/partials/TOCItem.html",
            "ooiui/static/js/partials/ArrayItem.html",
            "ooiui/static/js/partials/StreamItem.html",
            "ooiui/static/js/partials/DropdownMessages.html",
            'ooiui/static/js/partials/StatusItem.html',

            'ooiui/static/js/partials/StatusItems.html',
            'ooiui/static/js/partials/StatusFilter.html',
            "ooiui/static/js/partials/DropdownMessage.html",
            "ooiui/static/js/partials/DropdownUserLoggedIn.html",
            "ooiui/static/js/partials/DropdownUserLoggedOut.html",
            "ooiui/static/js/partials/LoginForm.html",
            "ooiui/static/js/partials/NewEvent.html",
            "ooiui/static/js/partials/ModalDialog.html",
            "ooiui/static/js/partials/Navbar.html",
            "ooiui/static/js/partials/MenuToggle.html"
          ],


          "ooiui/static/js/partials/compiled/streams.js": [
            "ooiui/static/js/partials/DropdownMessages.html",
            "ooiui/static/js/partials/DropdownMessage.html",
            "ooiui/static/js/partials/DropdownUserLoggedIn.html",
            "ooiui/static/js/partials/DropdownUserLoggedOut.html",
            "ooiui/static/js/partials/LoginForm.html",
            "ooiui/static/js/partials/ModalDialog.html",
            "ooiui/static/js/partials/Navbar.html",
            "ooiui/static/js/partials/MenuToggle.html",
            "ooiui/static/js/partials/Panel.html",
            "ooiui/static/js/partials/Alert.html",
            "ooiui/static/js/partials/Chart.html",
            "ooiui/static/js/partials/FakeTable.html",
            "ooiui/static/js/partials/OrgSidebar.html",
            "ooiui/static/js/partials/PioneerArrayTOC.html",
            "ooiui/static/js/partials/PioneerArray.html",
            "ooiui/static/js/partials/InfrastructureArray.html",
            "ooiui/static/js/partials/StationSummaryArray.html",
            "ooiui/static/js/partials/DeploymentSchedule.html",
            "ooiui/static/js/partials/InfrastructureTables.html",
            "ooiui/static/js/partials/TechnicalDrawings.html",
            "ooiui/static/js/partials/Watch.html",
            "ooiui/static/js/partials/EventList.html",
            "ooiui/static/js/partials/TimeLineEvent.html",
            "ooiui/static/js/partials/NewEvent.html",
            "ooiui/static/js/partials/Event.html",
            "ooiui/static/js/partials/LoggedInNavItems.html"
          ],
          "ooiui/static/css/compiled/streams.css" : [
            "ooiui/static/css/common/AnnotationTableView.css",
            "ooiui/static/lib/bootstrap-select/dist/css/bootstrap-select.css",
            "ooiui/static/css/common/scienceLayout.css",
            "ooiui/static/lib/metis-menu/dist/metisMenu.css",
            "ooiui/static/css/common/loginDemo.css",
            "ooiui/static/css/common/newEvent.css",
            "ooiui/static/css/common/ModalForm.css"
          ]
        }
      }
    },
    concat: {
      js: {
        options: {
          banner: "'use strict';\n",
          process: function(src, filepath) {
            return '// Source: ' + filepath + '\n' +
            src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
          },
        },
        files: {
          'ooiui/static/js/compiled/science.js' : [
            // Libs
            'ooiui/static/lib/leaflet/dist/leaflet.js',
            'ooiui/static/lib/Leaflet.awesome-markers/dist/leaflet.awesome-markers.js',
            'ooiui/static/lib/leaflet.markercluster/dist/leaflet.markercluster.js',
            'ooiui/static/lib/moment/moment.js',
            'ooiui/static/lib/bootstrap3-datetimepicker/src/js/bootstrap-datetimepicker.js',
            'ooiui/static/lib/fancytree/dist/jquery.fancytree-all.js',
            // App
            'ooiui/static/js/core/science/map.js',
            'ooiui/static/js/core/science/plot.js',
            'ooiui/static/js/core/science/toc_menu.js',
            'ooiui/static/js/core/science/variable_list.js'
          ],
          'ooiui/static/js/compiled/loginDemo.js' : [
            // Libs
            'ooiui/static/lib/jquery-cookie/jquery.cookie.js',
            'ooiui/static/lib/underscore/underscore.js',
            'ooiui/static/lib/backbone/backbone.js'
          ],
          'ooiui/static/js/compiled/newEvent.js' : [
            // Libs
            'ooiui/static/lib/jquery-cookie/jquery.cookie.js',
            'ooiui/static/lib/underscore/underscore.js',
            'ooiui/static/lib/backbone/backbone.js'
          ],
          'ooiui/static/js/compiled/signup.js' : [
            // Libs
            'ooiui/static/lib/jquery-cookie/jquery.cookie.js',
            'ooiui/static/lib/underscore/underscore.js',
            'ooiui/static/lib/backbone/backbone.js',
            'ooiui/static/lib/backbone-validation/dist/backbone-validation.js',
            'ooiui/static/lib/backbone.stickit/backbone.stickit.js',
            // App
            'ooiui/static/js/ooi.js',
            // Models
            'ooiui/static/js/models/common/MessageModel.js',
            'ooiui/static/js/models/common/LoginModel.js',
            'ooiui/static/js/models/common/UserModel.js',
            'ooiui/static/js/models/common/UserFormModel.js',
            'ooiui/static/js/models/common/RoleModel.js',
            'ooiui/static/js/models/common/OrganizationModel.js',
            // Views
            'ooiui/static/js/views/common/DropdownMessagesView.js',
            'ooiui/static/js/views/common/DropdownUserView.js',
            "ooiui/static/js/views/common/NavbarView.js",
            'ooiui/static/js/views/common/LoginView.js',
            'ooiui/static/js/views/common/ModalDialogView.js',
            'ooiui/static/js/views/common/UserFormView.js'
          ],
          'ooiui/static/js/compiled/troubleTicket.js' : [
            // Libs
            'ooiui/static/lib/jquery-cookie/jquery.cookie.js',
            'ooiui/static/lib/underscore/underscore.js',
            'ooiui/static/lib/backbone/backbone.js',
            'ooiui/static/lib/backbone-validation/dist/backbone-validation.js',
            'ooiui/static/lib/backbone.stickit/backbone.stickit.js',
            'ooiui/static/lib/moment/moment.js',
            // App
            'ooiui/static/js/ooi.js',
            // Models
            'ooiui/static/js/models/common/MessageModel.js',
            'ooiui/static/js/models/common/LoginModel.js',
            'ooiui/static/js/models/common/UserModel.js',
            'ooiui/static/js/models/common/UserFormModel.js',
            'ooiui/static/js/models/common/RoleModel.js',
            'ooiui/static/js/models/common/OrganizationModel.js',
            // Views
            'ooiui/static/js/views/common/DropdownMessagesView.js',
            'ooiui/static/js/views/common/DropdownUserView.js',
            "ooiui/static/js/views/common/NavbarView.js",
            "ooiui/static/js/views/common/TroubleTicketView.js",
            'ooiui/static/js/views/common/LoginView.js',
            'ooiui/static/js/views/common/ModalDialogView.js',
            'ooiui/static/js/views/common/UserFormView.js'
          ],
          'ooiui/static/js/compiled/userEdit.js' : [
            // Libs
            'ooiui/static/lib/jquery-cookie/jquery.cookie.js',
            'ooiui/static/lib/underscore/underscore.js',
            'ooiui/static/lib/backbone/backbone.js',
            'ooiui/static/lib/backbone-validation/dist/backbone-validation.js',
            'ooiui/static/lib/backbone.stickit/backbone.stickit.js',
            'ooiui/static/lib/moment/moment.js',
            // App
            'ooiui/static/js/ooi.js',
            // Models
            'ooiui/static/js/models/common/MessageModel.js',
            'ooiui/static/js/models/common/LoginModel.js',
            'ooiui/static/js/models/common/UserModel.js',
            'ooiui/static/js/models/common/UserFormModel.js',
            'ooiui/static/js/models/common/RoleModel.js',
            'ooiui/static/js/models/common/UserModel.js',
            'ooiui/static/js/models/common/UserScopeModel.js',
            'ooiui/static/js/models/common/OrganizationModel.js',
            // Views
            'ooiui/static/js/views/common/DropdownMessagesView.js',
            'ooiui/static/js/views/common/DropdownUserView.js',
            "ooiui/static/js/views/common/NavbarView.js",
            'ooiui/static/js/views/common/LoginView.js',
            'ooiui/static/js/views/common/ModalDialogView.js',
            'ooiui/static/js/views/common/UserEditFormView.js'
          ],
          'ooiui/static/js/compiled/users.js' : [
            // Libs
            'ooiui/static/lib/jquery-cookie/jquery.cookie.js',
            'ooiui/static/lib/underscore/underscore.js',
            'ooiui/static/lib/backbone/backbone.js',
            // App
            'ooiui/static/js/ooi.js',
            // Models
            'ooiui/static/js/models/common/MessageModel.js',
            'ooiui/static/js/models/common/LoginModel.js',
            'ooiui/static/js/models/common/UserModel.js',
            'ooiui/static/js/models/common/UserFormModel.js',
            'ooiui/static/js/models/common/RoleModel.js',
            'ooiui/static/js/models/common/UserModel.js',
            'ooiui/static/js/models/common/OrganizationModel.js',
            // Views
            'ooiui/static/js/views/common/DropdownMessagesView.js',
            'ooiui/static/js/views/common/DropdownUserView.js',
            "ooiui/static/js/views/common/NavbarView.js",
            'ooiui/static/js/views/common/LoginView.js',
            'ooiui/static/js/views/common/ModalDialogView.js',
            'ooiui/static/js/views/common/UserTableView.js'
          ],
          'ooiui/static/js/compiled/index.js' : [
            // Libs
            'ooiui/static/lib/jquery-cookie/jquery.cookie.js',
            "ooiui/static/lib/underscore/underscore.js",
            "ooiui/static/lib/backbone/backbone.js",
            "ooiui/static/lib/leaflet/dist/leaflet.js",
            "ooiui/static/lib/Leaflet.awesome-markers/dist/leaflet.awesome-markers.js",
            "ooiui/static/lib/leaflet.markercluster/dist/leaflet.markercluster.js",
            "ooiui/static/lib/metis-menu/dist/metisMenu.js",
            "ooiui/static/lib/loremjs/lorem.js",
            'ooiui/static/lib/backlunr/backlunr.js',
            // App
            'ooiui/static/js/ooi.js',
            // Models
            'ooiui/static/js/models/science/InstrumentDeploymentModel.js',
            'ooiui/static/js/models/science/PlatformDeploymentModel.js',
            'ooiui/static/js/models/science/ArrayModel.js',
            'ooiui/static/js/models/science/StreamModel.js',
            'ooiui/static/js/models/common/MessageModel.js',
            'ooiui/static/js/models/common/LoginModel.js',
            'ooiui/static/js/models/common/MapModel.js',
            'ooiui/static/js/models/common/UserModel.js',
            // Views
            'ooiui/static/js/views/common/DropdownMessagesView.js',
            'ooiui/static/js/views/common/DropdownUserView.js',
            "ooiui/static/js/views/common/NavbarView.js",
            "ooiui/static/js/views/common/TOCView.js",
            "ooiui/static/js/views/common/MapView.js",
            'ooiui/static/js/views/common/LoginView.js',
            'ooiui/static/js/views/common/ModalDialogView.js'
          ],
          'ooiui/static/js/compiled/basic.js' : [
            // Libs
            'ooiui/static/lib/jquery-cookie/jquery.cookie.js',
            'ooiui/static/lib/underscore/underscore.js',
            'ooiui/static/lib/backbone/backbone.js',
            "ooiui/static/lib/loremjs/lorem.js",
            // App
            'ooiui/static/js/ooi.js',
            // Models
            'ooiui/static/js/models/common/MessageModel.js',
            'ooiui/static/js/models/common/LoginModel.js',
            'ooiui/static/js/models/common/UserModel.js',
            // Views
            'ooiui/static/js/views/common/DropdownMessagesView.js',
            'ooiui/static/js/views/common/DropdownUserView.js',
            "ooiui/static/js/views/common/NavbarView.js",
            'ooiui/static/js/views/common/LoginView.js',
            'ooiui/static/js/views/common/ModalDialogView.js',
            'ooiui/static/js/views/common/PanelView.js',
            'ooiui/static/js/views/common/WatchView.js'
          ],
          'ooiui/static/js/compiled/svgplot.js' : [
            // Libs
            'ooiui/static/lib/jquery-cookie/jquery.cookie.js',
            'ooiui/static/lib/underscore/underscore.js',
            'ooiui/static/lib/backbone/backbone.js',
            "ooiui/static/lib/loremjs/lorem.js",
            'ooiui/static/lib/moment/moment.js',
            'ooiui/static/lib/bootstrap3-datetimepicker/src/js/bootstrap-datetimepicker.js',
            'ooiui/static/lib/bootstrap-select/dist/js/bootstrap-select.js',
            'ooiui/static/lib/backbone.stickit/backbone.stickit.js',
            //'ooiui/static/lib/lunr.js/lunr.js',
            'ooiui/static/lib/backlunr/backlunr.js',
            // App
            'ooiui/static/js/ooi.js',
            // Models
            'ooiui/static/js/models/common/MessageModel.js',
            'ooiui/static/js/models/common/LoginModel.js',
            'ooiui/static/js/models/common/UserModel.js',
            'ooiui/static/js/models/common/AnnotationModel.js',
            'ooiui/static/js/models/science/StreamModel.js',
            // Views
            'ooiui/static/js/views/common/DropdownMessagesView.js',
            'ooiui/static/js/views/common/DropdownUserView.js',
            "ooiui/static/js/views/common/NavbarView.js",
            'ooiui/static/js/views/common/LoginView.js',
            'ooiui/static/js/views/common/ModalDialogView.js',
            'ooiui/static/js/views/common/ModalFormView.js',
            'ooiui/static/js/views/common/PanelView.js',
            'ooiui/static/js/views/common/WatchView.js',
            'ooiui/static/js/views/common/SVGView.js',
            'ooiui/static/js/views/common/AnnotationModalFormView.js',
            'ooiui/static/js/views/science/AnnotationTableView.js',
            'ooiui/static/js/views/science/StreamTableView.js',
            'ooiui/static/js/views/science/StreamDownloadFormView.js'
          ],
          'ooiui/static/js/compiled/plotsDemo.js' : [
            // Libs
            'ooiui/static/lib/jquery-cookie/jquery.cookie.js',
            'ooiui/static/lib/underscore/underscore.js',
            'ooiui/static/lib/backbone/backbone.js',
            "ooiui/static/lib/loremjs/lorem.js",
            'ooiui/static/lib/moment/moment.js',
            'ooiui/static/lib/backbone-validation/dist/backbone-validation.js',
            'ooiui/static/js/core/common/utils.js',
            // App
            'ooiui/static/js/ooi.js',
            // Models
            'ooiui/static/js/models/common/MessageModel.js',
            'ooiui/static/js/models/common/LoginModel.js',
            'ooiui/static/js/models/common/UserModel.js',
            'ooiui/static/js/models/common/ChartModel.js',
            'ooiui/static/js/models/common/AnnotationModel.js',
            //Collection
            'ooiui/static/js/collections/ChartCollection.js',
            //Views
            //
            'ooiui/static/js/views/common/DropdownMessagesView.js',
            'ooiui/static/js/views/common/DropdownUserView.js',
            "ooiui/static/js/views/common/NavbarView.js",
            'ooiui/static/js/views/common/LoginView.js',
            'ooiui/static/js/views/common/ModalDialogView.js',
            'ooiui/static/js/views/common/PanelView.js',
            'ooiui/static/js/views/common/FakeTableView.js',
            'ooiui/static/js/views/common/ChartView.js',
            'ooiui/static/js/views/common/ChartViews.js',
            'ooiui/static/js/views/common/AddAnnotationView.js',
          ],
          'ooiui/static/js/compiled/statusPage.js' : [
            // Libs
            'ooiui/static/lib/jquery-cookie/jquery.cookie.js',
            "ooiui/static/lib/underscore/underscore.js",
            "ooiui/static/lib/backbone/backbone.js",
            "ooiui/static/lib/leaflet/dist/leaflet.js",
            "ooiui/static/lib/Leaflet.awesome-markers/dist/leaflet.awesome-markers.js",
            "ooiui/static/lib/leaflet.markercluster/dist/leaflet.markercluster.js",
            "ooiui/static/lib/metis-menu/dist/metisMenu.js",
            "ooiui/static/lib/loremjs/lorem.js",
            'ooiui/static/lib/backlunr/backlunr.js',
            // App
            'ooiui/static/js/ooi.js',
            // Models
            'ooiui/static/js/models/science/InstrumentDeploymentModel.js',
            'ooiui/static/js/models/science/PlatformDeploymentModel.js',
            'ooiui/static/js/models/science/ArrayModel.js',
            'ooiui/static/js/models/science/StreamModel.js',
            'ooiui/static/js/models/common/MessageModel.js',
            'ooiui/static/js/models/common/LoginModel.js',
            'ooiui/static/js/models/common/MapModel.js',
            'ooiui/static/js/models/common/UserModel.js',
            // Views
            'ooiui/static/js/views/common/DropdownMessagesView.js',
            'ooiui/static/js/views/common/DropdownUserView.js',
            "ooiui/static/js/views/common/NavbarView.js",
            "ooiui/static/js/views/common/TOCView.js",
            "ooiui/static/js/views/common/StatusView.js",
            "ooiui/static/js/views/common/MapView.js",
            'ooiui/static/js/views/common/LoginView.js',
            'ooiui/static/js/views/common/ModalDialogView.js'
          ],

          'ooiui/static/js/compiled/gridDemo.js' : [
            // Libs
            'ooiui/static/lib/jquery-cookie/jquery.cookie.js',
            "ooiui/static/lib/underscore/underscore.js",
            "ooiui/static/lib/backbone/backbone.js",
            "ooiui/static/lib/metis-menu/dist/metisMenu.js",
            "ooiui/static/lib/wellknown/wellknown.js",
            "ooiui/static/lib/loremjs/lorem.js",
            /*tried this it errored on the page for -sontag
            "ooiui/static/lib/backgrid/lib/backgrid.js",
            "ooiui/static/lib/backbone-pageable/lib/backbone-pageable.min.js",
            "ooiui/static/js/core/backgrid/backgrid-paginator.min.js",
            "ooiui/static/js/core/backgrid/backgrid-select-all.min.js",
            "ooiui/static/js/core/backgrid/backgrid-filter.min.js",*/
            "ooiui/static/lib/metis-menu/dist/metisMenu.js",
            "ooiui/static/lib/loremjs/lorem.js",
            // App
            'ooiui/static/js/ooi.js',
            // Models
            'ooiui/static/js/models/science/InstrumentDeploymentModel.js',
            'ooiui/static/js/models/science/PlatformDeploymentModel.js',
            'ooiui/static/js/models/science/ArrayModel.js',
            'ooiui/static/js/models/common/MessageModel.js',
            'ooiui/static/js/models/common/LoginModel.js',
            // Views
            'ooiui/static/js/views/common/DropdownMessagesView.js',
            'ooiui/static/js/views/common/DropdownUserView.js',
            "ooiui/static/js/views/common/NavbarView.js",
            "ooiui/static/js/views/common/TOCView.js",
            "ooiui/static/js/views/common/MapView.js",
            'ooiui/static/js/views/common/LoginView.js',
            'ooiui/static/js/views/common/ModalDialogView.js',
            'ooiui/static/js/views/asset_management/InstrumentView.js',
            'ooiui/static/js/views/asset_management/PlatformView.js'
          ],
          'ooiui/static/js/compiled/opLog.js' : [
            // Libs
            'ooiui/static/lib/jquery-cookie/jquery.cookie.js',
            'ooiui/static/lib/underscore/underscore.js',
            'ooiui/static/lib/backbone/backbone.js',
            'ooiui/static/lib/loremjs/lorem.js',
            'ooiui/static/lib/moment/moment.js',
            // App
            'ooiui/static/js/ooi.js',
            // Models
            'ooiui/static/js/models/common/MessageModel.js',
            'ooiui/static/js/models/common/LoginModel.js',
            'ooiui/static/js/models/common/FakeTableModel.js',
            'ooiui/static/js/models/common/WatchModel.js',
            'ooiui/static/js/models/common/OrganizationModel.js',
            'ooiui/static/js/models/common/EventModel.js',
            'ooiui/static/js/models/common/OperatorEventTypeModel.js',
            'ooiui/static/js/models/common/UserModel.js',
            // Views
            'ooiui/static/js/views/common/DropdownMessagesView.js',
            'ooiui/static/js/views/common/DropdownUserView.js',
            "ooiui/static/js/views/common/NavbarView.js",
            'ooiui/static/js/views/common/LoginView.js',
            'ooiui/static/js/views/common/ModalDialogView.js',
            'ooiui/static/js/views/common/PanelView.js',
            'ooiui/static/js/views/common/FakeTableView.js',
            'ooiui/static/js/views/common/ChartView.js',
            'ooiui/static/js/views/common/ChartViews.js',
            'ooiui/static/js/views/common/WatchView.js',
            'ooiui/static/js/views/common/OrgSidebarView.js',
            'ooiui/static/js/views/common/EventListView.js',
            'ooiui/static/js/views/common/TimeLineEventView.js',
            'ooiui/static/js/views/common/NewEventView.js',
            'ooiui/static/js/views/common/EventView.js'
          ],
          'ooiui/static/js/compiled/streams.js' : [
            // Libs
            'ooiui/static/lib/jquery-cookie/jquery.cookie.js',
            'ooiui/static/lib/underscore/underscore.js',
            'ooiui/static/lib/backbone/backbone.js',
            "ooiui/static/lib/loremjs/lorem.js",
            'ooiui/static/lib/moment/moment.js',
            'ooiui/static/lib/bootstrap3-datetimepicker/src/js/bootstrap-datetimepicker.js',
            'ooiui/static/lib/bootstrap-select/dist/js/bootstrap-select.js',
            'ooiui/static/lib/backbone.stickit/backbone.stickit.js',
            //'ooiui/static/lib/lunr.js/lunr.js',
            'ooiui/static/lib/backlunr/backlunr.js',
            // App
            'ooiui/static/js/ooi.js',
            // Models
            'ooiui/static/js/models/common/MessageModel.js',
            'ooiui/static/js/models/common/LoginModel.js',
            'ooiui/static/js/models/common/UserModel.js',
            'ooiui/static/js/models/common/AnnotationModel.js',
            'ooiui/static/js/models/science/StreamModel.js',
            // Views
            'ooiui/static/js/views/common/DropdownMessagesView.js',
            'ooiui/static/js/views/common/DropdownUserView.js',
            "ooiui/static/js/views/common/NavbarView.js",
            'ooiui/static/js/views/common/LoginView.js',
            'ooiui/static/js/views/common/ModalDialogView.js',
            'ooiui/static/js/views/common/ModalFormView.js',
            'ooiui/static/js/views/common/PanelView.js',
            'ooiui/static/js/views/common/WatchView.js',
            'ooiui/static/js/views/common/SVGView.js',
            'ooiui/static/js/views/common/AnnotationModalFormView.js',
            'ooiui/static/js/views/science/AnnotationTableView.js',
            'ooiui/static/js/views/science/StreamTableView.js',
            'ooiui/static/js/views/science/StreamDownloadFormView.js'
          ],
          'ooiui/static/js/compiled/pioneerArray.js' : [
            // Libs
            'ooiui/static/lib/jquery-cookie/jquery.cookie.js',
            'ooiui/static/lib/underscore/underscore.js',
            'ooiui/static/lib/backbone/backbone.js',
            'ooiui/static/lib/loremjs/lorem.js',
            'ooiui/static/lib/moment/moment.js',
            // App
            'ooiui/static/js/ooi.js',
            // Models
            'ooiui/static/js/models/common/MessageModel.js',
            'ooiui/static/js/models/common/LoginModel.js',
            'ooiui/static/js/models/common/FakeTableModel.js',
            'ooiui/static/js/models/common/WatchModel.js',
            'ooiui/static/js/models/common/OrganizationModel.js',
            'ooiui/static/js/models/common/EventModel.js',
            'ooiui/static/js/models/common/OperatorEventTypeModel.js',
            'ooiui/static/js/models/common/UserModel.js',
            // Views
            'ooiui/static/js/views/common/DropdownMessagesView.js',
            'ooiui/static/js/views/common/DropdownUserView.js',
            "ooiui/static/js/views/common/NavbarView.js",
            'ooiui/static/js/views/common/LoginView.js',
            'ooiui/static/js/views/common/ModalDialogView.js',
            'ooiui/static/js/views/common/PanelView.js',
            'ooiui/static/js/views/common/FakeTableView.js',
            'ooiui/static/js/views/common/ChartView.js',
            'ooiui/static/js/views/common/ChartViews.js',
            'ooiui/static/js/views/common/PioneerArrayTOCView.js',
            'ooiui/static/js/views/common/PioneerArrayView.js',
            'ooiui/static/js/views/common/InfrastructureArrayView.js',
            'ooiui/static/js/views/common/StationSummaryArrayView.js',
            'ooiui/static/js/views/common/DeploymentScheduleView.js',
            'ooiui/static/js/views/common/InfrastructureTablesView.js',
            'ooiui/static/js/views/common/TechnicalDrawingsView.js',
          ]
        }
      },
      css: {
        files: {
          "ooiui/static/css/compiled/science.css" : [
            "ooiui/static/lib/leaflet/dist/leaflet.css",
            "ooiui/static/lib/Leaflet.awesome-markers/dist/leaflet.awesome-markers.css",
            "ooiui/static/css/common/index.css",
            "ooiui/static/lib/leaflet.markercluster/dist/MarkerCluster.css" ,
            "ooiui/static/lib/leaflet.markercluster/dist/MarkerCluster.Default.css" ,
            "ooiui/static/lib/bootstrap3-datetimepicker/build/css/bootstrap-datetimepicker.min.css",
            "ooiui/static/css/common/plot.css",
            "ooiui/static/lib/fancytree/dist/skin-bootstrap/ui.fancytree.css" ,
            "ooiui/static/css/common/toc_menu.css"
          ],
          "ooiui/static/css/compiled/loginDemo.css" : [
            "ooiui/static/lib/bootstrap3-datetimepicker/build/css/bootstrap-datetimepicker.min.css",
            "ooiui/static/css/common/loginDemo.css"
          ],
          "ooiui/static/css/compiled/index.css" : [
            "ooiui/static/lib/leaflet/dist/leaflet.css",
            "ooiui/static/lib/Leaflet.awesome-markers/dist/leaflet.awesome-markers.css",
            "ooiui/static/lib/leaflet.markercluster/dist/MarkerCluster.css",
            "ooiui/static/lib/leaflet.markercluster/dist/MarkerCluster.Default.css",
            "ooiui/static/css/common/scienceLayout.css",
            "ooiui/static/css/common/loginDemo.css",
            "ooiui/static/lib/jquery-ui/themes/smoothness/jquery-ui.css",
            "ooiui/static/lib/bootstrap-select/dist/css/bootstrap-select.css",
            "ooiui/static/css/common/backgridall.min.css"
          ],
          "ooiui/static/css/compiled/signup.css" : [
            "ooiui/static/css/common/userSignUpForm.css",
            "ooiui/static/css/common/scienceLayout.css",
            "ooiui/static/lib/metis-menu/dist/metisMenu.css",
            "ooiui/static/css/common/loginDemo.css"
          ],
          "ooiui/static/css/compiled/troubleTicket.css" : [
            "ooiui/static/css/common/troubleTicket.css",
            "ooiui/static/css/common/scienceLayout.css",
            "ooiui/static/lib/metis-menu/dist/metisMenu.css",
            "ooiui/static/css/common/loginDemo.css"
          ],
          "ooiui/static/css/compiled/userEdit.css" : [
            "ooiui/static/css/common/userSignUpForm.css",
            "ooiui/static/css/common/scienceLayout.css",
            "ooiui/static/lib/metis-menu/dist/metisMenu.css",
            "ooiui/static/css/common/loginDemo.css"
          ],
          "ooiui/static/css/compiled/users.css" : [
            "ooiui/static/css/common/userSignUpForm.css",
            "ooiui/static/css/common/scienceLayout.css",
            "ooiui/static/lib/metis-menu/dist/metisMenu.css",
            "ooiui/static/css/common/loginDemo.css",
            "ooiui/static/lib/metis-menu/dist/metisMenu.css",
            "ooiui/static/css/common/loginDemo.css"
          ],
          "ooiui/static/css/compiled/basic.css" : [
            "ooiui/static/css/common/scienceLayout.css",
            "ooiui/static/lib/metis-menu/dist/metisMenu.css",
            "ooiui/static/css/common/loginDemo.css",
            "ooiui/static/css/common/ne=wEvent.css"
          ],
          "ooiui/static/css/compiled/svgplot.css" : [
            "ooiui/static/css/common/AnnotationTableView.css",
            "ooiui/static/lib/bootstrap-select/dist/css/bootstrap-select.css",
            "ooiui/static/css/common/scienceLayout.css",
            "ooiui/static/lib/metis-menu/dist/metisMenu.css",
            "ooiui/static/css/common/loginDemo.css",
            "ooiui/static/css/common/newEvent.css",
            "ooiui/static/css/common/ModalForm.css"
          ],
          "ooiui/static/css/compiled/plotsDemo.css" : [
            "ooiui/static/css/common/scienceLayout.css",
            "ooiui/static/lib/metis-menu/dist/metisMenu.css",
            "ooiui/static/css/common/annotationModal.css",
            "ooiui/static/css/common/loginDemo.css"
          ],
          "ooiui/static/css/compiled/statusPage.css" : [
            "ooiui/static/lib/leaflet/dist/leaflet.css",
            "ooiui/static/lib/Leaflet.awesome-markers/dist/leaflet.awesome-markers.css",
            "ooiui/static/lib/leaflet.markercluster/dist/MarkerCluster.css",
            "ooiui/static/lib/leaflet.markercluster/dist/MarkerCluster.Default.css",
            "ooiui/static/css/common/scienceLayout.css",
            "ooiui/static/css/common/loginDemo.css",
            "ooiui/static/lib/jquery-ui/themes/smoothness/jquery-ui.css",
            "ooiui/static/lib/bootstrap-select/dist/css/bootstrap-select.css"
          ],

          "ooiui/static/css/compiled/opLog.css" : [
            "ooiui/static/css/common/scienceLayout.css",
            "ooiui/static/lib/metis-menu/dist/metisMenu.css",
            "ooiui/static/css/common/loginDemo.css",
            "ooiui/static/css/common/opLog.css",
            "ooiui/static/css/common/timeline.css",
            "ooiui/static/css/common/orgsidebarview.css",
            "ooiui/static/lib/bootstrap3-datetimepicker/build/css/bootstrap-datetimepicker.min.css",
            "ooiui/static/css/common/newEvent.css",
            "ooiui/static/css/common/watch.css"
          ],
          "ooiui/static/css/compiled/streams.css" : [
            "ooiui/static/css/common/AnnotationTableView.css",
            "ooiui/static/lib/bootstrap-select/dist/css/bootstrap-select.css",
            "ooiui/static/css/common/scienceLayout.css",
            "ooiui/static/lib/metis-menu/dist/metisMenu.css",
            "ooiui/static/css/common/loginDemo.css",
            "ooiui/static/css/common/newEvent.css",
            "ooiui/static/css/common/ModalForm.css"
          ],
          "ooiui/static/css/compiled/pioneerArray.css" : [
            "ooiui/static/lib/metis-menu/dist/metisMenu.css",
            "ooiui/static/lib/bootstrap3-datetimepicker/build/css/bootstrap-datetimepicker.min.css",
            "ooiui/static/css/common/loginDemo.css",
            "ooiui/static/css/common/timeline.css",
            "ooiui/static/css/common/orgsidebarview.css",
            "ooiui/static/css/common/pioneerArray.css"
          ]
        }
      }
    },
    watch: {
      partials: {
        files: ['**/partials/*.html'],
        tasks: ['jst'],
        options: {
        }
      },
      scripts: {
        files: ['**/views/*/*.js', '**/models/*/*.js', '**/ooi.js', '**/common/*.css'],
        tasks: ['concat'],
        options: {
        }
      }
    }
  })

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jst');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['jst', 'concat']);
  // Empty Commnet
};
