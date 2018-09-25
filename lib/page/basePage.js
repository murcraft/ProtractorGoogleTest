'use strict'
let EC = protractor.ExpectedConditions

class BasePage {

  constructor () {
    browser.waitForAngularEnabled(false)
  }

  async navigate (targetUrl) {
    browser.get(targetUrl)
    return this
  }

  async getPageTitle () {
    return await browser.getTitle()
  }

  async isContainTitle (title) {
    return await EC.titleContains(title)
  }

  async isInDom (locator) {
    return await EC.presenceOf(locator)
  }

  async isVisible (locator) {
    return await EC.visibilityOf(locator)
  }

  async getElementText (locatorName) {
    return await locatorName.getText()
  }

  async sendKeysInField (locatorName, requestText) {
    await element(locatorName).sendKeys(requestText)
  }

  async enterButton(locatorName) {
    await element(locatorName).sendKeys(protractor.Key.ENTER)
  }
}

module.exports = BasePage