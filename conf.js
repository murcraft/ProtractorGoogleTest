exports.config = {
  directConnect: true,

  // specs: ['spec/*Spec.js'],

  suites: {
    googlePage: 'spec/pageObjectSpec.js'
  },

  framework: 'jasmine',
  splitTestsBetweenCapabilities: true,
  multiCapabilities: [{
    browserName: 'firefox',
    maxInstances: 1
  },
    {
      browserName: 'chrome',
      shardTestFiles: true,
      maxInstances: 1,
      chromeOptions: {
        args: [
          '--disable-infobars',
          '--disable-extensions',
          'verbose',
        ],
        prefs: {
          'profile.password_manager_enabled': false,
          'credentials_enable_service': false,
          'password_manager_enabled': false
        }
      }
    }],

  jasmineNodeOpts: {
    showColors: true,
    displaySpecDuration: true,
    defaultTimeoutInterval: 30000
  }
}