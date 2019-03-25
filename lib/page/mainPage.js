'use strict'

let BasePage = require('./basePage')



class MainPage extends BasePage {

  async openMainPage() {
    await browser.get(browser.params.legoUrl)
  }

}

module.exports = MainPage