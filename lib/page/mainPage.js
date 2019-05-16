'use strict'

let BasePage = require('./basePage')
let LoginPage = require('./loginPage')
let ResultsCommon = require('./pdfs/resultsCommon')
const child_process = require('child_process')

let Button = require('../elements/button')

let resultsCommon = new ResultsCommon()

let loginPage = new LoginPage()

let el = {
  getSignInButton () {
    return new Button(By.className('button professionals sign-in'), 'Sign in button')
  }
}

class MainPage extends BasePage {

  static async SignOutAndLoginAs (email, pass) {
    await this.SignOut()
    await new MainPage().clickSignIn()
    await loginPage.loginAs(email, pass)
    await resultsCommon.completeOnboardingIfPresent()
  }

  static async SignOut () {
    await new BasePage().waitForLoadPage()
    await Logger.debug('Signing out')
    if (BrowserName === 'safari') {
      let tm = Math.floor((Math.random() * 10000) + 100)
      child_process.execSync(`screencapture -t jpg artifacts/screen${tm}.jpg`)
      await browser.refresh()
      try {
        await browser.manage().logs().get('browser')
      } catch (e) {
        Logger.warn('Cannot get browser logs')
      }
      child_process.execSync(`screencapture -t jpg artifacts/screen${tm + 1}.jpg`)
      await browser.get('/accounts/sign_out')
      await Logger.debug('Get accounts/sign_out')
      child_process.execSync(`screencapture -t jpg artifacts/screen${tm + 2}.jpg`)
    } else {
      await browser.get('/accounts/sign_out')
    }
    await new BasePage().waitForLoadPage()
  }

  async openMainPage () {
    await browser.get(browser.params.legoUrl)
  }

  async clickSignIn () {
    await el.getSignInButton().clickElement()
  }

}

module.exports = MainPage