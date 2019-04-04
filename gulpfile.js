'use strict'

global.$ = {
  path: {
    task: require('./gulp/path/task.js')
  },
  gulp: require('gulp'),
  notify: require('gulp-notify'),
  protractor: require('gulp-protractor').protractor,
  webdriver_update: require("gulp-protractor").webdriver_update,
}

$.path.task.forEach((taskPath) => {
  require(taskPath)()
})

$.gulp.task('webdriver-update', $.protractor.webdriver_update);

$.gulp.task('run-protractor', 'startProtractor')

