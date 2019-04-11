let path = require('path')

module.exports = {
  browserParam: process.env.browser,

  downloadPath: path.resolve(__dirname, './artifacts/temporary'),
  storePath: path.resolve(__dirname, './artifacts/storeFiles'),
  writeDir: path.resolve(__dirname, './artifacts/storeFiles'),
  currPath: path.resolve(__dirname, './'),

  logLevel: process.env.logLevel,
  isPostToSlack: process.env.isPostToSlack,
  isCleanAllure: process.env.isCleanAllure,

  awsBucket: `helen.kuz-bucket`,
  awsRegion: `us-east-2`,
  awsAccessKey: process.env.ARTIFACTS_KEY,
  awsSecretKey: process.env.ARTIFACTS_SECRET,

  slackWebHook: process.env.SLACK_WEB_HOOK,
  slackChannel: '#slacktest',
  slackUsername: 'ogulikpuse',

  useEmail: process.env.userEmail,
  userPass: process.env.userPass,

  awsPath: `https://us-east-2.amazonaws.com/helen-bucket-test1991/`,
  awsDownloadsPath: `${process.env.TRAVIS_BUILD_NUMBER}/${process.env.TRAVIS_JOB_NUMBER}/results/pdfs`,

  sothEmail: `soth_ag@perchwell.com`,
  sothPass: `Password@123`
}