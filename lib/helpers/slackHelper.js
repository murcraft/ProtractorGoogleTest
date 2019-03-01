'use strict'

const keyVars = require('../../keyVariables.js')
const Slack = require('slack-node')
let LoggerHelper = require('./loggerHelper')

const webhookUri = keyVars.slackWebHook
const slackChannel = keyVars.slackChannel
const isPostToSlack = keyVars.isPostToSlack === undefined ? 'false' : keyVars.isPostToSlack
const username = keyVars.slackUsername

let slack = new Slack()
slack.setWebhook(webhookUri)

class SlackHelper {

  static PostToSlack (message) {
    if (isPostToSlack === 'true') {
      slack.webhook({
        channel: slackChannel,
        username: username,
        icon_emoji: ':ghost:',
        text: message
      }, function (err) {
        if (err !== null) {
          LoggerHelper.debug(err)
        }
      })
    }
  }

  static PostToSlackUrl (message, fileName, link) {
    if (isPostToSlack === 'true') {
      LoggerHelper.debug(`Post file link into Slack ${fileName}`)
      slack.webhook({
        channel: slackChannel,
        username: username,
        icon_emoji: ':ghost:',
        text: message,
        attachments: [
          {
            title: fileName,
            color: 'good',
            actions: [
              {
                type: 'button',
                text: 'Download file',
                url: link,
                style: 'primary'
              }
            ]
          }],
      }, function (err) {
        if (err !== null) {
          LoggerHelper.debug(err)
        }
      })
    }
  }

  static PostS3ErrorsToSlack (suite, file, error) {
    if (isPostToSlack === 'true') {
      slack.webhook({
        channel: slackChannel,
        username: username,
        icon_emoji: ':ghost:',
        text: `*${suite}*\n${file}`,
        attachments: [
          {
            title: `Error: ${error}`,
            color: 'danger',
          }],
      }, function (err) {
        if (err !== null) {
          LoggerHelper.debug(err)
        }
      })
    }
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

module.exports = SlackHelper