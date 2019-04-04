'use strict'

module.exports = () => {
  $.gulp.task('startProtractor', () => {
    $.gulp
      .src(['../spec/suite1/pageObjectSpec.js'])
      .pipe($.notify('Were found changes, Executing scripts'))
      .pipe($.protractor({
        configFile: 'conf.js'
      }))
      .on('error', function (e) {
        console.log(e)
      })

  })
}