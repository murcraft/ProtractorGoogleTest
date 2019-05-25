'use strict'

let BasePage = require('../basePage')

let Button = require('../../elements/button')
let Label = require('../../elements/label')

let elem = {
  getReportTypeLabel (reportType) {
    return new Label(By.xpath(`(//div[@class='select-report-button-label'][normalize-space(.) ='${reportType}'])`), `Report Type ${reportType}`)
  },

  getDownloadButton () {
    return new Button(By.xpath(`//*[contains(text(), 'DOWNLOAD')]`), 'Download button')
  },
  getNextButton () {
    return new Button(By.className(`create-report-nav-next`), 'Next button')
  },
  getPrintButton () {
    return new Button(By.xpath(`//*[contains(text(), 'PRINT')]`), 'PRINT button')
  }
}

class ShareModal extends BasePage {

  async clickDownload () {
    await elem.getDownloadButton().clickElementWithScrolling()
  }

  async clickPrint () {
    await elem.getPrintButton().clickElementWithScrolling()
    await super.waitForLoadPage()
  }

  async selectReportType (reportType) {
    await elem.getReportTypeLabel(reportType).clickElement()
  }


  async clickNextButton () {
    await elem.getNextButton().clickElement()
  }

}

module.exports = ShareModal