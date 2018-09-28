'use strict'

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    protractor: {
      options: {
        configFile: 'conf.js',
        keepAlive: true,
        noColor: false
      },
      all: {}
    }
  })

  grunt.loadNpmTasks('grunt-protractor-runner');

  grunt.registerTask('run-test', ['protractor:all'])
  grunt.registerTask('default', ['protractor'])
}

