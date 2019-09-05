let path = require('path')
let fs = require('fs')
const shell = require('shelljs')
const os = require('os')
const child_process = require('child_process')

const AllureReporter = require('jasmine-allure-reporter')
const DescribeFailureReporter = require('protractor-stop-describe-on-failure')
const keyVars = require('./keyVariables.js')

const capabilitiesMap = require('./capabilitiesMap.js')
const browserName = process.env.browser
let downloads = keyVars.downloadPath

let config = {

  allScriptsTimeout: 110000,
  SELENIUM_PROMISE_MANAGER: false,
  framework: 'jasmine2',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 240000,
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

  baseUrl: process.env.env === 'DEV' ? 'https://dev.perchwell.com/' : 'https://staging.perchwell.com/',

  suites: {
    all: 'lib/spec/**/*.js',
    suite1: 'lib/spec/suite1/*.js',
    suite2: 'lib/spec/suite2/*.js',
    pdf: 'lib/spec/pdf/*.js',
  },

  // baseUrl: process.env.env = 'http://www.google.by',

  beforeLaunch: function () {
    // if (browserName === 'safari') {
    //   console.log('Connecting local')
    //   return new Promise((resolve, reject) => {
    //     exports.bs_local = new browserstack.Local()
    //     exports.bs_local.start({'key': keyVars.browserstackKey}, (error) => {
    //       if (error) return reject(error)
    //       console.log('Connected. Now testing...')
    //
    //       resolve()
    //     })
    //   })
    // }

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

    function ping () {
      logger.debug(`Waiting test's logs...`)
    }

    setInterval(ping, 300000)

    if (browserName === 'firefox' && os.type() === 'Linux') {
      try {
        console.log(`Killing all ${browserName} processes:\n ${child_process.execSync(`killall ${browserName}`)}`)
      } catch (e) {
        console.log(`Error executing the command\n${e}`)
      }
      try {
        console.log(`Killing all ${browserName} driver processes:\n ${child_process.execSync(`killall geckodriver-v0.24.0`)}`)
      } catch (e) {
        console.log(`Error executing the command\n${e}`)
      }
    }

    if (browserName === 'safari') {
      try {
        console.log(`Killing all ${browserName} processes:\n ${child_process.execSync(`killall safaridriver`)}`)
      } catch (e) {
        console.log(`Error executing the command\n${e}`)
      }
    }

    if (browserName === 'ie') {
      console.log(downloads)
      let cmdDownload = `REG ADD \"HKEY_CURRENT_USER\\Software\\Microsoft\\Internet Explorer\\Main\" /F /V \"Default Download Directory\" /T REG_SZ /D ${downloads}`
      try {
        console.log(`Set download path for ${browserName}:\n ${child_process.execSync(cmdDownload)}`)

      } catch (e) {
        console.log(`Error executing the command\n${e}`)
      }
      let cmdPopUp = `REG ADD \"HKEY_CURRENT_USER\\Software\\Microsoft\\Internet Explorer\\New Windows\" /F /V \"PopupMgr\" /T REG_SZ /D \"no\"`
      try {
        console.log(`Disable pop-up for ${browserName}:\n ${child_process.execSync(cmdPopUp)}`)

      } catch (e) {
        console.log(`Error executing the command\n${e}`)
      }
    }
  },

  onPrepare: async () => {
    browser.waitForAngularEnabled(false)
    global.EC = protractor.ExpectedConditions
    global.Logger = require('./lib/helpers/loggerHelper')
    global.BrowserName = browserName
    if (browserName === 'safari') {
      await browser.driver.manage().window().maximize()
    }

    jasmine.getEnv().addReporter(new AllureReporter({
      resultDir: 'allure-results',
    }))

    jasmine.getEnv().addReporter(new function () {
      this.jasmineStarted = (summary) => {
        global.TOTAL = summary.totalSpecsDefined
        global.PASSED = 0
        global.FAILED = 0
        global.SKIPPED = 0
        Logger.info(`>>>>>>>>>>Tests started. Total tests: ${TOTAL}<<<<<<<<<<`)
      }
      this.suiteStarted = (result) => {
        Logger.info(`**************************************************`)
        Logger.info(`Suite started: ${result.fullName}`)
        Logger.info(`**************************************************`)
        global.SuiteDescribe = result.fullName
        // let tm = Math.floor((Math.random() * 10000) + 10000)
        // child_process.execSync(`screencapture -t jpg ./artifacts/screen${tm + 1}.jpg`)
      }
      this.specStarted = (result) => {
        Logger.info(`Spec started: ${result.description}`)
      }
      this.specDone = (result) => {
        if (result.status === 'failed') {
          FAILED++
          Logger.failed(result)
          if (browserName === 'firefox' && os.type() === 'Linux') {
            try {
              console.log(`Get all ${browserName} processes:\n ${child_process.execSync(`ps -A | grep firefox`)}`)
            } catch (e) {
              console.log(`Error executing the command\n${e}`)
            }
            try {
              console.log(`Killing all ${browserName} processes:\n ${child_process.execSync(`killall ${browserName}`)}`)
            } catch (e) {
              console.log(`Error executing the command\n${e}`)
            }
          }
          if (browserName === 'safari') {
            try {
              console.log(`Processes all ${browserName} processes:\n ${child_process.execSync(`ps -all`)}`)
              console.log(`Killing all ${browserName} processes:\n ${child_process.execSync(`ps | grep ${browserName}`)}`)
            } catch (e) {
              console.log(`Error executing the command\n${e}`)
            }
          }
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

    jasmine.getEnv().addReporter(DescribeFailureReporter(jasmine.getEnv()))

    jasmine.getEnv().afterEach(async () => {
      if (browserName === 'chrome') {
        await Logger.LogConsoleErrors()
      }
      try {
        await browser.takeScreenshot().then((png) => {
          allure.createAttachment('Screenshot', () => {
            return Buffer.from(png, 'base64')
          }, 'image/png')()
        })
      } catch (e) {
        Logger.warn(`Screen shot was not taken\n${e}`)
      }
    })

    await browser.get('')
  },

  afterLaunch: async function () {
    if (browserName === 'firefox' && os.type() === 'Linux') {
      let version = shell.exec('ps -A | grep firefox', {silent: true}).stdout
      console.log(version)
      let version1 = shell.exec('ps -A | grep geckodriver', {silent: true}).stdout
      console.log(version1)
    }

    if (browserName === 'safari') {
      try {
        console.log(`Get all processes:\n ${child_process.execSync(`ps -all`)}`)
        console.log(`Get all crashes:\n ${child_process.execSync(`cp -av ~/Library/Logs/* ~/build/murcraft/ProtractorGoogleTest/artifacts/`)}`)
      } catch (e) {
        console.log(`Error executing the command`)
      }
    }

    // if (browserName !== 'safari') {
    return new Promise(resolve => setTimeout(resolve, 5000))
      .catch(error => {
        console.log(error)
      })
    // } else {
    //   return new Promise((resolve, reject) => {
    //     exports.bs_local.stop(resolve)
    //       .catch(error => {
    //         console.log(error)
    //         reject(error)
    //       })
    //   })
    // }
  },
}

config.capabilities = capabilitiesMap[browserName]

if (browserName === 'firefox') {
  // config.seleniumAddress = 'http://127.0.0.1:4444/wd/hub'
  config.exclude = ['lib/spec/pdf/savePdf*.js']

  config.seleniumServerJar = './lib/drivers/selenium-server-standalone-3.14.0.jar'//'node_modules/protractor/node_modules/webdriver-manager/selenium/selenium-server-standalone-3.14.0.jar'
  config.localSeleniumStandaloneOpts = {
    port: 4444,
    seleniumArgs: ['-browserTimeout=60'],
    args: [
      '-role', 'node',
      '-log', 'selenium_server_logs.log',
      '-debug',
      '-timeout=20000',
      '-browserTimeout=60',
    ],
    jvmArgs: [
      '-Dwebdriver.geckodriver.driver=geckodriver-v0.24.0.exe',
    ]
  }
  config.geckoDriver = './lib/drivers/geckodriver-v0.24.0.exe'
  config.logLevel = 'DEBUG'

}
if (browserName === 'safari') {
  config.logLevel = 'DEBUG'
}

if (browserName === 'ie') {
  config.seleniumAddress = 'http://127.0.0.1:4444/wd/hub'
  // config.seleniumServerJar = './lib/drivers/selenium-server-standalone-3.14.0.jar'//'node_modules/protractor/node_modules/webdriver-manager/selenium/selenium-server-standalone-3.14.0.jar'
  config.localSeleniumStandaloneOpts = {
    // port: 4444,
    // seleniumArgs: ['-browserTimeout=60'],
    // args: [
    //   '-role', 'node',
    //   '-log', 'selenium_server_logs.log',
    //   '-debug',
    //   '-timeout=20000',
    //   '-browserTimeout=60',
    // ],
    jvmArgs: [
      '-Dwebdriver.ie.driver=node_modules/protractor/node_modules/webdriver-manager/selenium/IEDriverServer3.14.0.exe'
    ]
  }
  config.logLevel = 'DEBUG'

}

exports.config = config

//node conf-flake.js -- browser=firefox