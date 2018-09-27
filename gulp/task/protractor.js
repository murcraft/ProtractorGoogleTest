'use strict'

module.exports = function () {
  $.gulp.task('done', function () {
    $.gulp
      .src(['./spec/pageObjectSpec.js'])
      .pipe($.notify('Were found changes, Executing scripts'))
      .pipe($.protractor({
        configFile: 'conf.js',
        directConnect: true
      }))
      .on('error', function (e) {
        console.log(e)
      })

  })

}