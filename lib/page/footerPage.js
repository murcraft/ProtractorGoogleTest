'use strict'

let BasePage = require('./basePage')
let Button = require('../elements/button')

let el = {
  getFooterItemButton(name) {
    return new Button(By.xpath(`//li[@class='l-list__item  ']/a[contains(@title, '${name}')]`), `'${name}' footer button`)
  }
}

class FooterPage extends BasePage () {

  async clickBuildingInstructionsButton () {
    await el.getFooterItemButton('Building Instructions').clickElementWithScrolling()
  }

}

module.exports = FooterPage