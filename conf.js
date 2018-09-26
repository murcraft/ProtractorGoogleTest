let Jasmine2HtmlReporter = require('protractor-jasmine2-html-reporter')
let today = new Date()
let timeStamp = today.getMonth() + 1 + '-' + today.getDate() + '-' + today.getFullYear() + '-' +
  today.getHours() + 'h-' + today.getMinutes() + 'm-' + today.getSeconds() + 's'

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
        ]
      },
      prefs: {
        'profile.password_manager_enabled': false,
        'credentials_enable_service': false,
        'password_manager_enabled': false
      }
    }],

  onPrepare: () => {
    browser.manage().window().setSize(1024, 800)
    browser.waitForAngularEnabled(false)
    jasmine.getEnv().addReporter(
      new Jasmine2HtmlReporter({
        savePath: 'reports/' + timeStamp,
        consolidate: true,
        consolidateAll: true,
        takeScreenshot: true,
        screenshotsFolder: 'screenshots',
        takeScreenshotsOnlyOnFailures: true
      })
    );
  },

  jasmineNodeOpts: {
    showColors: true,
    displaySpecDuration: true,
    defaultTimeoutInterval: 30000
  }
}