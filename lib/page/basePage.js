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
    return await browser.wait(EC.titleContains(title), 5000)
  }

  async isVisible (locator) {
    return await browser.wait(EC.visibilityOf(locator), 10000)
  }

  async getElementText (locatorName) {
    return await locatorName.getText()
  }

  async sendKeysInField (locatorName, requestText) {
    await locatorName.sendKeys(requestText)
  }

  async enterButton (locatorName) {
    await locatorName.sendKeys(protractor.Key.ENTER)
  }

}

module.exports = BasePage