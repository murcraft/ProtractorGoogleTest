'use strict'

const LoggerInfra = require('../../infr/logger')
let BuildingsHelper = require('../../helpers/buildingsSearchHelper')

fdescribe('Suite3 - Search Buildings from 20000 to 22000: ', () => {

  let buildingsArr = []
  let buildingAddress
  let buildingId
  let initialCheckedNumber = 20000
  let checkedBuildingsNumber = 22000

  it('get buildings from Buildings in Search and number of checked buildings', async () => {
    buildingsArr = await BuildingsHelper.GetBuildingsAndIdArr(browser.params.userCreds)
  })

  it(`check building in Buildings Typeahead`, async () => {
    if (buildingsArr.length > checkedBuildingsNumber) {
      for (let n = initialCheckedNumber; n < checkedBuildingsNumber; n++) {
        let response = await BuildingsHelper.GetBuildingsInfoForAddress(browser.params.userCreds, buildingsArr[n], n)
        let idsArray = []
        let displayAddressesArray = []

          response.forEach((data) => {
            idsArray.push(data.id.toString())
            displayAddressesArray.push(data.display_address.trim().toUpperCase())
          })
          buildingAddress = buildingsArr[n][0].toUpperCase().trim()
          buildingId = buildingsArr[n][1]
          expect(displayAddressesArray).toContain(buildingAddress.toUpperCase().trim(), `Building ${buildingAddress} is absent in Search Buildings response`)
          expect(idsArray).toContain(`${buildingId}`, `Search Buildings doesn't contain ${buildingAddress} with Id ${buildingId}`)

      }
    } else {
      throw new Error(`Wrong response for request 'qa/buildings_in_search'`)
    }

  }, 3600000)

})