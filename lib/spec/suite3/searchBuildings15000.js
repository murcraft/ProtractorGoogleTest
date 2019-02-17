'use strict'

let BuildingsHelper = require('../../helpers/buildingsSearchHelper')

fdescribe('Suite3 - Search Buildings: ', () => {

  let buildingsArr = []
  let buildingAddress
  let buildingId
  let initialCheckedNumber = 10000
  let checkedBuildingsNumber = 15000

  it('get buildings from Buildings in Search and number of checked buildings', async () => {
      buildingsArr = await BuildingsHelper.GetBuildingsAndIdArr(browser.params.userCreds)
    })

  it(`check building in Buildings Typeahead`, async () => {

    for (let n = initialCheckedNumber; n < checkedBuildingsNumber; n++) {
      let response = await BuildingsHelper.GetBuildingsInfoForAddress(browser.params.userCreds, buildingsArr[n], n + 1)
      let idsArray = []
      let displayAddressesArray = []
      response.forEach((data) => {
        idsArray.push(data.id.toString())
        displayAddressesArray.push(data.display_address.trim().toUpperCase())
      })
      buildingAddress = buildingsArr[n][0].toUpperCase().trim()
      buildingId = buildingsArr[n][1]
      let responseStr = JSON.stringify(response, null, '    ')

      expect(displayAddressesArray).toContain(buildingAddress.toUpperCase().trim(), `Building ${buildingAddress} is absent in Search Buildings response`)
      expect(idsArray).toContain(`${buildingId}`, `Search Buildings doesn't contain ${buildingAddress} with Id ${buildingId}`)
    }
  })

})