'use strict'

let BasePage = require('./basePage')

let Label = require('../elements/label')

let elem = {
  getListingByNumberLabel (number) {
    return new Label(By.xpath(`//li[contains(@class, 'column-li')][${number}]/div/div[@class='address']/a`), `Listing label '${number}'`)
  },
  getListingCheckBoxByNumberLabel (number) {
    return new Label(By.xpath(`//li[contains(@class, 'column-li')][${number}]//div[@class='checkbox']`), `Listing checkbox '${number}'`)
  },
  getListingBathroomsLabel () {
    return new Label(By.xpath(`//li[contains(@class, 'column-li')]//div[@data-field='baths']`), `Listing Bathrooms label`)
  },
  getListingLocationLabel () {
    return new Label(By.xpath(`//li[contains(@class, 'column-li')]//div[@data-field='nh']`), `Listing Location label`)
  },
  getListingPriceLabelByNumber (number) {
    return new Label(By.xpath(`//li[contains(@class, 'column-li')][${number}]//div[@class='price']`), `Listing price label ${number}`)
  },
}

class ListingsView extends BasePage {

    async selectListingByNumber (number) {
    let listingName = await elem.getListingByNumberLabel(number).getElementText()
    let listingPrice = await elem.getListingPriceLabelByNumber(number).getElementText()
    await Logger.debug(`Selecting listing ${listingName}, price ${listingPrice}`)
    await elem.getListingCheckBoxByNumberLabel(number).clickElementViaJS()
    return {name: listingName, price: listingPrice}
  }


  async getAllListingsBathroomsArr () {
    return await elem.getListingBathroomsLabel().getAllElementsText()
  }
}

module.exports = ListingsView