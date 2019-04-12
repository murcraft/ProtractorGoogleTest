'use strict'

let SearchPage = require('../../page/searchPage')
let OnBoardingPage = require('../../page/lego/onBoardingPage')
let MainHeaderPage = require('../../page/lego/privatePages/mainHeaderPage')
let SupportHeaderPage = require('../../page/lego/privatePages/supportHeaderPage')
let BuildingsInstructionsPage = require('../../page/lego/privatePages/buildingsInstructionsPage')
let BasePage = require('../../page/basePage')

describe('Test searching on Google', () => {

  let searchPage = new SearchPage()
  let onBoardingPage = new OnBoardingPage()
  let mainHeaderPage = new MainHeaderPage()
  let supportHeaderPage = new SupportHeaderPage()
  let buildingsInstructionsPage = new BuildingsInstructionsPage()

  let searchInstruction = '10666'

  beforeAll(async () => {
    await searchPage.navigateLego()
  })

  it('open main page and download file', async () => {
    await BasePage.WriteInNewFile(searchInstruction, 'instruction.txt')
    let titleOfSearchingPage = await searchPage.getPageTitle()
    await onBoardingPage.clickExploreButton()
    await mainHeaderPage.navigateToSupportLink()
    await supportHeaderPage.navigateToBuildingInstructionsLink()
    await buildingsInstructionsPage.setTextInSearchField(searchInstruction)
    let fileName = await buildingsInstructionsPage.clickDownloadPdf()
    console.log(fileName)
    await BasePage.WaitDownloadedFile(fileName)
  })

})