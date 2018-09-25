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

  async isVisible (element) {
    return await browser.wait(EC.visibilityOf(element), 10000)
  }

  async getElementText (element) {
    return await element.getText()
  }

  async sendKeysInField (element, requestText) {
    await element.sendKeys(requestText)
  }

  async enterButton (element) {
    await element.sendKeys(protractor.Key.ENTER)
  }

}

module.exports = BasePage