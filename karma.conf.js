module.exports = function (config) {
  config.set({

    basePath: '',
    frameworks: ['jasmine'],

    files: [
      {pattern: 'spec/*Spec.js', included: false}
    ],

    exclude: [],

    preprocessors: {},

    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    concurrency: Infinity
  })
}
