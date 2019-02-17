'use strict'

let BasePage = require('../../basePage')
let Label = require('../../../elements/label')

let el = {
  getNavigationLabelByText (text) {
    return new Label(By.xpath(`//a[@class='l-nav__link'][contains(text(), '${text}')]`), `Navigation label by text '${text}'`)
  }
}

class MainHeaderPage extends BasePage {

  async navigateToSupportLink () {
    await el.getNavigationLabelByText('Support').clickElement()
  }

}

module.exports = MainHeaderPage