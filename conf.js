exports.config = {
  directConnect: true,
  suites: {
    googlePage: 'spec/pageObjectSpec.js'
  },

  framework: 'jasmine',
  splitTestsBetweenCapabilities: true,

  multiCapabilities: [{
    browserName: 'firefox',
    shardTestFiles: true,
    maxInstances: 1,
    'moz:firefoxOptions': {
      args: ['--headless']
    }
  },
    {
      browserName: 'chrome',
      shardTestFiles: true,
      maxInstances: 1,
      chromeOptions: {
        args: [
          '--disable-infobars',
          '--disable-extensions',
          '--ignore-ssl-errors=true',
          'verbose'
        ]
      },
      prefs: {
        'profile.password_manager_enabled': false,
        'credentials_enable_service': false,
        'password_manager_enabled': false
      }
    }
    ],

  onPrepare: () => {
    browser.manage().window().setSize(1024, 800)
    browser.waitForAngularEnabled(false)
  },

  jasmineNodeOpts: {
    showColors: true,
    displaySpecDuration: true,
    defaultTimeoutInterval: 50000
  }
}