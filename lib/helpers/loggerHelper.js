'use strict'

const testAttempt = require('../../parser').getTestAttempt()
const keyVars = require('../../keyVariables')
const log4js = require('log4js')
const SlackHelper = require('./slackHelper')

const Logger = log4js.getLogger('Search')

const isPostToSlack = keyVars.isPostToSlack === undefined ? 'false' : keyVars.isPostToSlack
const logLevel = keyVars.logLevel === undefined ? 'info' : keyVars.logLevel

log4js.configure({
  appenders: {
    out: {type: 'stdout'}
  },
  categories: {
    default: {appenders: ['out'], level: logLevel}
  }
})

class LoggerHelper {

  static info (message) {
    Logger.info(message)
  }

  static debug (message) {
    Logger.debug(message)
  }

  static warn (message) {
    Logger.warn(message)
  }

  static error (message) {
    Logger.error(message)
  }

  static failed (result) {
    let fName = result.fullName
    let failures = Object.assign([], result.failedExpectations)
    failures.forEach(failure => {
        delete failure.matcherName
        delete failure.stack
        delete failure.passed
        delete failure.expected
        delete failure.actual
      }
    )
    let fExpStr = JSON.stringify(result.failedExpectations, null, '    ')
    let fExpStrSlack = result.failedExpectations.reduce((prev, current) => {
      prev += JSON.stringify(current, null, '    ') + '\n'
      return prev
    }, '')
    let consoleMessage = `Failed: ${fName}\n ${fExpStr}`
    let slackMessage = `\`Failed: ${fName}\`\n \`\`\`${fExpStrSlack}\`\`\``
    LoggerHelper.error(consoleMessage)

    LoggerHelper.debug(`Test attempt is ${testAttempt}`)
    LoggerHelper.debug(`maxAttempts is ${process.env.maxAttempts}`)
    if (isPostToSlack === 'true'){// && parseInt(testAttempt) === parseInt(process.env.maxAttempts)) {
      LoggerHelper.debug(`Posting error into Slack`)
      SlackHelper.PostToSlack(slackMessage)
    }
  }

  static Stringify (json) {
    return JSON.stringify(json, null, '    ')
  }

  static SaveRequest (uri, data) {
    let message
    if (data !== undefined) {
      let str = LoggerHelper.Stringify(data)
      message = `Sent Request:\nUri: ${uri}\nBody:\n${str}`
    }
    LoggerHelper.debug(message)
  }

  static SaveResponse (data) {
    let message
    if (data !== undefined) {
      let str = LoggerHelper.Stringify(data)
      message = `Got Response:\n${str}`
    }
    LoggerHelper.debug(message)
  }

  static async LogConsoleErrors () {
    let browserLogs = await this.GetConsoleErrors()
    if (browserLogs.length > 0) {
      Logger.warn(`Browser logs:\n${require('util').inspect(browserLogs)}`)
    }
  }

  static async GetConsoleErrors () {
    return await browser.manage().logs().get('browser')
  }

}

module.exports = LoggerHelper