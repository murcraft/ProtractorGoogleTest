'use strict'

let BaseElement = require('./baseElement')

class TextBox extends BaseElement {

  constructor (by, name) {
    super(by, name)
  }

  async sendKeysAndPress (keys) {
    await this.waitForIsPresent()
    await Logger.debug(`${this.name} :: Typing text '${keys}'`)
    await this.element.sendKeys(keys)
    await Logger.debug(`Push Enter for element`)
    await this.element.sendKeys(protractor.Key.ENTER)
  }

}

module.exports = TextBox