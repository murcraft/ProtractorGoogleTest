let path = require('path')
let fs = require('fs')
const FirefoxProfile = require('firefox-profile')

const AllureReporter = require('jasmine-allure-reporter')
const DescribeFailureReporter = require('protractor-stop-describe-on-failure')
const keyVars = require('./keyVariables.js')

let downloads = keyVars.downloadPath

let myProfile = new FirefoxProfile()
myProfile.setPreference('browser.download.folderList', 2)
myProfile.setPreference('browser.download.dir', downloads)
myProfile.setPreference('browser.helperApps.alwaysAsk.force', false)
myProfile.setPreference('browser.download.downloadDir', downloads)
myProfile.setPreference('browser.download.defaultFolder', downloads)

exports.config = {

  allScriptsTimeout: 110000000,
  SELENIUM_PROMISE_MANAGER: false,
  framework: 'jasmine2',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 240000000,
  },

  params: {
    waitTimeout: 60000,
    legoUrl: `https://www.lego.com/en-us`,
    downloadPath: downloads,

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
  },

  baseUrl: process.env.env = 'http://www.google.by',
  geckoDriver: './node_modules/protractor/node_modules/webdriver-manager/selenium/geckodriver',
  capabilities:
    {
      browserName: 'firefox',
      // binary: './lib/drivers',
      shardTestFiles: process.env.maxinstances > 1,
      maxInstances: process.env.maxinstances,
      marionette: true,
      acceptSslCerts: true,
      alwaysMatch: {
        firefoxOptions: {
          args: ['-headless'],
          profile: myProfile,
          log: {
            level: 'trace'
          }
        }
      }
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
    browser.manage().window().maximize();
    browser.manage().timeouts().implicitlyWait(5000);
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

    if ((process.env.suite !== 'suite3') && (process.env.suite !== 'suite4') &&
      (process.env.suite !== 'suite5') && (process.env.suite !== 'suite6') &&
      (process.env.suite !== 'suite7') && (process.env.suite !== 'suite8') &&
      (process.env.suite !== 'suite9') && (process.env.suite !== 'suite10') &&
      (process.env.suite !== 'suite11') && (process.env.suite !== 'suite12') &&
      (process.env.suite !== 'suite13') && (process.env.suite !== 'suite14')) {
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

