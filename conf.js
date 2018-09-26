exports.config = {
  directConnect: true,

  suites: {
    googlePage: 'spec/pageObjectSpec.js'
  },

  framework: 'jasmine',

  multiCapabilities: [{
    browserName: 'firefox',
  },
  {
    browserName: 'chrome',
  }],

  onPrepare: () => {
    browser.waitForAngularEnabled(false)
  },

  jasmineNodeOpts: {
    showColors: true,
    displaySpecDuration: true,
    defaultTimeoutInterval: 30000
  }
}