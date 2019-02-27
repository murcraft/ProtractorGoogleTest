'use strict'

let s3Helper = require('../../helpers/s3Helper')

let BuildingsHelper = require('../../helpers/buildingsSearchHelper')
let LoggerInfra = require('../../infr/logger')
let RandomHelper = require('../../helpers/randomHelper')
let BasePage = require('../../page/basePage')

describe('Search Buildings To 50000 - Search Buildings to 44000: ', () => {

  let randomText = RandomHelper.GetRandomString('log')
  let typeaheadFileName = `typeahead_search44000_${randomText}.txt`

  let buildingsArr = []
  let buildingAddress
  let buildingId
  let initialCheckedNumber = 42000
  let checkedBuildingsNumber = 44000
  let recordedFile

  it('get buildings from Buildings in Search and number of checked buildings', async () => {
    buildingsArr = await BuildingsHelper.GetBuildingsAndIdArr(browser.params.userCreds)

    if (buildingsArr === undefined) {
      throw new Error(`Wrong response for request 'qa/buildings_in_search', response is '${buildingsArr}'`)
    }
    if (buildingsArr.length > initialCheckedNumber) {
      if (buildingsArr.length < checkedBuildingsNumber) {
        checkedBuildingsNumber = buildingsArr.length
      }
      await LoggerInfra.Debug(`Writing logs into ${typeaheadFileName} file`)
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

          expect(displayAddressesArray).toContain(buildingAddress.toUpperCase().trim(), `Building index number ${n} with address ${buildingAddress} and Id ${buildingId} is absent in Search Buildings response`)
          expect(idsArray).toContain(`${buildingId}`, `Search Buildings doesn't contain ${buildingAddress} with Id ${buildingId}`)
        } else {
          expect(response).not.toEqual(undefined, `Response with ${buildingsArr[n]} from request 'buildings/building_typeahead' is 'undefined'`)
        }
      }
      await s3Helper.UploadToS3(recordedFile, typeaheadFileName)
    } else {
      throw new Error(`Length of buildings array is not enough', response length is ${buildingsArr.length}`)
    }
  }, 7200000)

})