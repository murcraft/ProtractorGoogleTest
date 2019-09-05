'use strict'

let BasePage = require('./basePage')

let Label = require('../elements/label')
let Button = require('../elements/button')

let elem = {
  getMapMarkerByText (numberText) {
    return new Label(By.xpath(`//*[@class='map-marker'][.//*[text()='${numberText}']]`), `Map marker ${numberText} label`)
  },
  getMapMarkerAll () {
    return new Label(By.xpath(`//*[name()='svg'][@class='map-marker']`), `Map marker all label`)
  },
  getPopupLabel () {
    return new Label(By.id(`details-map-tooltip`), `Popup label`)
  },
  getLoadingLabel () {
    return new Label(By.className('icon-flipping-logo smaller padded'), 'Loading label')
  },
  getHideMapButton () {
    return new Button(By.xpath(`//div[contains(@class, 'hide-map-icon')]`), 'Hide map button')
  },
  getSideBarLabel () {
    return new Label(By.id(`sidebar`), `Sidebar label`)
  }
}

class Map extends BasePage {

  async clickMapMarker (numberText) {
    await this.openMapView()
    await elem.getMapMarkerByText(numberText).clickElement()
    await elem.getLoadingLabel().waitForIsNotPresent()
  }

  async isPopupPresent () {
    return await elem.getPopupLabel().isElementPresent()
  }

  async getMarkersTextArray () {
    await this.openMapView()
    return await elem.getMapMarkerAll().getAllElementsText()
  }

  async getTotalCount () {
    await this.openMapView()
    let pointsArr = await this.getMarkersTextArray()
    let intArr = []
    await pointsArr.map((x) => {
      x = x.replace(',', '')
      if (!isNaN(parseInt(x))) {
        intArr.push(x)
      }
    })
    let count = await intArr.reduce((accumulator, currentValue) => {
      return parseInt(accumulator) + parseInt(currentValue)
    })
    return await parseInt(count)
  }

  async openMapView () {
    let className = await elem.getSideBarLabel().getElementAttribute('class')
    if(await className.includes('short')) {
      await elem.getHideMapButton().clickElement()
    }
  }

}

module.exports = Map