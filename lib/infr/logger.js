'use strict'

const log4js = require('log4js')
const keyVars = require('../../keyVariables.js')

const Logger = log4js.getLogger('API')
const logLevel = keyVars.logLevel
const baseUrl = `https://staging.perchwell.com/`

log4js.configure({
  appenders: {
    out: {type: 'stdout', layout: {type: 'colored'}}
  },
  categories: {
    default: {appenders: ['out'], level: logLevel}
  }
})

class LoggerInfr {

  static Info (message, json) {
    if (json !== undefined) {
      let str = this.Stringify(json)
      message = `${message}\n${str}`
    }
    Logger.info(message)
  }

  static Debug (message, json) {
    if (json !== undefined) {
      let str = this.Stringify(json)
      message = `${message}\n${str}`
    }
    Logger.debug(message)
  }

  static Warn (message, json) {
    if (json !== undefined) {
      let str = this.Stringify(json)
      message = `${message}\n${str}`
    }
    Logger.warn(message)
  }

  static Error (message, json) {
    if (json !== undefined) {
      let str = this.Stringify(json)
      message = `${message}\n${str}`
    }
    Logger.error(message)
  }

  static Stringify (json) {
    return JSON.stringify(json, null, '    ')
  }

  static SaveRequest (request) {
    LoggerInfr.Debug(`Sent Request:\nUri: ${baseUrl}\nResource: ${request.resource}\nMethod: ${request.method}\nHeaders: ${this.Stringify(request.headers)}\nBody:`, request.data)
  }

  static SaveResponse (response) {
    LoggerInfr.Debug(`Got Response:`, response)
  }
}

module.exports = LoggerInfr