let path = require('path')
let fs = require('fs')

const AllureReporter = require('jasmine-allure-reporter')
const DescribeFailureReporter = require('protractor-stop-describe-on-failure')
const keyVars = require('./keyVariables.js')

let downloads = keyVars.downloadPath

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
    downloadPath: downloads,
    userCreds: { email: keyVars.userEmail, pass: keyVars.userPass},

    page: {
      startPage: `https://google.com/`,
    },
  },

  specs: [
    'lib/spec/**/*.js',
  ],

  suites: {
    all: 'lib/spec/**/*.js',
    suite1: 'lib/spec/suite1/pageObjectSpec.js',
    suite2: 'lib/spec/suite2/pageObjectSpec.js',

    _suiteUpTo20000: 'lib/spec/suiteUpTo20000/*.js',
    _suiteUpTo40000: 'lib/spec/suiteUpTo40000/*.js',
    _suiteUpTo60000: 'lib/spec/suiteUpTo60000/*.js',
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
        // '--disable-infobars',
        // '--disable-extensions',
        // '--ignore-ssl-errors=true',
        // 'verbose',
        // '--disable-web-security'
      ],
    },
    prefs: {
      download: {
        prompt_for_download: false,
        directory_upgrade: true,
        default_directory: downloads,
      },
    },
    loggingPrefs: {
      'browser': 'SEVERE',
    },
  },

  beforeLaunch: function () {
    let logger = require('./lib/helpers/loggerHelper')

    if (process.env.isCleanAllure === 'true') {
      let allurePath = 'allure-results'
      if (fs.existsSync(allurePath)) {
        fs.readdirSync(allurePath).forEach((file) => {
          let currentPath = path.resolve(allurePath, file)
          fs.unlinkSync(currentPath)
        })
      }
    }
    if (fs.existsSync(downloads)) {
      logger.debug(`Clearing 'Downloads'`)
      fs.readdirSync(downloads).forEach((file) => {
        let curPath = path.resolve(downloads, file)
        fs.unlinkSync(curPath)
        logger.debug(`Deleted file: ${curPath}`)
      })
    }
  },

  onPrepare: async () => {
    browser.waitForAngularEnabled(false)
    global.EC = protractor.ExpectedConditions
    global.Logger = require('./lib/helpers/loggerHelper')

    jasmine.getEnv().addReporter(new AllureReporter({
      resultDir: 'allure-results',
    }))

    jasmine.getEnv().addReporter(new function () {
      this.jasmineStarted = function (summary) {
        global.TOTAL = summary.totalSpecsDefined
        global.PASSED = 0
        global.FAILED = 0
        global.SKIPPED = 0
        Logger.info(`>>>>>>>>>>Tests started. Total tests: ${TOTAL}<<<<<<<<<<`)
      }
      this.suiteStarted = function (result) {
        Logger.info(`**************************************************`)
        Logger.info(`Suite started: ${result.fullName}`)
        Logger.info(`**************************************************`)
        global.SuiteDescribe = result.fullName
      }
      this.specStarted = function (result) {
        Logger.info(`Spec started: ${result.description}`)
      }
      this.specDone = function (result) {
        if (result.status === 'failed') {
          FAILED++
          Logger.failed(result)
        }
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

    if ((process.env.suite !== '_suiteUpTo20000') && (process.env.suite !== '_suiteUpTo40000') && (process.env.suite !== '_suiteUpTo60000')) {
      jasmine.getEnv().addReporter(DescribeFailureReporter(jasmine.getEnv()))
    }

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
  },
}

