#!/usr/bin/env node
'use strict'

let protractorFlake = require('protractor-flake')
let customParser = require('./parser')

let getParamValue = function (param) {
  let value = undefined
  let npmArgs = process.argv
  let arg = npmArgs.filter((n) => {
    return n.includes(param)
  })
  if (arg.length > 0) {
    value = arg[0].substr(arg[0].indexOf('=') + 1)
  }
  return value
}

let suiteCmd = getParamValue('suite')
process.env.suite = suiteCmd !== undefined ? suiteCmd : process.env.suite
process.env.suite = process.env.suite !== 'undefined' ? process.env.suite : 'all'
console.log(`suite - ${process.env.suite}`)

let logLevelCmd = getParamValue('logLevel')
process.env.logLevel = logLevelCmd !== undefined ? logLevelCmd : process.env.logLevel
process.env.logLevel = process.env.logLevel !== 'undefined' ? process.env.logLevel : 'info'
console.log(`logLevel - ${process.env.logLevel}`)

let isPostToSlackCmd = getParamValue('isPostToSlack')
process.env.isPostToSlack = isPostToSlackCmd !== undefined ? isPostToSlackCmd : process.env.isPostToSlack
process.env.isPostToSlack = process.env.isPostToSlack !== 'undefined' ? process.env.isPostToSlack : 'false'
console.log(`isPostToSlack - ${process.env.isPostToSlack}`)

let isCleanAllureCmd = getParamValue('isCleanAllure')
process.env.isCleanAllure = isCleanAllureCmd !== undefined ? isCleanAllureCmd : process.env.isCleanAllure
process.env.isCleanAllure = process.env.isCleanAllure !== 'undefined' ? process.env.isCleanAllure : 'false'
console.log(`isCleanAllure - ${process.env.isCleanAllure}`)

let maxinstancesCmd = getParamValue('maxinstances')
process.env.maxinstances = maxinstancesCmd !== undefined ? maxinstancesCmd : process.env.maxinstances
process.env.maxinstances = process.env.maxinstances !== 'undefined' ? process.env.maxinstances : 1
console.log(`maxinstances - ${process.env.maxinstances}`)

let protractorArgs = []
process.env.maxAttempts = 2

protractorArgs.push('conf.js')
let suiteArg = `--suite=${process.env.suite}`

protractorArgs.push(suiteArg)
protractorArgs.push('--capabilities.chromeOptions.args=incognito')
protractorArgs.push('--capabilities.chromeOptions.args=window-size=1920,1080')
// protractorArgs.push('--capabilities.chromeOptions.args=headless')
protractorArgs.push('--capabilities.chromeOptions.args=disable-gpu')

console.log(protractorArgs)

protractorFlake({
  maxAttempts: process.env.maxAttempts,
  parser: customParser,
  nodeBin: 'node',
  color: 'magenta',
  protractorArgs: protractorArgs
}, function (status) {
  process.exit(status)
})
