'use strict'

let fs = require('fs')
let path = require('path')

let keyVar = require('../../keyVariables.js')

const timeout = browser.params.waitTimeout
let tempDownloadsPath = keyVar.downloadPath
let writeDir = keyVar.writeDir
let currDir = keyVar.currPath
let storePath = keyVar.storePath

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
    await new BasePage().waitForLoadPage()
    if (!fs.existsSync(writeDir)) {
      fs.mkdirSync(writeDir)
    }
    let pathFile = await path.resolve(writeDir, fileName)
    await Logger.debug(`Waiting for file ${pathFile} to be writing`)

    let writeStream = fs.createWriteStream(pathFile)
    writeStream.write(Buffer.from(data, 'utf-8'))
    try {
      writeStream.on('finish', () => {
        Logger.debug(`File ${fileName} has written to ${pathFile}`)
        writeStream.end()
      })
    } catch (e) {
      Logger.error(`File ${fileName} hasn't written`)
      throw e.message
    }
  }

  async navigate (targetUrl) {
    await Logger.debug(`Navigate to ${targetUrl}`)
    browser.get(targetUrl)
  }

  async goTo (url) {
    // await Logger.debug(`Navigate to ${url}`)
    browser.get(url)
  }

  async getPageTitle () {
    await Logger.debug(`Getting page title`)
    return browser.getTitle()
  }

  // async waitForLoadPage () {
  //   try {
  //     let loading = async function () {
  //       await browser.sleep(250)
  //       return (await browser.executeScript('return document.readyState') === 'complete')
  //     }
  //     await browser.wait(loading, (timeout))
  //   }
  //   catch (e) {
  //     await Logger.error(`Page is not loaded within ${timeout / 1000} sec`)
  //     throw `Page is not loaded within ${timeout / 1000} sec`
  //   }
  //
  //   try {
  //     let addv = By.id('ipeL124035')
  //     let advWIndow = element(addv)
  //     if (await advWIndow.isPresent) {
  //       await element(By.xpath(`//map[@name='IPEMap']/area[@alt='No']`)).click()
  //       await Logger.debug(`Close find more message`)
  //     }
  //   } catch (e) {
  //   }
  //
  //   try {
  //     let closeCookies = By.className('l-accept__close js-accept__close')
  //     let closeCookiesButton = element(closeCookies)
  //     if (await closeCookiesButton.isPresent) {
  //       await closeCookiesButton.click()
  //       await Logger.debug(`Close cookie message`)
  //     }
  //   } catch (e) {
  //   }
  // }

  async waitForLoadPage () {
    let link = await browser.getCurrentUrl()
    Logger.debug('Wait for page load: ' + link)
      try {
        await browser.switchTo().alert().accept()
        await Logger.debug(`Accepted alert`)
      }
      catch (e) {
      }
     try {
      let isLoaded = async function () {
        await browser.sleep(250)
        return (await browser.executeScript('return document.readyState') === 'complete') && (await browser.executeScript('return jQuery.active') === 0)
      }
      await browser.wait(isLoaded, (timeout))
    }
    catch (e) {
      await Logger.error(`Page is not loaded within ${timeout / 1000} sec`)
      throw `Page is not loaded within ${timeout / 1000} sec`
    }
    try {
      let loc = By.className('appcues-tooltip-container align-bottom')
      let frame = element(loc)
      if (await frame.isPresent()) {
        await browser.switchTo().frame(await browser.driver.findElement(loc))
        await element(By.className(`exit-tooltip`)).click()
        await browser.switchTo().defaultContent()
        await Logger.debug(`Closed Appcues`)
      }
    }
    catch (e) {
      await Logger.debug(e)
      await browser.switchTo().defaultContent()
    }

    try {
      let loc = By.xpath(`//appcues-checklist/iframe`)
      let frame = element(loc)
      if (await frame.isPresent() && await frame.isDisplayed()) {
        await browser.switchTo().frame(await browser.driver.findElement(loc))
        let buttonLoc = By.className('minimize')
        let button = element(buttonLoc)

        if (await button.isPresent() && await button.isDisplayed()) {
          await element(buttonLoc).click()
          await Logger.debug(`Hidden Get started pop-up`)
        }
        await browser.switchTo().defaultContent()
      }
    }
    catch (e) {
      await browser.switchTo().defaultContent()
    }

    try {
      let loc = By.xpath(`//appcues-container/iframe`)
      let frame = element(loc)

      if (await frame.isPresent() && await frame.isDisplayed()) {
        await browser.switchTo().frame(await browser.driver.findElement(loc))
        let buttonLoc = By.className('close-icon')
        let button = element(buttonLoc)

        if (await button.isPresent() && await button.isDisplayed()) {
          await element(buttonLoc).click()
          await Logger.debug(`Closed Rating pop-up`)
        }
        await browser.switchTo().defaultContent()
      }
    }
    catch (e) {
      await browser.switchTo().defaultContent()
    }
  }

  static async WaitForFileToBeDownloaded (fileName, fileSizeKb = 40, timeoutMs = 30000) {
    await new BasePage().waitForLoadPage()
    let pathFile = await path.resolve(tempDownloadsPath, fileName)
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

  static async RenameAndCopyFile (fileName, forNewName) {
    let pathFile = await path.resolve(tempDownloadsPath, fileName)
    let ext = path.extname(fileName)
    let name = path.basename(fileName, ext)

    if (forNewName !== undefined) {
      name = `${name}_${forNewName}_`
    } else {
      name = name.replace(/\s-\s/g, '_').replace(/\s/g, '_').replace(/-/g, '_').replace(/\+/g, '_').replace(/[^\w]/g, '')
    }

    let d = new Date()
    let dateStr = d.getFullYear().toString() + (parseInt(d.getMonth()) + 1) + d.getDate() + d.getHours() + d.getMinutes() + d.getSeconds()
    let rand = + dateStr + Math.floor((Math.random() * 100) + 1)


    let newName = `${rand}${ext}`
    if (!fs.existsSync(storePath)) {
      fs.mkdirSync(storePath)
    }
    let newPathFile = await path.resolve(storePath, newName)
    await Logger.debug(`Renaming file into ${newName}`)
    await fs.copyFileSync(pathFile, newPathFile)
    await fs.unlinkSync(pathFile)
    return newPathFile
  }

}

module.exports = BasePage