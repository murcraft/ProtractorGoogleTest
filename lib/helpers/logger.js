'use strict'

const log4js = require('log4js')
const Logger = log4js.getLogger('Google')
const logLevel = process.env.logLevel === 'debug' ? 'debug' : 'info'

let Slack = require('slack-node')

let slack = new Slack()
slack.setWebhook(browser.params.webhookUri)

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

  static PostToSlackApi (message, file) {
    if (isPostToSlack === 'true') {
      slack.webhook({
        channel: slackChannel,
        username: 'Perchwell ghost',
        icon_emoji: ':ghost:',
        text: message
      }, function (err) {
        if (err !== null) {
          LoggerHelper.debug(err)
        }
      })
      let apiToken = ''
      let slackApi = new Slack(apiToken)
      slackApi.api('files.upload')
    }
  }

}

module.exports = LoggerBase