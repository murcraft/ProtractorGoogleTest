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
    if (BrowserName === 'safari') {
      jasmine.getEnv().addReporter(new function () {
        try {
          browser.takeScreenshot().then(function (png) {
            allure.createAttachment('Screenshot', function () {
              return Buffer.from(png, 'base64')
            }, 'image/png')()
          })
        } catch (e) {
          Logger.error(`Screen shot was not taken\n${e}`)
        }
      })
      await browser.refresh()
      try {
        await browser.manage().logs().get('browser')
      } catch (e) {
      }
      await browser.get('/accounts/sign_out')
      await Logger.debug('Get accounts/sign_out')
        jasmine.getEnv().addReporter(new function () {
          try {
            browser.takeScreenshot().then(function (png) {
              allure.createAttachment('Screenshot', function () {
                return Buffer.from(png, 'base64')
              }, 'image/png')()
            })
          } catch (e) {
            Logger.error(`Screen shot was not taken\n${e}`)
          }
        })
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