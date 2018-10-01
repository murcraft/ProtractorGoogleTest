let Jasmine2HtmlReporter = require('protractor-jasmine2-html-reporter')

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

    return new Promise(function (fulfill, reject) {
      browser.getCapabilities().then(function (value) {
        reportName = value.get('browserName') + '_' + Math.floor(Math.random() * 1E16)
        jasmine.getEnv().addReporter(
          new Jasmine2HtmlReporter({
            savePath: __dirname + '/reports',
            docTitle: 'Web UI Test Report',
            screenshotsFolder: '/image',
            takeScreenshotsOnlyOnFailures: true,
            consolidate: true,
            consolidateAll: true,
            preserveDirectory: true,
            fileName: 'my-report.html',
            fileNamePrefix: reportName
          })
        )
        fulfill()
      })
    })

  },

  jasmineNodeOpts: {
    showColors: true,
    displaySpecDuration: true,
    defaultTimeoutInterval: 50000
  }
}