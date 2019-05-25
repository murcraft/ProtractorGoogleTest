'use strict'

let BasePage = require('./basePage')
let Button = require('../elements/button')
let Label = require('../elements/label')
let TextBox = require('../elements/textBox')

let elem = {
  getPageHeaderLabel () {
    return new Label(By.css('.ui-modals-title'), 'Login page header title label')
  },
  getEmailTextBox () {
    return new TextBox(By.name('user[email]'), 'Email textBox')
  },
  getPasswordTextBox () {
    return new TextBox(By.name('user[password]'), 'Password textBox')
  },
  getLoginButton () {
    return new Button(By.id('login-submit'), 'Login button')
  },
  getLoginWithGoogleButton () {
    return new Button(By.xpath(`//a[contains(@class, 'google')]`), 'Login With Google button')
  },
  getResetPassLabel () {
    return new Label(By.xpath(`//a[@data-view='ForgotPasswordView']`), 'Reset pass label')
  }
}

class LoginPage extends BasePage {

  async clickLogin () {
    await elem.getLoginButton().clickElement()
  }

  async setEmail (email) {
    await elem.getEmailTextBox().clearSendKeys(email)
  }

  async setPassword (password) {
    await elem.getPasswordTextBox().clearSendKeysPass(password)
  }

  async loginAs (userEmail, pass) {
    await this.setEmail(userEmail)
    await this.setPassword(pass)
    await this.clickLogin()
  }
}

module.exports = LoginPage