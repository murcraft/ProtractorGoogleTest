'use strict'

let fs = require('fs')
let path = require('path')

const keyVar = require('../../keyVariables.js')
let RandomHelper = require('../helpers/randomHelper')

const timeout = browser.params.waitTimeout
let tempDownloadsPath = keyVar.downloadPath
let writeDir = keyVar.writeDir
let currDir = keyVar.currPath

class BasePage {

  static async WaitDownloadedFile (fileName, timeoutMs = 30000) {
    console.log(currDir)
    await new BasePage().waitForLoadPage()
    let pathFile = path.resolve(tempDownloadsPath, fileName)
    await Logger.debug(`Waiting for file ${pathFile} to be downloaded`)

    await browser.wait(async function () {
      await browser.sleep(500)
      return await fs.existsSync(pathFile)
    }, timeoutMs).catch(async (e) => {
      await Logger.debug(`Existing files:`)
      await fs.readdirSync(tempDownloadsPath).forEach(file => {
        Logger.debug(file)
      })
      await Logger.error(`File ${fileName} is not downloaded within ${timeoutMs / 1000}sec\n${e}`)
      throw `File ${fileName} is not downloaded within ${timeoutMs / 1000}sec`
    })
  }

  static async WriteInNewFile (data, fileName) {
    if (!fs.existsSync(writeDir)) {
      fs.mkdirSync(writeDir)
    }
    let ext = path.extname(fileName)
    let name = path.basename(fileName, ext)

    let newName = `${RandomHelper.GetRandomString(name)}${ext}`
    let pathFile = await path.resolve(writeDir, newName)
    await Logger.debug(`Waiting for file ${pathFile} to be writing`)

    let writeStream = fs.createWriteStream(pathFile)
    writeStream.write(Buffer.from(data, 'utf-8'))
    try {
      writeStream.on('finish', () => {
        Logger.debug(`File ${newName} has written to ${pathFile}`)
        writeStream.end()
      })
    } catch (e) {
      Logger.error(`File ${newName} hasn't written`)
      throw e.message
    }
    return pathFile
  }

  static async WriteLogsInFile (text, fileName) {
    let currentTime = RandomHelper.GetDateTimeString()
    let data = `[${currentTime}] - ${text}`
    let pathFile = await path.resolve(writeDir, fileName)
    fs.open(pathFile, 'a', (err, fd) => {
      if (err) throw err
      fs.appendFile(fd, data, 'utf8', (err) => {
        fs.close(fd, (err) => {
          if (err) throw err
        })
        if (err) throw err
      })
    })
  }

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

}

module.exports = BasePage