'use strict'

module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    protractor: require('./grunt/task/protractor.js')
  })

  grunt.loadNpmTasks('grunt-protractor-runner')

  grunt.registerTask('default', ['protractor'])
}

