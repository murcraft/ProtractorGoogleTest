'use strict'

let BasePage = require('../basePage')
let Label = require('../../elements/label')

let el = {
  getExploreButton () {
    return new Label(By.xpath(`//div[contains(@class, 'cta__extra-txt')]/div[contains(text(), 'EXPLORE')]/..`), `Explore button`)
  }
}

class OnBoardingPage extends BasePage {

  async clickExploreButton () {
    await el.getExploreButton().clickElement()
  }

}

module.exports = OnBoardingPage