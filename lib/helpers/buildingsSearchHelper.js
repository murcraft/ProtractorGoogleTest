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
    if (response !== undefined) {
      await LoggerInfra.Debug(`Getting ${response.length} buildings for user '${user.email}'`)
    }
    return response
  }

  static async GetBuildingsInfoForAddress (user, buildingArr, number) {
    let buildingAddress = buildingArr[0].trim()
    let buildingId = buildingArr[1]
    await LoggerInfra.Debug(`Index number ${number} Getting response in Building typeahead for '${buildingAddress}', id is '${buildingId}'`)

    let appApiClient = new AppApiClient(user)
    await appApiClient.authenticate(true)
    let request = PostBuildingsTypeahead.GetPostBuildingsTypeahead(buildingAddress)
    let response = await appApiClient.executeRequest(request, true)

    return response
  }

}

module.exports = BuildingsSearchHelper