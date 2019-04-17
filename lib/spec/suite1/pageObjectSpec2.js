'use strict'

let using = require('jasmine-data-provider')
let SearchPage = require('../../page/searchPage')
let ResultsPage = require('../../page/resultsPage')

let searchPage = new SearchPage()
let resultsPage = new ResultsPage()

let dataTest = require('../../data/testData.json')

describe('Test searching on Google', () => {

  using(dataTest, async (data) => {

    it('Open main page and verify title', async () => {
      await searchPage.navigateGoogle()
      let titleOfSearchingPage = await searchPage.getPageTitle()
      await expect(titleOfSearchingPage.toLowerCase()).toEqual(data.title, 'Title of searching page')
    })

    it('Search for keyword and verify title of results page', async () => {
      await searchPage.enterRequiredWord(data.request)
      let titleOfResultsPage = await resultsPage.getPageTitle()
      await expect(titleOfResultsPage.toLowerCase()).toContain(data.request, 'Title of results page')
    })

    it('Check the page headers for matching the requested word', async () => {
        let titles = await resultsPage.getResultlsHeaders()
        for (let i =0; i < titles.length; i++) {
          expect(titles[i].toLowerCase()).toMatch(data.request, 'The requested word')
        }
      })

    it('Search for total results and check that this number is more than min', async () => {
        let totalResults = await resultsPage.getNumberOfResults()
        await expect(totalResults).toBeGreaterThan(Number.parseInt(data.count), 'Min number of results')
      })

  })

})
