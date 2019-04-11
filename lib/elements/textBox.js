'use strict'

let BaseElement = require('./baseElement')

class TextBox extends BaseElement {

  constructor (by, name) {
    super(by, name)
  }

  async sendKeysAndPress (keys) {
    await this.waitForIsPresent()
    await this.element.clear()
    await Logger.debug(`${this.name} :: Typing text '${keys}'`)
    await this.element.sendKeys(keys)
    await Logger.debug(`Push Enter for element`)
    await this.element.sendKeys(protractor.Key.ENTER)
  }

  async sendKeysWithCleaning (keys) {
    await this.waitForIsPresent()
    await Logger.debug(`${this.name} :: Clear texbox `)
    await this.element.clear()
    await Logger.debug(`${this.name} :: Typing text '${keys}'`)
    await this.element.sendKeys(keys)
  }

  async sendPassWithCleaning (keys) {
    await this.waitForIsPresent()
    await Logger.debug(`${this.name} :: Clear pass `)
    await this.element.clear()
    await this.element.sendKeys(keys)
  }

  async clearSendKeys (keys) {
    await this.waitForIsPresent()
    await Logger.debug(`${this.name} :: Clearing`)
    await this.element.clear()
    await Logger.debug(`${this.name} :: Typing text '${keys}'`)
    await this.element.sendKeys(keys)
  }

  async clearSendKeysPass (keys) {
    await this.waitForIsPresent()
    await Logger.debug(`${this.name} :: Clearing`)
    await this.element.clear()
    await Logger.debug(`${this.name} :: Typing password`)
    await this.element.sendKeys(keys)
  }

}

module.exports = TextBox