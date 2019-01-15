const AllureReporter = require('jasmine-allure-reporter')

exports.config = {

  allScriptsTimeout: 11000,
  SELENIUM_PROMISE_MANAGER: false,
  framework: 'jasmine2',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 240000,
  },

  params: {
    waitTimeout: 60000,
    webhookUri: 'https://hooks.slack.com/services/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',
    slackChannel: '#slacktest'
  },

  specs: [
    'lib/spec/**/*.js',
  ],

  suites: {
    all: 'lib/spec/**/*.js',
    suite1: 'lib/spec/suite1/pageObjectSpec.js',
    suite2: 'lib/spec/suite2/pageObjectSpec.js',
    sendFiles: 'lib/spec/suite2/sendFiles.js'
  },

  baseUrl: process.env.env = 'http://www.google.by',

  capabilities: {
    browserName: 'chrome',
    shardTestFiles: process.env.maxinstances > 1,
    maxInstances: process.env.maxinstances,
    chromeOptions: {
      args: [
        'incognito',
        'window-size=1920,1080',
        '--disable-infobars',
        '--disable-extensions',
        '--ignore-ssl-errors=true',
        'verbose',
        '--disable-web-security'
      ],
    },
    prefs: {
      download: {
        prompt_for_download: false,
        directory_upgrade: true,
      },
    },
    loggingPrefs: {
      'browser': 'SEVERE',
    },
  },

  beforeLaunch: function () {
  },

  onPrepare: async () => {
    browser.waitForAngularEnabled(false)
    global.EC = protractor.ExpectedConditions
    global.Logger = require('./lib/helpers/logger')

    jasmine.getEnv().addReporter(new AllureReporter({
      resultDir: 'allure-results',
    }))

    jasmine.getEnv().addReporter(new function () {
      this.jasmineStarted = function (summary) {
        global.TOTAL = summary.totalSpecsDefined
        global.PASSED = 0
        global.FAILED = 0
        global.SKIPPED = 0
        Logger.info(
          `!----------Tests started. Total tests: ${TOTAL}----------!`)
      }
      this.suiteStarted = function (result) {
        Logger.info(`--------------------------------------------------`)
        Logger.info(`Suite starts: ${result.fullName}`)
        Logger.info(`--------------------------------------------------`)
      }
      this.specStarted = function (result) {
        Logger.info(`Spec starts: ${result.description}`)
      }
      this.specDone = function (result) {
        if (result.status === 'passed') {
          PASSED++
        }
        if (result.status === 'disabled' || result.status === 'pending') {
          SKIPPED++
        }
      }
      this.jasmineDone = function () {
        Logger.info(`**************************************************`)
        Logger.info(`${PASSED + FAILED + SKIPPED} of ${TOTAL} tests done`)
        Logger.info(`Passed: ${PASSED}`)
        Logger.info(`Failed: ${FAILED}`)
        Logger.info(`Skipped: ${SKIPPED}`)
        Logger.info(`**************************************************`)
      }
    })

    jasmine.getEnv().afterEach(async function () {
      await Logger.LogConsoleErrors()
      try {
        await browser.takeScreenshot().then(function (png) {
          allure.createAttachment('Screenshot', function () {
            return new Buffer(png, 'base64')
          }, 'image/png')()
        })
      } catch (e) {
        Logger.error(`Screen shot was not taken\n${e}`)
      }
    })

    await browser.get('')

  },

  afterLaunch: async function () {
    if (process.env.suite === 'sendFiles') {
      await require('./lib/helpers/logger').PostToSlackApi(`*:arrow_down: Link to '${process.env.suite}' PDFs: https://s3.amazonaws.com/perchwell-artifacts/${process.env.TRAVIS_BUILD_NUMBER}/${process.env.TRAVIS_JOB_NUMBER}`)
    }
    await new Promise(resolve => setTimeout(resolve, 5000))
  }
}