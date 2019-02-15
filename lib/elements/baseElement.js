'use strict'

const timeout = browser.params.waitTimeout

let BasePage = require('../page/basePage')

class BaseElement extends BasePage {

  constructor (by, name) {
    super()
    this.by = by
    this.element = element(this.by)
    this.name = name
  }

  async waitForIsClickable () {
    try {
      await browser.wait(EC.elementToBeClickable(this.element), (timeout))
    }
    catch (e) {
      await Logger.error(`Element '${this.name}' with locator ${this.by} is not clickable after ${timeout / 1000} sec`)
      throw `Element '${this.name}' with locator ${this.by} is not clickable after ${timeout / 1000} sec`
    }
  }

  async waitForIsPresent () {
    await super.waitForLoadPage()
    try {
      await browser.wait(EC.presenceOf(this.element), (timeout))
    }
    catch (e) {
      await Logger.error(`Element '${this.name}' with locator ${this.by} didn't appear within ${timeout / 1000} sec`)
      throw `Element '${this.name}' with locator ${this.by} didn't appear within ${timeout / 1000} sec`
    }
  }

  async clickElement () {
    await this.waitForIsPresent()
    await this.waitForIsClickable()
    await Logger.debug(`${this.name} :: Click`)
    await browser.executeScript('arguments[0].style.border=\'2px solid red\'', this.element)
    await this.element.click()
  }

  async clickElementViaJS () {
    await this.waitForIsPresent()
    await Logger.debug(`${this.name} :: Click via JS`)
    await browser.executeScript('arguments[0].style.border=\'2px solid red\'', this.element)
    await browser.executeScript('arguments[0].click()', this.element)
  }

  async clickElementViaActions () {
    await this.waitForIsPresent()
    await Logger.debug(`${this.name} :: Click via Actions`)
    await browser.executeScript('arguments[0].style.border=\'2px solid red\'', this.element)
    await browser.actions().click(this.element).perform()
  }

  async mouseOverAndClick () {
    await browser.sleep()
    await this.waitForIsPresent()
    await browser.executeScript('arguments[0].style.border=\'2px solid red\'', this.element)
    await browser.actions().mouseMove(this.element)
    await this.element.sendKeys(protractor.Key.ARROW_DOWN);
    await this.element.sendKeys(protractor.Key.TAB);
  }

  async getElementText () {
    await this.waitForIsPresent()
    await Logger.debug(`${this.name} :: Getting text`)
    let text = await this.element.getText()
    await Logger.debug(`${this.name} :: Text is '${text}'`)
    return text
  }

  async getAllElementsText () {
    await this.waitForIsPresent()
    await Logger.debug(`${this.name} :: Getting text for all elements`)
    let textArr = await element.all(this.by).getText()
    await Logger.debug(`All elements text array is: ${textArr}`)
    return await textArr
  }

  async clickElementWithScrolling () {
    await this.waitForIsPresent()
    await this.waitForIsClickable()
    await Logger.debug(`${this.name} :: Clicking`)
    await browser.executeScript('arguments[0].scrollIntoView()', this.element)
    await browser.executeScript('arguments[0].style.border=\'2px solid red\'', this.element)
    await this.element.click()
  }

  async getElementAttribute (attr) {
    await this.waitForIsPresent()
    await Logger.debug(`${this.name} :: Getting attribute '${attr}'`)
    let value = await this.element.getAttribute(attr)
    await Logger.debug(`${this.name} :: Attribute '${attr}' is '${value}'`)
    return value
  }

}

module.exports = BaseElement