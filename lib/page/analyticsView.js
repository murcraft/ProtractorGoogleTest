'use strict'

let BasePage = require('./basePage')

let Label = require('../elements/label')
let Button = require('../elements/button')

let elem = {
  getAddAChartButton () {
    return new Button(By.css('.chart-area.icon-chart-new'), 'Add a chart button')
  },

  getTabByName (name) {
    return new Label(By.xpath(`//ul[@class='chart-sets uncharted open']/li[contains(@class, 'chart-set')]/span[text()='${name}']`), `Tab '${name}' label`)
  },
  getChartByType (type) {
    return new Label(By.xpath(`//div[@class='chart-time-frame open']/div[contains(@class, 'chart-time-selector')][.//span[text()='${type}']]`), `Chart type '${type}' label`)
  },
  getPickByValue (value, number) {
    return new Label(By.xpath(`(//div[contains(@class, 'chart-type-menu')][contains(@class, 'open')]//div[contains(@class, 'tab-contents')][contains(@class, 'open')]//div[text()='${value}'])[${number}]`), `Pick '${value}(${number})' label`)
  },
  getChartTotalLabel () {
    return new Label(By.className(`total`), `Chart total label`)
  },
}

class Analytics extends BasePage {

  async addChart (type, tab, pick, number) {
    await this.clickAddChartButton()
    await elem.getChartByType(type.toLowerCase()).clickElement()
    await elem.getTabByName(tab).clickElement()
    number = number === undefined ? 1 : number
    await elem.getPickByValue(pick, number).clickElement()
  }

  async clickAddChartButton () {
    await elem.getAddAChartButton().clickElement()
  }

  async getChartTotal () {
    let resStr = await elem.getChartTotalLabel().getElementText()
    await browser.sleep(1000)
    return await parseInt(resStr.replace(',', ''))
  }
}

module.exports = Analytics