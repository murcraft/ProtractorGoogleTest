'use strict'

const log4js = require('log4js')
const Logger = log4js.getLogger('Google')
const keyVars = require('../../keyVariables.js')
let Slack = require('slack-node')

const logLevel = process.env.logLevel === 'debug' ? 'debug' : 'info'
const isPostToSlack = false

let channel = keyVars.slackChannel
let slackUser = keyVars.slackUsername

let slack = new Slack()
slack.setWebhook(keyVars.slackWebHook)

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
        channel: channel,
        username: slackUser,
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