'use strict'

let BuildingsHelper = require('../../helpers/buildingsSearchHelper')
const LoggerInfra = require('../../infr/logger')

fdescribe('Search Buildings To 20000 - Search Buildings to 5000: ', () => {

  let buildingsArr = []
  let buildingAddress
  let buildingId
  let initialCheckedNumber = 0
  let checkedBuildingsNumber = 6//000

  it('get buildings from Buildings in Search and number of checked buildings',
    async () => {
      // buildingsArr = await BuildingsHelper.GetBuildingsAndIdArr(browser.params.userCreds)
      buildingsArr = [ ['187 Garfield Place', 181535], ['478 Chauncey Street', 194492], ['318 Bond Street', 188363], ['319 East 83rd Street', 20542], ['211 Schermerhorn Street', 110718]]
    })

  it(`check building with index number in Buildings Typeahead`, async () => {
    if (buildingsArr === undefined) {
      throw new Error(`Wrong response for request 'qa/buildings_in_search', response is '${buildingsArr}'`)
    }
    if (buildingsArr.length > initialCheckedNumber) {
      if (buildingsArr.length < checkedBuildingsNumber) {
        checkedBuildingsNumber = buildingsArr.length
      }
      LoggerInfra.Debug(`Getting `)
      for (let n = initialCheckedNumber; n < checkedBuildingsNumber; n++) {
        let response = await BuildingsHelper.GetBuildingsInfoForAddress(browser.params.userCreds, buildingsArr[n], n)
        let idsArray = []
        let displayAddressesArray = []
        if (response !== undefined) {
          response.forEach((data) => {
            idsArray.push(data.id.toString())
            displayAddressesArray.push(data.display_address.trim().toUpperCase())
          })
          buildingAddress = buildingsArr[n][0].toUpperCase().trim()
          buildingId = buildingsArr[n][1]

          expect(displayAddressesArray).toContain(buildingAddress.toUpperCase().trim(), `Building ${buildingAddress} is absent in Search Buildings response`)
          expect(idsArray).toContain(`${buildingId}`, `Search Buildings doesn't contain ${buildingAddress} with Id ${buildingId}`)
        } else {
          expect(response).not.toEqual(undefined, `Response from request 'buildings/building_typeahead' is undefined`)
        }
      }
    } else {
      LoggerInfra.Debug(`Number of buildings is equal ${buildingsArr.length}. It is so small and cannot be checked`)
    }
  }, 7200000)

})