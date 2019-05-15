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

  async openMainPage() {
    await browser.get(browser.params.legoUrl)
  }

  async clickSignIn () {
    await el.getSignInButton().clickElement()
  }

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
      try {
        await browser.takeScreenshot().then(function (png) {
          allure.createAttachment('Screenshot', function () {
            return Buffer.from(png, 'base64')
          }, 'image/png')()
        })
      } catch (e) {
        Logger.error(`Screen shot was not taken\n${e}`)
      }
      await browser.refresh()
      try {
        await browser.takeScreenshot().then(function (png) {
          allure.createAttachment('Screenshotrefresh', function () {
            return Buffer.from(png, 'base64')
          }, 'image/png')()
        })
      } catch (e) {
        Logger.error(`Screen shot was not taken\n${e}`)
      }
      try {
        await browser.manage().logs().get('browser')
        await browser.get('/accounts/sign_out')
        try {
          await browser.takeScreenshot().then(function (png) {
            allure.createAttachment('Screenshotget', function () {
              return Buffer.from(png, 'base64')
            }, 'image/png')()
          })
        } catch (e) {
          Logger.error(`Screen shot was not taken\n${e}`)
        }
      } catch (e) {
        Logger.debug('Cannot get sourse page')
      }

    } else {
      await browser.get('/accounts/sign_out')
    }
    await new BasePage().waitForLoadPage()
  }

}

module.exports = MainPage