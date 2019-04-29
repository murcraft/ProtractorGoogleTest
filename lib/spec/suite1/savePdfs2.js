'use strict'

let ListingsView = require('../../page/pdfs/listingView')
let ResultsCommon = require('../../page/pdfs/resultsCommon')
let ListingDetailsModal = require('../../page/pdfs/listingDetailsModal')
let MainPage = require('../../page/mainPage')
let ShareModal = require('../../page/pdfs/shareModal')
let keyVariables = require('../../../keyVariables.js')

describe('PDFs - 276 Sothebys Share Tag CMA Rentals: ', () => {

  let resultsCommon = new ResultsCommon()
  let listingsView = new ListingsView()
  let listingDetailsModal = new ListingDetailsModal()
  let shareModal = new ShareModal()

  beforeAll(async () => {
    await MainPage.SignOutAndLoginAs(keyVariables.sothEmail, keyVariables.sothPass)
  })

  it('download listing', async () => {
    await resultsCommon.switchToListings()
    await resultsCommon.startNewSearch()
    await listingsView.openListingByNumber(2)
    await listingDetailsModal.clickReportsButton()
    await shareModal.selectReportType('CMA')
    await shareModal.clickNextButton()
    await shareModal.clickNextButton()
    await shareModal.clickDownload()
    await ShareModal.WaitForFileToBeDownloaded(`cma_report1.pdf`)
    await ShareModal.RenameAndCopyFile(`cma_report.pdf`, `SOTHEBYS_details_rentals`)
  })

  it('download listing', async () => {
    await resultsCommon.switchToListings()
    await resultsCommon.startNewSearch()
    await listingsView.openListingByNumber(3)
    await listingDetailsModal.clickReportsButton()
    await shareModal.selectReportType('CMA')
    await shareModal.clickNextButton()
    await shareModal.clickNextButton()
    await shareModal.clickDownload()
    await ShareModal.WaitForFileToBeDownloaded(`cma_report1.pdf`)
    await ShareModal.RenameAndCopyFile(`cma_report.pdf`, `SOTHEBYS_details_rentals`)
  })

  it('download listing', async () => {
    await resultsCommon.switchToListings()
    await resultsCommon.startNewSearch()
    await listingsView.openListingByNumber(4)
    await listingDetailsModal.clickReportsButton()
    await shareModal.selectReportType('CMA')
    await shareModal.clickNextButton()
    await shareModal.clickNextButton()
    await shareModal.clickDownload()
    await ShareModal.WaitForFileToBeDownloaded(`cma_report1.pdf`)
    await ShareModal.RenameAndCopyFile(`cma_report.pdf`, `SOTHEBYS_details_rentals`)
  })

  it('download listing', async () => {
    await resultsCommon.switchToListings()
    await resultsCommon.startNewSearch()
    await listingsView.openListingByNumber(4)
    await listingDetailsModal.clickReportsButton()
    await shareModal.selectReportType('CMA')
    await shareModal.clickNextButton()
    await shareModal.clickNextButton()
    await shareModal.clickDownload()
    await ShareModal.WaitForFileToBeDownloaded(`cma_report1.pdf`)
    await ShareModal.RenameAndCopyFile(`cma_report.pdf`, `SOTHEBYS_details_rentals`)
  })

})