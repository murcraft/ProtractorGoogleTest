'use strict'

let BasePage = require('../basePage')

let Label = require('../../elements/label')
let Button = require('../../elements/button')

let elem = {
  getViewByName (name) {
    return new Label(By.xpath(`//li[@data-state='${name}']`), `'${name}' view label`)
  },
  getSearchLabel () {
    return new Label(By.className('save-search-label-name'), 'Search label')
  },
  getWelcomeNextButton () {
    return new Button(By.xpath(`//div[contains(@class, 'shepherd-open')]//a[contains(text(), 'Next')]`), 'Welcome Next button')
  },
  getInnerSearchLabelByName (name) {
    return new Label(By.xpath(`//li[contains(text(), '${name}')]`), `'${name}' search label`)
  },
  getAbandonChangesButton (text) {
    return new Button(By.xpath(`//div[@class='unsaved-changes-buttons']/a[text()='${text}']`), `'${text}' button`)
  },
  getBubbleFilterLabel () {
    return new Label(By.xpath(`//div[@class='ui-filter-bubbles-item-wrapper']/div/span[@class='filter-text']`), `Bubble filter label`)
  },
}

class ResultsCommon extends BasePage {

  async switchToListings () {
    await elem.getViewByName('List').clickElement()
    await super.waitForLoadPage()
    await browser.sleep(1000)
    await super.waitForLoadPage()
  }

  async switchToAnalytics () {
    await elem.getViewByName('Report').clickElement()
    await super.waitForLoadPage()
    await browser.sleep(1000)
    await super.waitForLoadPage()
    await this.completeOnboardingIfPresent()
  }


  async startNewSearch () {
    await super.waitForLoadPage()
    await this.clickSearchesLabel()
    await this.selectSearchFromOpened('New Search'.toUpperCase())
    await this.completeOnboardingIfPresent()
  }

  async completeOnboardingIfPresent () {
    while (await elem.getWelcomeNextButton().isElementPresent()) {
      await elem.getWelcomeNextButton().clickElement()
      await browser.sleep(500)
    }
  }

  async clickSearchesLabel () {
    await super.waitForLoadPage()
    await elem.getSearchLabel().clickElement()
  }

  async selectSearchFromOpened (name) {
    await elem.getInnerSearchLabelByName(name).clickElement()
    await this.abandonChangesIfPresent()
  }

  async abandonChangesIfPresent (isAbandon = true) {
    let buttonTitle = isAbandon ? 'Leave Search'.toUpperCase() : 'Cancel'.toUpperCase()
    if (await elem.getAbandonChangesButton(buttonTitle).isElementPresent()) {
      await elem.getAbandonChangesButton(buttonTitle).clickElement()
    }
  }

  async getBubbleLabelText () {
    return await elem.getBubbleFilterLabel().getAllElementsText()
  }

  async isBubbleLabelDisplayed () {
    return await elem.getBubbleFilterLabel().isElementPresent()
  }

}

module.exports = ResultsCommon