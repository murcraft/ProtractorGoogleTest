'use strict'

const LoggerInfra = require('../infr/logger')

let AppApiClient = require('./api/apiClient')
let GetBuildingInSearch = require('./api/requests/getGetBuildingsInSearch')
let PostBuildingsTypeahead = require('./api/requests/postBuildingsInTypeahead')

class BuildingsSearchHelper {

  static async GetBuildingsAndIdArr (user) {
    let appApiClient = new AppApiClient(user)
    await appApiClient.authenticate(true)

    let request = GetBuildingInSearch.GetGetBuildingsInSearch()
    let response = await appApiClient.executeRequest(request, true)

    await LoggerInfra.Debug(
      `Getting ${response.length} buildings for user '${user.email}'`)
    return response
  }

  static async GetBuildingsInfoForAddress (user, buildingArr, counter) {
    let buildingAddress = buildingArr[0].trim()
    let buildingId = buildingArr[1]
    await LoggerInfra.Debug(
      `${counter}: - Getting response in Building typeahead for '${buildingAddress}', id is '${buildingId}'`)

    let appApiClient = new AppApiClient(user)
    await appApiClient.authenticate(true)
    let request = PostBuildingsTypeahead.GetPostBuildingsTypeahead(
      buildingAddress)

    if (request === undefined) {
      await LoggerInfra.Debug(`Getting 2th attempt to authenticate`)
      let appApiClient = new AppApiClient(user)
      await appApiClient.authenticate(true)
      request = PostBuildingsTypeahead.GetPostBuildingsTypeahead(
        buildingAddress)
    }
    try {
      if (request === undefined) {
        return await LoggerInfra.Error('Authenticate with error')
      }
    } catch (e) {
      Logger.error(e)
      throw new Error(e)
    }

    return await appApiClient.executeRequest(request, true)
  }

}

module.exports = BuildingsSearchHelper