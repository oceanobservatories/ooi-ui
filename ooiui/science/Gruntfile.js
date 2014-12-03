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

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-react');

  // Default task(s).
  grunt.registerTask('default', ['react']);

};
