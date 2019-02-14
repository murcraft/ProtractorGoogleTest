'use strict'

let BasePage = require('../../basePage')
let Label = require('../../../elements/label')
let TextBox = require('../../../elements/textBox')
let Button = require('../../../elements/button')

let el = {
  getSearchInstructionsTextBox () {
    return new TextBox(By.id(`input_dirty`), `Search instruction textBox`)
  },
  getDownloadPdfLabelByNumber (number) {
    return new Button(By.xpath(`//div[@class='bi-detail'][${number}]//a[contains(@class,'pull-right')][contains(@class, 'btn-default')]`), `Button label by number ${number}`)
  }
}

class BuildingsInstructionsPage extends BasePage {

  async setTextInSearchField (text) {
    await el.getSearchInstructionsTextBox().sendKeysAndPress(text)
  }

  async clickDownloadPdf (number = 1) {
    await el.getDownloadPdfLabelByNumber(number).clickElementWithScrolling()
    let attrText = await el.getDownloadPdfLabelByNumber(number).getElementAttribute('href')
    attrText = attrText.split('/')
    return attrText[attrText.length]
  }

}

module.exports = BuildingsInstructionsPage