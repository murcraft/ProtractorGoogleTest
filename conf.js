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
    shardTestFiles: true,
    chromeOptions: {
      args: [
        '--disable-infobars',
        '--disable-extensions',
        'verbose'
      ]},
      prefs: {
        'profile.password_manager_enabled': false,
        'credentials_enable_service': false,
        'password_manager_enabled': false
      }
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