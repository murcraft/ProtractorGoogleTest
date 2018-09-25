'use strict'
const BasePage = require('./basePage')

class ResultsPage extends BasePage {

  constructor () {
    super()
    this.resultsHeaderElement = element.all(by.xpath('//div[@class=\'rc\']/h3'))
    this.totalNumberElement = element(by.id('resultStats'))
  }

  async getResultsTitle () {
    await super.waitForLoadPage()
    return await super.getPageTitle()
  }

  async getResulsHeaders () {
    await super.waitForVisible(this.resultsHeaderElement.last())
    let headersArray = await this.resultsHeaderElement.map(async result => {
      return result.getText()
    })
    let headers = await Promise.all(headersArray)
    await console.log('Results on the first page:\n', headers)
    return await headers
  }

  async getNumberOfResults () {
    await super.waitForVisible(this.totalNumberElement)
    let totalNumberContent = await super.getElementText(this.totalNumberElement)
    let totalNumber = await totalNumberContent.split(' ').join('').match('(\\d+)')
    console.log('Number of results: ', totalNumber[0])
    return totalNumber[0]
  }

}

module.exports = ResultsPage
