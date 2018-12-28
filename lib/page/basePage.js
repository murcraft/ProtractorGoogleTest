'use strict'

const timeout = browser.params.waitTimeout

class BasePage {

  async navigate (targetUrl) {
    await Logger.debug(`Navigate to ${targetUrl}`)
    browser.get(targetUrl)
  }

  async goTo (url) {
    await Logger.debug(`Navigate to ${url}`)
    browser.get(url)
  }

  async getPageTitle () {
    await Logger.debug(`Getting page title`)
    return browser.getTitle()
  }

  async waitForLoadPage () {
    try {
      let loading = async function () {
        await browser.sleep(250)
        return (await browser.executeScript('return document.readyState') === 'complete')
      }
      await browser.wait(loading, (timeout))
    }
    catch (e) {
      await Logger.error(`Page is not loaded within ${timeout / 1000} sec`)
      throw `Page is not loaded within ${timeout / 1000} sec`
    }
  }

}

module.exports = BasePage