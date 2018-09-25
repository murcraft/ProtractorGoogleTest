'use strict'
const BasePage = require('./basePage')

class ResultsPage extends BasePage {

  constructor () {
    super()
    this.resultsHeaderLocator = element.all(by.xpath('//div[@class=\'rc\']/h3'))
    this.totalNumberLocator = element(by.id('resultStats'))
  }

  async getResultsTitle (pageTitle) {
    await super.isContainTitle(pageTitle)
    return await super.getPageTitle()
  }

  async getResulsHeaders () {
    await super.isVisible(this.resultsHeaderLocator.last())
    const selector = await this.resultsHeaderLocator
    let headersArray = await selector.map(async result => {
      return result.getText()
    })
    let headers = await Promise.all(headersArray)
    await console.log('Results on the first page:\n', headers)
    return await headers
  }

  async getNumberOfResults () {
    await super.isVisible(this.totalNumberLocator)
    let totalNumberContent = await super.getElementText(this.totalNumberLocator)
    let totalNumber = await totalNumberContent.split(' ').join('').match('(\\d+)')
    console.log('Number of results: ', totalNumber[0])
    return totalNumber[0]
  }

}

module.exports = ResultsPage
