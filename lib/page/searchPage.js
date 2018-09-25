'use strict'
const BasePage = require('./basePage')

class SearchPage extends BasePage {

  constructor () {
    super()
    this.Url = 'http://www.google.by'
    this.searchFieldLocator = element(by.name('q'))
  }

  async navigate () {
    await super.navigate(this.Url)
  }

  async enterRequiredWord (requestedWord) {
    await super.isVisible(this.searchFieldLocator)
    await super.sendKeysInField(this.searchFieldLocator, requestedWord)
    await super.enterButton(this.searchFieldLocator)
  }

}

module.exports = SearchPage