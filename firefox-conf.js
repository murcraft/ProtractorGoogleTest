let path = require('path')
let fs = require('fs')
const shell = require('shelljs')
const os = require('os')
const child_process = require('child_process')

const AllureReporter = require('jasmine-allure-reporter')
const DescribeFailureReporter = require('protractor-stop-describe-on-failure')
const keyVars = require('./keyVariables.js')

let downloads = keyVars.downloadPath
let browserName = process.env.browser


exports.config = {

  seleniumAddress: 'http://127.0.0.1:4444/wd/hub',

  // seleniumServerJar: './lib/drivers/selenium-server-standalone-3.14.0.jar',
  // seleniumServerStartTimeout: 60000,
  // localSeleniumStandaloneOpts:
  //   {
  //     port: 4440,
  //   },
  // geckoDriver: './lib/drivers/geckodriver-v0.24.0.exe',

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

    page: {
      startPage: `https://google.com/`,
    },
  },

  specs: [
    'lib/spec/**/*.js',
  ],

  suites: {
    all: 'lib/spec/**/*.js',
    suite1: ['lib/spec/suite1/*.js'],
    suite2: 'lib/spec/suite2/*.js',
    pdf: 'lib/spec/pdf/*.js',
  },

  baseUrl: process.env.env === 'DEV' ? 'https://dev.perchwell.com/' : 'https://staging.perchwell.com/',

  capabilities:
    {
      browserName: 'firefox',
      shardTestFiles: process.env.maxinstances > 1,
      maxInstances: process.env.maxinstances,
      acceptSslCerts: true,
      // verboseMultiSession: true,

      'moz:firefoxOptions': {
        args: [
          '--width=1920',
          '--height=1080',
          '-private'
        ],
        prefs: {
          'browser.download.folderList': 2,
          'browser.download.dir': downloads,
          'pref.downloads.disable_button.edit_actions': true,
          'services.sync.prefs.sync.browser.download.useDownloadDir': true,
          'browser.download.useDownloadDir': true,
          'browser.download.manager.alertOnEXEOpen': false,
          'browser.download.manager.closeWhenDone': true,
          'browser.download.manager.focusWhenStarting': false,
          'browser.download.manager.showWhenStarting': false,
          'browser.helperApps.alwaysAsk.force': false,
          'browser.download.manager.showAlertOnComplete': false,
          'browser.download.manager.useWindow': false,
          'browser.download.panel.removeFinishedDownloads': true,
          'browser.download.useToolkitUI': false,
          'browser.helperApps.neverAsk.saveToDisk': 'application/pdf',
          'pdfjs.disabled': true,
          'plugin.disable_full_page_plugin_for_types': 'application/pdf',
          'app.update.enabled': false,
          'app.update.auto': false,
          'app.update.silent': false,
          'extensions.update.enabled': false,
          'security.sandbox.content.level': 4,
          'extensions.logging.enabled': true,
          'browser.tabs.remote.autostart': false,
        },
      },
      log: {
        level: 'trace'
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
      logger.debug(`Clearing 'Downloads ${downloads}`)
      fs.readdirSync(downloads).forEach((file) => {
        let curPath = path.resolve(downloads, file)
        fs.unlinkSync(curPath)
        logger.debug(`Deleted file: ${curPath}`)
      })
    }

    if (os.type() === 'Linux') {
      try {
        console.log(`Killing all ${browserName} processes:\n ${child_process.execSync(`killall ${browserName}`)}`)
      } catch (e) {
        console.log(`Error executing the command\n${e}`)
      }
    }

    if (browserName === 'firefox') {
      try {
        console.log(`Killing all ${browserName} driver processes:\n ${child_process.execSync(`killall geckodriver-v0.24.0`)}`)
      } catch (e) {
        console.log(`Error executing the command\n${e}`)
      }
    }
  },

  onPrepare: async () => {
    browser.manage().window().maximize()
    browser.waitForAngularEnabled(false)
    global.EC = protractor.ExpectedConditions
    global.Logger = require('./lib/helpers/loggerHelper')
    global.BrowserName = browserName

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
          try {
            console.log(`Get all ${browserName} processes:\n ${child_process.execSync(`ps -A | grep firefox`)}`)
          } catch (e) {
            console.log(`Error executing the command\n${e}`)
          }
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

    if ((process.env.suite !== 'suite3')) {
      jasmine.getEnv().addReporter(DescribeFailureReporter(jasmine.getEnv()))
    }

    jasmine.getEnv().afterEach(async function () {
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
    let version = shell.exec('ps -A | grep firefox', {silent:true}).stdout
    console.log(version)
    let version1 = shell.exec('ps -A | grep geckodriver', {silent:true}).stdout
    console.log(version1)
    await new Promise(resolve => setTimeout(resolve, 5000))
  },
}

