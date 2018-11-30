'use strict'

let BasePage = require('./basePage')
let Label = require('../elements/label')

let el = {
  getAllResultsHeadersLabel() {
    return new Label(By.xpath(`//div[@class='srg']//div[@class='rc']//h3`), `Result headers label`)
  },
  getTotalNumberLabel() {
    return new Label(By.id(`resultStats`), `Total count label`)
  }

}

class ResultsPage extends BasePage {

  async getResultlsHeaders () {
    await super.waitForLoadPage()
    return await el.getAllResultsHeadersLabel().getAllElementsText()
  }

  async getNumberOfResults () {
    let totalNumberContent = await el.getTotalNumberLabel().getElementText()
    return totalNumberContent.split(' ').join('').match('(\\d+)')[0]
  }

}

module.exports = ResultsPage
