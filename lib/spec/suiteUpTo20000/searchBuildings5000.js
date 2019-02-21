'use strict'

let BuildingsHelper = require('../../helpers/buildingsSearchHelper')
let RandomHelper = require('../../helpers/randomHelper')

describe('Search Buildings To 20000 - Search Buildings to 5000: ', () => {

  let buildingsArr = []
  let buildingAddress
  let buildingId
  let initialCheckedNumber = 0
  let checkedBuildingsNumber = 5000

  let randomText = RandomHelper.GetRandomString('Log')
  let fileName = `buildings${randomText}.txt`

  it('get buildings from Buildings in Search and number of checked buildings',
    async () => {
      buildingsArr = await BuildingsHelper.GetBuildingsAndIdArr(browser.params.userCreds)
    })

  it(`check building with index number in Buildings Typeahead`, async () => {
    if (buildingsArr.length > initialCheckedNumber) {
      if (buildingsArr.length < checkedBuildingsNumber) {
        checkedBuildingsNumber = buildingsArr.length
      }
      for (let n = initialCheckedNumber; n < checkedBuildingsNumber; n++) {
        let response = await BuildingsHelper.GetBuildingsInfoForAddress(browser.params.userCreds, buildingsArr[n], n, fileName)
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
      throw new Error(`Wrong response for request 'qa/buildings_in_search'`)
    }

  }, 7200000)

})