module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    react: {
      dynamic_mappings: {
        files: [
          {
            expand: true,
            cwd: 'static/react',
            src: ['**/*.jsx'],
            dest: 'static/react',
            ext: '.js'
          }
        ]
      }
    },
  })

  jasmine: {
      components: {
        src: [
        'components/*js'
        ],
        options: {
          specs: 'tests/spec/*Spec.js',
          keepRunner : true,
          //helpers: 'test/spec/*.js'
        }
  }

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-react');

  // Default task(s).
  grunt.registerTask('default', ['react']);
  grunt.registerTask('travis', [
        'jshint','jasmine'
  ]);
};
