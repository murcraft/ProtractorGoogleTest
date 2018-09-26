'use strict'
let EC = protractor.ExpectedConditions

class BasePage {

  constructor () {
  }

  async navigate (targetUrl) {
    browser.get(targetUrl)
  }

  async getPageTitle () {
    return browser.getTitle()
  }

  async waitForLoadPage () {
    await browser.wait(EC.urlContains('search'))
    return browser.driver.wait(async () => {
      return await browser.executeScript('return document.readyState') === 'complete'
    }, 5000)
  }

  async waitForVisibleElement (element) {
    return browser.wait(EC.visibilityOf(element))
  }

  async getElementText (element) {
    return element.getText()
  }

  sendKeysInField (element, requestText) {
    return element.sendKeys(requestText)
  }

  enterButton (element) {
    return element.sendKeys(protractor.Key.ENTER)
  }

}

module.exports = BasePage