'use strict'
const BasePage = require('./basePage')

class SearchPage extends BasePage {

  constructor () {
    super()
    this.Url = 'http://www.google.by'
    this.searchFieldElement = element(by.name('q'))
  }

  async navigate () {
    await super.navigate(this.Url)
  }

  async enterRequiredWord (requestedWord) {
    await super.waitForVisible(this.searchFieldElement)
    await super.sendKeysInField(this.searchFieldElement, requestedWord)
    await super.enterButton(this.searchFieldElement)
  }

}

module.exports = SearchPage