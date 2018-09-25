'use strict'
let SearchPage = require('../lib/page/searchPage')
let ResultsPage = require('../lib/page/resultsPage')
let using = require('jasmine-data-provider')
let dataTest = require('../lib/data/testData.json')

let searchPage
let resultsPage

describe('Test searching on Google', function () {

  beforeAll(async function () {
    searchPage = new SearchPage()
  })

  using(dataTest, function (data) {

    it('Open main page and verify title', async function () {
      await searchPage.navigate()
      let titleOfSearchingPage = await searchPage.getPageTitle()
      await expect(titleOfSearchingPage.toLowerCase()).toEqual(data.title, 'Title of searching page')
    })

    it('Search for keyword and verify title of results page', async function () {
      await searchPage.enterRequiredWord(data.request)
      resultsPage = await new ResultsPage()
      let titleOfResultsPage = await resultsPage.getResultsTitle(data.request)
      await expect(titleOfResultsPage.toLowerCase()).toContain(data.request, 'Title of results page')
    })

    it('Check the page headers for matching the requested word',
      async function () {
        let titles = await resultsPage.getResulsHeaders()
        titles.forEach(async value => {
          await expect(value.toLowerCase()).toMatch(data.request, 'The requested word')
        })
      })

    it('Search for total results and check that this number is more than min',
      async function () {
        let totalResults = await resultsPage.getNumberOfResults()
        await expect(totalResults).toBeGreaterThan(Number.parseInt(data.count), 'Min number of results')
      })

  })

})
