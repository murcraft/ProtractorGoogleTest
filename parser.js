'use strict'

// If only one spec file fails, on the next re-run, we don't get the filename on the output. So
// if it fails again, we need re-use the filename from the previous run
let fs = require('fs')
let path = require('path')

let filePath = path.resolve(__dirname, './lib/data/attempts.txt')

let previousSpecFileNames = []
let testAttempt = 1

module.exports = {

  getTestAttempt: function () {
    let str = fs.readFileSync(filePath)
    console.log(`Got attempt from file: ${str}`)
    let attempt = parseInt(str)
    return isNaN(attempt) ? 1 : attempt
  },

  parse: function (protractorTestOutput) {
    testAttempt++
    console.log(`Write attempt to file: ${testAttempt}`)
    fs.writeFileSync(filePath, testAttempt)

    if (previousSpecFileNames.length === 1) {
      return previousSpecFileNames
    }

    const lines = protractorTestOutput.split(`\n`)
    // At the end of the output there's a summary of which shards failed
    const failedLines = lines.filter(line => line.includes('I/launcher') && line.includes('failed'))

    // regex matches #number and #number-number (ie #1 or #1-1, #1-2, #1-3...)
    const testNumberRegExp = new RegExp(/#[0-9]+-[0-9]+/)

    const failedSpecsLines = failedLines.map(failedLine => {
      const match = testNumberRegExp.exec(failedLine)

      if (match) {
        // Lines with "#number-number ]" (space followed by closing bracket) and "Specs: "
        return lines.filter(line => line.includes(`${match[0]}] `) && line.includes('Specs: '))
      }

      return null
    }).reduce(function (a, b) { // Flatten the array
      return a.concat(b)
    }, [])

    const specFileNames = failedSpecsLines.filter(Boolean).map(line => {
      if (process.env.browser === 'safari') {
        const startingPathPosition = line.indexOf('/Users/travis/')
        return line.substr(startingPathPosition)
      } else {
        const startingPathPosition = line.indexOf('./')//('./home/travis/')
        return line.substr(startingPathPosition)
      }
    })

    previousSpecFileNames = specFileNames

    return specFileNames
  },

  name: 'Protractor-flake custom parser'
}