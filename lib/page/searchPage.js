'use strict'

let BasePage = require('./basePage')
let TextBox = require('../elements/textBox')

let el = {
  getSearchTextBox() {
    return new TextBox(By.name('q'), `Search textBox`)
  }
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

}

module.exports = SearchPage