'use strict'

const keyVars = require('../../keyVariables.js')
const AWS = require('aws-sdk')
const fs = require('fs')
const path = require('path')
let SlackHelper = require('./slackHelper')

let bucket = keyVars.awsBucket
let accessKeyId = keyVars.awsAccessKey
let secretAccessKey = keyVars.awsSecretKey
let s3Region = keyVars.awsRegion
let localE2ePath = path.resolve(__dirname, `..`)
let downloadedPath = keyVars.awsDownloadsPath
let awsPath = `${keyVars.awsPath}/${keyVars.awsDownloadsPath}`

AWS.config.update(
  {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region: s3Region
  }
)
let s3 = new AWS.S3()

class s3Helper {

/*  static async DownloadFile (s3FilePath, s3FileName) {
    await Logger.debug(`Downloading file ${s3FilePath}/${s3FileName}`)
    let localArtifactsPath = path.resolve(localE2ePath, `artifacts/${s3FilePath}`)
    let localFilePath = path.resolve(localArtifactsPath, s3FileName)

    let isFolderExists = await fs.existsSync(localArtifactsPath)
    if (!isFolderExists) {
      shell.mkdir('-p', localArtifactsPath)
    } else {
      let isFileExists = await fs.existsSync(localFilePath)
      if (isFileExists) {
        await Logger.debug(`File ${s3FileName} already exists`)
        return localFilePath
      }
    }

    let outStream = fs.createWriteStream(localFilePath)
    let awsStream = s3.getObject({Bucket: bucket, Key: `resources/${s3FilePath}/${s3FileName}`}).createReadStream()

    awsStream.pipe(outStream)
    return new Promise((resolve, reject) => {
      awsStream.on('end', () => {
        resolve(localFilePath)
      })
      awsStream.on('error', (err) => {
        Logger.error(err)
        reject()
      })
    })
  }*/

  static async UploadToS3 (localFilePath, fileName) {
    await Logger.debug(`Uploading file ${fileName} into bucket`)
    let link = `${awsPath}/${fileName}`
    let params = {
      Bucket: bucket,
      Key: `${downloadedPath}/${fileName}`,
      Body: fs.createReadStream(localFilePath)
    }
    return new Promise((resolve, reject) => {
      s3.upload(params, (err, data) => {
        if (err) {
          reject(err)
        } else {
          SlackHelper.PostToSlackUrl(SuiteDescribe, fileName, link)
          Logger.debug(`File ${fileName} was uploaded into bucket with Url:\n ${link}`)
          resolve(data)
        }
      })
    })
  }

}

module.exports = s3Helper