'use strict'

const Client = require('node-rest-client').Client

class TravisApiClient {

  constructor () {
    this._client = new Client()
  }

  async getBuilds () {
    let it = this
    let args = {
      headers: {
        Authorization: 'token EYI-XJuCDRiHGJPRJXDMBQ',
        'Travis-API-Version': '3'
      }
    }
    let uri = `https://api.travis-ci.com/repo/RivingtonHoldings%2FQA/builds?limit=10&offset=1`
    Logger.SaveRequest(uri, args)
    return new Promise(function (resolve) {
      it._client.get(uri, args, function (data, response) {
        data.statusCode = response.statusCode
        data.statusMessage = response.statusMessage
        Logger.SaveResponse(data)
        resolve(data)
      })
    })
  }

  async cancelBuild (id) {
    let it = this
    let args = {
      headers: {
        Authorization: 'token EYI-XJuCDRiHGJPRJXDMBQ',
        'Travis-API-Version': '3'
      }
    }
    let uri = `https://api.travis-ci.com/build/${id}/cancel`
    Logger.SaveRequest(uri, args)
    return new Promise(function (resolve) {
      it._client.post(uri, args, function (data, response) {
        data.statusCode = response.statusCode
        data.statusMessage = response.statusMessage
        Logger.SaveResponse(data)
        resolve(data)
      })
    })
  }

  async triggerBuild () {
    let it = this
    let args = {
      data: {
        'request': {
          'branch': 'master',
          'message': 'This is a request to trigger tests'
        }
      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'token GxjetxJdg1ayaQMJlYZiQw',
        'Travis-API-Version': '3'
      }
    }
    let uri = `https://api.travis-ci.com/repo/RivingtonHoldings%2FQA/requests`
    Logger.SaveRequest(uri, args)
    return new Promise(function (resolve) {
      it._client.post(uri, args, function (data, response) {
        data.statusCode = response.statusCode
        data.statusMessage = response.statusMessage
        Logger.SaveResponse(data)
        resolve(data)
      })
    })
  }

}

module.exports = TravisApiClient