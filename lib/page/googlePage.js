'use strict'

let BasePage = require('./basePage')
let TextBox = require('../elements/textBox')
let Button = require('../elements/button')

let el = {
  getEmailTextBox () {
    return new TextBox(By.id(`identifierId`), `Email TextBox`)
  },
  getPassTextBox () {
    return new TextBox(By.xpath(`//input[class='whsOnd zHQkBf']`), `Password TextBox`)
  },
  getNextButton () {
    return new Button(By.id(`identifierNext`), `Next Button`)
  },
  getConfirmButton () {
    return new Button(By.className(`CwaK9`), `Next Button`)
  },
}

class GooglePage extends BasePage {

  async setEmailTexBox (email) {
    await el.getEmailTextBox().sendKeysWithCleaning(email)
    await el.getNextButton().clickElement()
    await browser.sleep(3000)
  }

  async setPassTexBox (text) {
    await el.getPassTextBox().sendPassWithCleaning(text)
    await el.getConfirmButton().clickElement()
    await browser.sleep(3000)
  }

}

module.exports = GooglePage