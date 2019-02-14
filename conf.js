const AllureReporter = require('jasmine-allure-reporter')
const DescribeFailureReporter = require('protractor-stop-describe-on-failure')
let path = require('path')

bufferFrom = require('buffer-from')

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
    legoUrl: `https://www.lego.com/en-us`,
    downloadPath: path.resolve(__dirname, './downloads/downloaded'),

    page: {
      startPage: `https://google.com/`,
    },

    s3: {
      bucket: `helen-backet`,
      accessKeyId: `AKIAJFZOKOZIY3BTYBGA`,
      secretAccessKey: `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`
    }
  },

  specs: [
    'lib/spec/**/*.js',
  ],

  suites: {
    all: 'lib/spec/**/*.js',
    suite1: 'lib/spec/suite1/pageObjectSpec.js',
    suite2: 'lib/spec/suite2/pageObjectSpec.js',
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

    jasmine.getEnv().addReporter(DescribeFailureReporter(jasmine.getEnv()))

    jasmine.getEnv().afterEach(async function () {
      await Logger.LogConsoleErrors()
      try {
        await browser.takeScreenshot().then(function (png) {
          allure.createAttachment('Screenshot', function () {
            return Buffer.from(png, 'base64')
          }, 'image/png')()
        })
      } catch (e) {
        Logger.error(`Screen shot was not taken\n${e}`)
      }
    })

    await browser.get('')

  },

  afterLaunch: async function () {
    await new Promise(resolve => setTimeout(resolve, 5000))
  }
}

