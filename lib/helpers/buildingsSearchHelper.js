'use strict'

let RandomHelper = require('./randomHelper')
const LoggerInfra = require('../infr/logger')
let BasePage = require('../page/basePage')

let AppApiClient = require('./api/apiClient')
let GetBuildingInSearch = require('./api/requests/getGetBuildingsInSearch')
let PostBuildingsTypeahead = require('./api/requests/postBuildingsInTypeahead')

let randomText = RandomHelper.GetRandomString('log')
// let typeaheadFileName = `${SuiteDescribe}_${randomText}.txt`
let searchBuildingsFileName = `buildingsArray_${randomText}.txt`

class BuildingsSearchHelper {

  static async GetBuildingsAndIdArr (user) {
    let appApiClient = new AppApiClient(user)
    await appApiClient.authenticate(true)

    let request = GetBuildingInSearch.GetGetBuildingsInSearch()
    let response = await appApiClient.executeRequest(request, true)
    let currentTime = ''
    if (response !== undefined) {
      await LoggerInfra.Debug(`Getting ${response.length} buildings for user '${user.email}'`)
      await LoggerInfra.Debug(`Waiting for file ${searchBuildingsFileName} to be writing...`)
      let arrElement = ''
      response.forEach((data) => {
        arrElement += data + '\n'
      })
      currentTime = RandomHelper.GetDateTimeString()
      await BasePage.WriteInNewFile(`[${currentTime}] - Getting ${response.length} buildings for user '${user.email}'\n` + arrElement, searchBuildingsFileName)
    } else {
      currentTime = RandomHelper.GetDateTimeString()
      await BasePage.WriteInNewFile(`[${currentTime}] - Buildings for user '${user.email}'\n are ${response}`, 'buildings.txt')
    }
    return response
  }

  static async GetBuildingsInfoForAddress (user, buildingArr, number) {
    let buildingAddress = buildingArr[0].trim()
    let buildingId = buildingArr[1]
    // await LoggerInfra.Debug(`Index number ${number} Getting response in Building typeahead for '${buildingAddress}', id is '${buildingId}'`)

    // let recordedFile = await BasePage.WriteLogsInFile(`Index number ${number} Getting response in Building typeahead for '${buildingAddress}', id is '${buildingId}'\n`, typeaheadFileName)
    let appApiClient = new AppApiClient(user)
    await appApiClient.authenticate(true)
    let request = PostBuildingsTypeahead.GetPostBuildingsTypeahead(buildingAddress)
    let response = await appApiClient.executeRequest(request, true)

    return response
  }

}

module.exports = BuildingsSearchHelper