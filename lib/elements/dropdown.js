'use strict'

let BaseElement = require('./baseElement')
let TextBox = require('./textBox')
let Label = require('./label')

let el = {
  getInput () {
    return new TextBox(By.id(`input_dirty`), `Search instruction textBox`)
  },
  getOptionLabel (text) {
    return new Label(By.xpath(`//ul[contains(@class, 'typeahead')][contains(@class, 'dropdown-menu')]//*[contains(text(), '${text}')]`), `'${text}' label`)
  }
}

class DropDown extends BaseElement {

  constructor (by, name) {
    super(by, name)
  }

  async selectValueWithSearch (value) {
    await this.waitForIsPresent()
    await Logger.debug(`${this.name} :: Opening drop-down`)
    await this.clickElement()
    await el.getInput().sendKeysWithCleaning(value)
    await el.getOptionLabel(value).clickElement()
  }
}

module.exports = DropDown