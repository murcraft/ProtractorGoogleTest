let Jasmine2HtmlReporter = require('protractor-jasmine2-html-reporter')

exports.config = {

  allScriptsTimeout: 11000,
  SELENIUM_PROMISE_MANAGER: false,
  framework: 'jasmine2',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 240000
  },

  params: {
    waitTimeout: 60000
  },

  suites: {
    googlePage: 'spec/pageObjectSpec.js'
  },

  multiCapabilities: [{
      ignoreProtectedModeSettings: true,
      browserName: 'chrome',
      shardTestFiles: true,
      maxInstances: 1,
      chromeOptions: {
        args: [
          'incognito',
          'window-size=1024,800',
          '--disable-infobars',
          '--disable-extensions',
          '--ignore-ssl-errors=true',
          'verbose'
        ]
      },
      prefs: {
        download: {
          prompt_for_download: false,
          directory_upgrade: true,
          default_directory: pathDownloads
        }
      }
    }
  ],

  onPrepare: () => {

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

  }
}