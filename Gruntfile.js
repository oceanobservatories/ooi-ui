module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jst: {
      compile: {
        files: {
          "ooiui/static/js/partials/compiled/loginDemo.js": [
            /* 
             * This is the basic form partial that has the modal dialog
             * prompting the user for username and password
             */
            "ooiui/static/js/partials/loginForm.html",
            /*
             * This is a generic partial for displaying an alert
             */
            "ooiui/static/js/partials/Alert.html"
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
            'ooiui/static/lib/leaflet/dist/leaflet.js',
            'ooiui/static/lib/Leaflet.awesome-markers/dist/leaflet.awesome-markers.js',
            'ooiui/static/lib/leaflet.markercluster/dist/leaflet.markercluster.js',
            'ooiui/static/lib/moment/moment.js',
            'ooiui/static/lib/bootstrap3-datetimepicker/src/js/bootstrap-datetimepicker.js',
            'ooiui/static/lib/fancytree/dist/jquery.fancytree-all.js',
            'ooiui/static/js/core/science/map.js', 
            'ooiui/static/js/core/science/plot.js',
            'ooiui/static/js/core/science/toc_menu.js',
            'ooiui/static/js/core/science/variable_list.js'
          ],
          'ooiui/static/js/compiled/loginDemo.js' : [
            'ooiui/static/lib/jquery-cookie/jquery.cookie.js',
            'ooiui/static/lib/underscore/underscore.js',
            'ooiui/static/lib/backbone/backbone.js'
          ],
          'ooiui/static/js/compiled/signup.js' : [
            'ooiui/static/lib/jquery-cookie/jquery.cookie.js',
            'ooiui/static/lib/underscore/underscore.js',
            'ooiui/static/lib/backbone/backbone.js',
            'ooiui/static/lib/backbone-validation/dist/backbone-validation.js',
            'ooiui/static/lib/backbone.stickit/backbone.stickit.js',
            'ooiui/static/js/models/common/LoginModel.js',
            'ooiui/static/js/views/common/LoginView.js'
          ],
          'ooiui/static/js/compiled/loginDemo.js' : [
            "ooiui/static/lib/underscore/underscore.js",
            "ooiui/static/lib/backbone/backbone.js",
            "ooiui/static/lib/leaflet/dist/leaflet.js",
            "ooiui/static/lib/Leaflet.awesome-markers/dist/leaflet.awesome-markers.js",
            "ooiui/static/lib/leaflet.markercluster/dist/leaflet.markercluster.js",
            "ooiui/static/lib/metis-menu/dist/metisMenu.js",
            "ooiui/static/js/views/common/TocColView.js",
            "ooiui/static/js/models/common/TocColModel.js",
            "ooiui/static/js/views/common/MapView.js",
            "ooiui/static/lib/loremjs/lorem.js"
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
          "ooiui/static/css/compiled/index_new.css" : [
            "ooiui/static/lib/leaflet/dist/leaflet.css",
            "ooiui/static/lib/Leaflet.awesome-markers/dist/leaflet.awesome-markers.css",
            "ooiui/static/lib/leaflet.markercluster/dist/MarkerCluster.css",
            "ooiui/static/lib/leaflet.markercluster/dist/MarkerCluster.Default.css",
            "ooiui/static/css/common/scienceLayout.css",
            "ooiui/static/lib/metis-menu/dist/metisMenu.css",
            "ooiui/static/css/common/loginDemo.css"
          ]
        }
      }
    }
  })

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jst');

  grunt.registerTask('default', ['jst', 'concat']);
};
