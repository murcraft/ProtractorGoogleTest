'use strict'

module.exports = function () {
  $.gulp.task('startProtractor', function () {
    $.gulp
      .src(['./spec/pageObjectSpec.js'])
      .pipe($.notify('Were found changes, Executing scripts'))
      .pipe($.protractor({
        configFile: 'conf.js',
        directConnect: true,
        browserName: 'chrome'
      }))
      .on('error', function (e) {
        console.log(e)
      })

  })

}