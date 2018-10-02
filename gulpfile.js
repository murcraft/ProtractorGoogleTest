'use strict'

global.$ = {
  path: {
    task: require('./gulp/path/task.js')
  },
  gulp: require('gulp'),
  notify: require('gulp-notify'),
  protractor: require('gulp-protractor').protractor
}

$.path.task.forEach(function (taskPath) {
  require(taskPath)()
})

$.gulp.task('webdriver-update', $.protractor.webdriver_update);

$.gulp.task('default', ['webdriver-update', 'startProtractor'])

