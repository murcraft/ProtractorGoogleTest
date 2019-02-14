'use strict'

let fs = require('fs')
let path = require('path')

const timeout = browser.params.waitTimeout
let downloadPath = browser.params.downloadPath

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

    try {
      let addv = By.id('ipeL124035')
      let advWIndow = element(addv)
      if (await advWIndow.isPresent) {
        await element(By.xpath(`//map[@name='IPEMap']/area[@alt='No']`)).click()
        await Logger.debug(`Close find more message`)
      }
    } catch (e) {
    }

    try {
      let closeCookies = By.className('l-accept__close js-accept__close')
      let closeCookiesButton = element(closeCookies)
      if (await closeCookiesButton.isPresent) {
        await closeCookiesButton.click()
        await Logger.debug(`Close cookie message`)
      }
    } catch (e) {
    }
  }

  static async WaitDownloadedFile (fileName, timeoutMs = 30000) {
    await new BasePage().waitForLoadPage()
    let pathFile = await path.resolve(downloadPath, fileName)
    await Logger.debug(`Waiting for file ${pathFile} to be downloaded`)

    await browser.wait(async function () {
      await browser.sleep(500)
      return await fs.existsSync(pathFile)
    }, timeoutMs).catch(async (e) => {
      await Logger.debug(`Existing files:`)
      await fs.readdirSync(downloadPath).forEach(file => {
        Logger.debug(file)
      })
      await Logger.error(`File ${fileName} is not downloaded within ${timeoutMs / 1000}sec\n${e}`)
      throw `File ${fileName} is not downloaded within ${timeoutMs / 1000}sec`
    })
  }

}

module.exports = BasePage