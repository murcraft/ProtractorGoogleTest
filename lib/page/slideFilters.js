'use strict'


let BasePage = require('./basePage')

let ResultsCommon = require('./pdfs/resultsCommon')

let Button = require('../elements/button')
let Label = require('../elements/label')

let resultsCommon = new ResultsCommon()

let elem = {
  getFilterBlockLabel (label) {
    return new Label(By.xpath(`//*[@class='title list-title'][.//*[contains(text(), '${label}')]]`), `Filter '${label}' label`)
  },
  getDeleteFilterBlockButton (label) {
    return new Button(By.xpath(`//*[@class='title list-title'][.//*[contains(text(), '${label}')]]/a`), `Filter '${label}' close button`)
  },
  getPlusButton () {
    return new Button(By.className(`btn-add icon-plus`), `Plus button`)
  },
  getSquareByTextLabel (text) {
    return new Label(By.xpath(`//div[contains(@class, 'filter')][contains(@style, 'block')]//li[./div[text()='${text}']]`), `Square ${text} label`)
  },
  getCheckedSquareLabel () {
    return new Label(By.xpath(`//div[contains(@class, 'filter')][contains(@style, 'block')]//li[contains(@class, 'yes')]`), `Checked Square label`)
  },
  getClearCurrentFiltersLabel () {
    return new Label(By.xpath(`//div[contains(@class, 'panels-reset')]`), `Reset Filter label`)
  },
  getLoadingLabel () {
    return new Label(By.className('panels-top-button report-header-button waiting'), 'Loading label')
  },
}

class SlideFilters extends BasePage {

  async filterByBathrooms () {
    await elem.getFilterBlockLabel('Bathrooms').clickElement()
    while (await elem.getCheckedSquareLabel().isElementPresent()) {
      await elem.getCheckedSquareLabel().clickElement()
    }
    for (let i = 0; i < arguments.length; i++) {
      await elem.getSquareByTextLabel(arguments[i].toLowerCase()).clickElement()
    }
    await resultsCommon.switchToListings()
  }

  async getBathroomsSelected () {
    await elem.getFilterBlockLabel('Bathrooms').clickElement()
    let selected
    if (await elem.getCheckedSquareLabel().isElementPresent()) {
      selected = await elem.getCheckedSquareLabel().getAllElementsText()
    }
    else {
      selected = []
    }
    await resultsCommon.switchToListings()
    return selected
  }

  async resetShowMeFilters () {
    await elem.getPlusButton().clickElement()
    await this.clickClearCurrentFilters()
  }

  async clickClearCurrentFilters () {
    await elem.getClearCurrentFiltersLabel().clickElement()
  }

  async deleteFilter (filter) {
    await elem.getFilterBlockLabel(filter).clickElement()
    await elem.getFilterBlockLabel(filter).mouseOverElement()
    await elem.getDeleteFilterBlockButton(filter).clickElement()
  }

}

module.exports = SlideFilters