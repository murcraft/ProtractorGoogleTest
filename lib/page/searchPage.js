'use strict'

let BasePage = require('./basePage')
let TextBox = require('../elements/textBox')
let Label = require('../elements/label')

let el = {
  getSearchTextBox() {
    return new TextBox(By.name('q'), `Search textBox`)
  },
  getResultsCountLabel () {
    return new Label(By.className('ui-counter-total'), 'Results count label')
  },
}

class SearchPage extends BasePage {

  constructor () {
    super()
    this.Url = browser.baseUrl
  }

  async navigate () {
    await super.navigate(this.Url)
    await super.waitForLoadPage()
  }

  async navigateLego () {
    await super.navigate(browser.params.legoUrl)
    await super.waitForLoadPage()
  }

  async navigateGoogle () {
    await super.navigate(browser.params.page.startPage)
    await super.waitForLoadPage()
  }

  async enterRequiredWord (requestedWord) {
    await el.getSearchTextBox().sendKeysAndPress(requestedWord)
    await super.waitForLoadPage()
  }

  async getResultsCount () {
    await super.waitForLoadPage()
    let resStr = await el.getResultsCountLabel().getElementText()
    return await parseInt(resStr.replace(',', ''))
  }

}

module.exports = SearchPage