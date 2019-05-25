'use strict'

let BasePage = require('../basePage')

let Button = require('../../elements/button')
let Label = require('../../elements/label')

let elem = {
  getReportsButton () {
    return new Button(By.className('panels-top-button reports'), 'Reports button')
  },
  getListingLocationLabel () {
    return new Label(By.xpath(`//div[@class='ui-slide-panel-content-item'][@style='display: block;']//tr[@class='panels-listing-table-item-view'][not(contains(@style, 'display: none;'))]//td[2]/span[2]`), `Listing location label`)
  },
  getListingCheckBoxByNumberLabel (number) {
    return new Label(By.xpath(`//div[@class='ui-slide-panel-content-item'][@style='display: block;']//tr[contains(@class, 'panels-listing-table-item-view')][${number}]//div[@class='checkbox']`), `Listing checkbox '${number}'`)
  },
  getListingByNumberLabel (number) {
    return new Label(By.xpath(`//div[@class='ui-slide-panel-content-item'][@style='display: block;']//tr[contains(@class, 'panels-listing-table-item-view')][${number}]//span[@class='address']`), `Listing label '${number}'`)
  },
}

class ListingDetailsModal extends BasePage {

  async clickReportsButton () {
    await elem.getReportsButton().clickElement()
  }

}

module.exports = ListingDetailsModal