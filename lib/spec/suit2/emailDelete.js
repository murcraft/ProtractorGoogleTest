'use strict'

let GooglePage = require('../../page/googlePage')
// let EmailPage = require('../../page/emailPage')
let creds = require('../../data/creds.js')

let googlePage = new GooglePage()
// let emailPage = new EmailPage()

xdescribe('Test searching on Google', () => {

  beforeAll(async () => {
  })

  it('Log in Google', async () => {
    await googlePage.goTo(browser.params.page.startPage)
    await googlePage.setEmailTexBox(creds.email)
    await googlePage.setPassTexBox(creds.pass)
    await browser.wait(3000)
  })

})
