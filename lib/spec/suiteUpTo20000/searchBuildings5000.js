'use strict'

let s3Helper = require('../../helpers/s3Helper')

let BuildingsHelper = require('../../helpers/buildingsSearchHelper')
let LoggerInfra = require('../../infr/logger')
let RandomHelper = require('../../helpers/randomHelper')
let BasePage = require('../../page/basePage')

fdescribe('Search Buildings To 20000 - Search Buildings to 5000: ', () => {

  let randomText = RandomHelper.GetRandomString('log')
  let typeaheadFileName = `logs_from_response_${randomText}.txt`
  let searchBuildingsFileName = `buildingsArray_${randomText}.txt`

  let buildingsArr = []
  let buildingAddress
  let buildingId
  let initialCheckedNumber = 0
  let checkedBuildingsNumber = 5000
  let recordedFile

  it('get buildings from Buildings in Search and number of checked buildings', async () => {
      buildingsArr = await BuildingsHelper.GetBuildingsAndIdArr(browser.params.userCreds)
      // buildingsArr = [ ['187 Garfield Place', 181535], ['478 Chauncey Street', 194492], ['318 Bond Street', 188363], ['319 East 83rd Street', 20542], ['211 Schermerhorn Street', 110718]]
      buildingsArr =
        [
          ['187 Garfield Place', 181535],['478 Chauncey Street', 194492], ['318 Bond Street', 188363], ['319 East 83rd Street', 20542],
          ['211 Schermerhorn Street', 110718], ['690 East 18th Street', 115636], ['2623 Atlantic Avenue', 116151], ['91 Varet Street', 197683],
          ['128 East 65th Street', 15407], ['22 Brevoort Place', 212346], ['293 6th Street', 224906], ['96 Hart Street', 138475], ['462 76th Street', 235014],
          ['170 Saint Marks Avenue', 250014], ['872 Pacific Street', 151426], ['2164 Fulton Street', 308078], ['4 East 65th Street', 32846],
          ['572 1st Street', 246567],['316 Carroll Street', 254144], ['246 15th Street', 265520], ['669 East 5th Street', 174473], ['91 Gravesend Neck Road', 268521],
          ['70 North Henry Street', 80372], ['1440 Ocean Parkway', 111732], ['22 Bay Ridge Place', 270525], ['1431 East 23rd Street', 273627], ['1128 Decatur Street', 278188]
        ]
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
        buildingAddress = buildingsArr[n][0].toUpperCase().trim()
        buildingId = buildingsArr[n][1]
        recordedFile = await BasePage.WriteLogsInFile(`Index number ${n} Getting response in Building typeahead for '${buildingAddress}', id is '${buildingId}'\n`, typeaheadFileName)
        if (response !== undefined) {
          response.forEach((data) => {
            idsArray.push(data.id.toString())
            displayAddressesArray.push(data.display_address.trim().toUpperCase())
          })

          expect(displayAddressesArray).toContain(buildingAddress.toUpperCase().trim(), `Building ${buildingAddress} is absent in Search Buildings response`)
          expect(idsArray).toContain(`${buildingId}`, `Search Buildings doesn't contain ${buildingAddress} with Id ${buildingId}`)
        } else {
          expect(response).not.toEqual(undefined, `Response from request 'buildings/building_typeahead' is undefined`)
        }
      }
      await s3Helper.UploadToS3(recordedFile, typeaheadFileName)
    } else {
      LoggerInfra.Debug(`Number of buildings is equal ${buildingsArr.length}. It is so small and cannot be checked`)
    }
  }, 7200000)

})