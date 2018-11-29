'use strict'

const log4js = require('log4js')

const Logger = log4js.getLogger('Google')
const logLevel = process.env.logLevel

log4js.configure({
  appenders: {
    out: {type: 'stdout'}
  },
  categories: {
    default: {appenders: ['out'], level: logLevel}
  }
})

class LoggerBase {

  static info (message) {
    Logger.info(message)
  }

  static debug (message) {
    Logger.debug(message)
  }

  static error (message) {
    Logger.error(message)
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

module.exports = LoggerBase