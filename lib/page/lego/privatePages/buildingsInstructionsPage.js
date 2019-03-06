'use strict'

let BasePage = require('../../basePage')
let Label = require('../../../elements/label')
let DropDown = require('../../../elements/dropdown')
let Button = require('../../../elements/button')

let el = {
  getSearchInstructionsTextBox () {
    return new DropDown(By.id(`input_dirty`), `Search instruction textBox`)
  },
  getDownloadPdfLabelByNumber (number) {
    return new Button(By.xpath(`//div[@class='bi-detail'][${number}]//a[contains(@class,'pull-right')][contains(@class, 'btn-default')]`), `Button label by number ${number}`)
  },
  getFirstLabelFromSearchInstruction () {
    return new Label(By.xpath(`//ul[contains(@class, 'typeahead')][contains(@class, 'dropdown-menu')][1]`), `First instruction result label`)
  },
  getFindInstructionButton () {
    return new Button(By.xpath(`//div[@class='basic-search-btn']/button`), `Button search`)
  }
}

class BuildingsInstructionsPage extends BasePage {

  async setTextInSearchField (text) {
    await el.getSearchInstructionsTextBox().selectValueWithSearch(text)
    await this.clickFindButton()
  }

  async clickDownloadPdf (number = 1) {
    await el.getDownloadPdfLabelByNumber(number).clickElementWithScrolling()
    let attrText = await el.getDownloadPdfLabelByNumber(number).getElementAttribute('href')
    attrText = attrText.split('/')
    return attrText[attrText.length - 1]
  }

  async clickFindButton () {
    await el.getFindInstructionButton().clickElement()
  }

}

module.exports = BuildingsInstructionsPage