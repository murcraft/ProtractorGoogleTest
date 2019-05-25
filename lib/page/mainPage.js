'use strict'

let BasePage = require('./basePage')
let LoginPage = require('./loginPage')
let ResultsCommon = require('./pdfs/resultsCommon')

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
    await browser.get('/accounts/sign_out')
    await browser.sleep(1000)
    await new BasePage().waitForLoadPage()
  }

  async clickSignIn () {
    await el.getSignInButton().clickElement()
  }

}

module.exports = MainPage