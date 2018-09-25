'use strict'
let EC = protractor.ExpectedConditions

class BasePage {

  constructor () {
  }

  async navigate (targetUrl) {
    browser.get(targetUrl)
  }

  async getPageTitle () {
    return await browser.getTitle()
  }

  async waitForLoadPage () {
    await browser.wait(EC.urlContains('search'))
    return await browser.wait(function () {
      return browser.executeScript('return document.readyState').then(function (result) {
        console.log(result, '1st res')
        console.log(result == 'complete', 'truefal')
        return result == 'complete'
      })
    })
  }

  async waitForVisible (element) {
    return await browser.wait(EC.visibilityOf(element))
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