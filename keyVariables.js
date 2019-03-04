let path = require('path')

module.exports = {

  downloadPath: path.resolve(__dirname, './artifacts/temporary'),
  storePath: path.resolve(__dirname, './artifacts/storeFiles'),
  writeDir: path.resolve(__dirname, './artifacts/storeFiles'),
  currPath: path.resolve(__dirname, './'),

  logLevel: process.env.logLevel,
  isPostToSlack: process.env.isPostToSlack,
  isCleanAllure: process.env.isCleanAllure,

  awsBucket: `helen.kuz-bucket`,
  awsRegion: `us-west-2`,
  awsAccessKey: process.env.ARTIFACTS_KEY,
  awsSecretKey: process.env.ARTIFACTS_SECRET,

  slackWebHook: process.env.SLACK_WEB_HOOK,
  slackChannel: '#slacktest',
  slackUsername: 'ogulikpuse',

  userEmail: process.env.userEmail,
  userPass: process.env.userPass,

  awsPath: `https://helen.kuz-bucket.s3-us-west-2.amazonaws.com`,
  awsDownloadsPath: `${process.env.TRAVIS_BUILD_NUMBER}/${process.env.TRAVIS_JOB_NUMBER}/results/reports`
}