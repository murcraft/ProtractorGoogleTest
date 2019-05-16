'use strict'

let ResultsCommon = require('../../page/pdfs/resultsCommon')
let SearchHeading = require('../../page/searchPage')
let SlideFilters = require('../../page/slideFilters')
let Map = require('../../page/map')
let ListingsView = require('../../page/listingView')
let MainPage = require('../../page/mainPage')
let AnalyticsView = require('../../page/analyticsView')

let keyVariables = require('../../../keyVariables.js')

describe('Filters1 - 161 Filter By Bathrooms: ', () => {

  let resultsCommon = new ResultsCommon()
  let searchHeading = new SearchHeading()
  let slideFilters = new SlideFilters()
  let map = new Map()
  let listingsView = new ListingsView()
  let analyticsView = new AnalyticsView()

  let resultsCountInitial
  let resultsCount

  it('start', async () => {
    await MainPage.SignOutAndLoginAs(keyVariables.sothEmail, keyVariables.sothPass)
    await resultsCommon.switchToListings()
    await resultsCommon.startNewSearch()
  })

  it('listing view: filter by 1 bathroom', async () => {
    resultsCountInitial = await searchHeading.getResultsCount()
    await slideFilters.filterByBathrooms('1')
    let arr = await listingsView.getAllListingsBathroomsArr()
    let arrLength = arr.length
    for (let i = 0; i < arrLength - 1; i++) {
      await expect(arr[i]).toEqual('1')
    }
    resultsCount = await searchHeading.getResultsCount()
    let mapCount = await map.getTotalCount()
    await expect(mapCount).toEqual(resultsCount, 'Map count and heading count are different')
    await expect(resultsCount).not.toEqual(resultsCountInitial, 'Results count left the same')
    await expect(resultsCommon.getBubbleLabelText()).toEqual(['1 BA'], 'Filter on bubble view is not correct')
  })

  it('analytics view: verify value with 1 bathroom', async () => {
    await resultsCommon.switchToAnalytics()
    await analyticsView.addChart('listings', 'MKT SHARE', 'Price')
    await expect(analyticsView.getChartTotal()).toEqual(resultsCount, 'Chart count and results count are different')
    await expect(resultsCommon.getBubbleLabelText()).toEqual(['1 BA'], 'Filter on bubble view is not correct')
  })

  it('listing view: reset filter and compare results', async () => {
    await resultsCommon.switchToListings()
    await slideFilters.resetShowMeFilters()
    resultsCount = await searchHeading.getResultsCount()
    await expect(resultsCount).toEqual(resultsCountInitial, 'Results count are different after resetting the filter')
    let mapCount = await map.getTotalCount()
    await expect(mapCount).toEqual(resultsCountInitial, 'Map count and heading count are different')
    let filterValue = await slideFilters.getBathroomsSelected()
    await expect(filterValue).toEqual([], 'Some filters are still selected')
    await expect(resultsCommon.isBubbleLabelDisplayed()).toBe(false, 'Bubble view is displayed')
  })

  it('analytics view: check results after resetting', async () => {
    await resultsCommon.switchToAnalytics()
    await expect(analyticsView.getChartTotal()).toEqual(resultsCountInitial, 'Chart count has changed')
    await expect(resultsCommon.isBubbleLabelDisplayed()).toBe(false, 'Bubble view is displayed')
  })

  it('listing view: delete bathrooms column and check', async () => {
    await resultsCommon.switchToListings()
    await slideFilters.filterByBathrooms('1')
    await expect(resultsCommon.getBubbleLabelText()).toEqual(['1 BA'], 'Filter on bubble view is not correct')
    await slideFilters.deleteFilter('Bathrooms')
    await expect(resultsCommon.isBubbleLabelDisplayed()).toBe(false, 'Bubble view is displayed')
  })

})