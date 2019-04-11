'use strict'

let BasePage = require('../basePage')

let Label = require('../../elements/label')

let elem = {
  getListingByNumberLabel (number) {
    return new Label(By.xpath(`//li[contains(@class, 'column-li')][${number}]/div/div[@class='address']/a`), `Listing label '${number}'`)
  },
  getListingCheckBoxByNumberLabel (number) {
    return new Label(By.xpath(`//li[contains(@class, 'column-li')][${number}]//div[@class='checkbox']`), `Listing checkbox '${number}'`)
  },
  getListingLocationLabel () {
    return new Label(By.xpath(`//li[contains(@class, 'column-li')]//div[@data-field='nh']`), `Listing Location label`)
  },
  getListingPriceLabelByNumber (number) {
    return new Label(By.xpath(`//li[contains(@class, 'column-li')][${number}]//div[@class='price']`), `Listing price label ${number}`)
  },
}

class ListingsView extends BasePage {

  async openListingByNumber (number) {
    let listingName = await elem.getListingByNumberLabel(number).getElementText()
    let listingPrice = await elem.getListingPriceLabelByNumber(number).getElementText()
    await Logger.debug(`Opening listing ${listingName}, price ${listingPrice}`)
    await elem.getListingByNumberLabel(number).clickElement()
    return await {name: listingName, price: listingPrice}
  }
}

module.exports = ListingsView