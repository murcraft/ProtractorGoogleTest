'use strict'

let BuildingsHelper = require('../../helpers/buildingsSearchHelper')

describe('Suite3 - Search Buildings from 12000 to 14000: ', () => {

  let buildingsArr = []
  let buildingAddress
  let buildingId
  let initialCheckedNumber = 12000
  let checkedBuildingsNumber = 14000

  it('get buildings from Buildings in Search and number of checked buildings', async () => {
    buildingsArr = await BuildingsHelper.GetBuildingsAndIdArr(browser.params.userCreds)
  })

  for (let n = initialCheckedNumber; n < checkedBuildingsNumber; n++) {
    (function () {
      it(`check building with index number ${n} in Buildings Typeahead`, async () => {
        if (buildingsArr.length > checkedBuildingsNumber) {

          let response = await BuildingsHelper.GetBuildingsInfoForAddress(browser.params.userCreds, buildingsArr[n], n + 1)
          let idsArray = []
          let displayAddressesArray = []
          try {
            response.forEach((data) => {
              idsArray.push(data.id.toString())
              displayAddressesArray.push(
                data.display_address.trim().toUpperCase())
            })
            buildingAddress = buildingsArr[n][0].toUpperCase().trim()
            buildingId = buildingsArr[n][1]
          } catch (e) {}
          expect(displayAddressesArray).toContain(buildingAddress.toUpperCase().trim(), `Building ${buildingAddress} is absent in Search Buildings response`)
          expect(idsArray).toContain(`${buildingId}`, `Search Buildings doesn't contain ${buildingAddress} with Id ${buildingId}`)
        } else {
          throw new Error(`Wrong response for request 'qa/buildings_in_search'`)
        }
      })
    })(n)
  }

})