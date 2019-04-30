#!/usr/bin/env node

let specsArray = require('./lib/helpers/specHelper')
let protractorFlake = require('protractor-flake')

let protractorArgs = process.argv.splice(2)

let idArray = protractorArgs[1].match(/\d+/g)
let nLength = idArray.length
let specsArg = '--specs='

for (let i = 0; i < nLength; i++) {
  let script = specsArray[idArray[i]]
  if (script === undefined) {
    console.log(`Unknown test id ${idArray[i]}`)
    continue
  } else {
    console.log(`Found test by id ${idArray[i]}: ${script}`)
  }
  specsArg = `${specsArg}${specsArray[idArray[i]]},`
}
specsArg = specsArg.slice(0, -1)

let newProtractorArgs = [protractorArgs[0], specsArg]

protractorFlake({
  maxAttempts: 1,
  parser: 'standard',
  nodeBin: 'node',
  color: 'magenta',
  protractorArgs: newProtractorArgs
}, function (status) {
  process.exit(status)
})

