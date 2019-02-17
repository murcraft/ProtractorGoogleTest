'use strict'

let BasePage = require('../../basePage')
let Label = require('../../../elements/label')

let el = {
  getSupportNavigationLabelByText (text) {
    return new Label(By.xpath(`//nav[@class='navbar']//span[contains(text(), '${text}')]/..`), `Support Navigation label by text '${text}'`)
  }
}

class SupportHeaderPage extends BasePage {

  async navigateToBuildingInstructionsLink () {
    await el.getSupportNavigationLabelByText('Building Instruction').clickElement()
  }

}

module.exports = SupportHeaderPage