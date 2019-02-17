'use strict'

let Client = require('request-promise')
const Logger = require('../../infr/logger')

let PostSignIn = require('./requests/postSignIn')

let prefix = 'staging'
let baseURL = `https://${prefix}.perchwell.com/`

class ApiClient {

  constructor (user) {
    this._user = user
  }

  async executeRequest (request, silent = false) {
    request.headers === undefined ? request.headers = {'Content-Type': 'application/json'} : ''
    request.headers['Authorization'] = this.authentication_token
    switch (request.method) {
      case 'get': {
        let options = {
          method: request.method,
          headers: request.headers,
          body: request.data,
          json: true,
          url: baseURL + request.resource
        }
        return await this.execute(request, options, silent)
      }

      default: {
        let options = {
          method: request.method,
          headers: request.headers,
          url: baseURL + request.resource
        }
        if (options.headers['Content-Type'].includes('multipart/form-data')) {
          options.formData = request.data
        }
        if (options.headers['Content-Type'].includes('application/x-www-form-urlencoded')) {
          options.form = request.data
        } else {
          options.body = request.data
          options.json = true
        }
        return await this.execute(request, options, silent)
      }
    }
  }

  async execute (request, options, silent) {
    if (!silent) {
      Logger.SaveRequest(request)
    }
    return await Client(options).then(async (body) => {
      if (!silent) {
        Logger.SaveResponse(body)
      }
      return await body
    }).catch(async (err) => {
      Logger.Error(`Error. Response:`, err)
    })
  }

  async authenticate (silent = false) {
    let it = this
    let request = PostSignIn.GetPostSignInRequest(this._user)
    request.headers = {'Content-Type': 'application/json', 'User-Agent': 'Perch/Android', 'Accept': 'application/json'}
    let options = {
      method: request.method,
      headers: request.headers,
      body: request.data,
      url: baseURL + request.resource,
      json: true
    }
    if (!silent) {
      Logger.Debug('Authenticating')
      Logger.SaveRequest(request)
    }
    await Client(options).then(async (body) => {
      it.authentication_token = body.authentication_token
      if (!silent) {
        await Logger.Debug(`Got token: ${it.authentication_token}`)
      }
    }).catch(async (err) => {
      Logger.Error(`Authentication failed. Response:`, err)
    })
  }

  sleep (ms) {
    Logger.Debug(`Sleeping for ${ms} ms`)
    return new Promise(resolve => setTimeout(resolve, ms))
  }

}

module.exports = ApiClient