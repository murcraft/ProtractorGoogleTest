const keyVars = require('./keyVariables.js')

let downloads = keyVars.downloadPath

let capabilitiesMap = {

  'firefox': {
    browserName: 'firefox',
    shardTestFiles: process.env.maxinstances > 1,
    maxInstances: process.env.maxinstances,
    acceptSslCerts: true,
    binary: './lib/drivers/geckodriver-v0.24.0.exe',

    'moz:firefoxOptions': {
      args: [
        '--width=1920',
        '--height=1920',
        '-private'
      ],
      prefs: {
        'browser.download.folderList': 2,
        'browser.download.dir': downloads,
        'pref.downloads.disable_button.edit_actions': true,
        'services.sync.prefs.sync.browser.download.useDownloadDir': true,
        'browser.download.useDownloadDir': true,
        'browser.download.manager.alertOnEXEOpen': false,
        'browser.download.manager.closeWhenDone': true,
        'browser.download.manager.focusWhenStarting': false,
        'browser.download.manager.showWhenStarting': false,
        'browser.helperApps.alwaysAsk.force': false,
        'browser.download.manager.showAlertOnComplete': false,
        'browser.download.manager.useWindow': false,
        'browser.download.panel.removeFinishedDownloads': true,
        'browser.download.useToolkitUI': false,
        'browser.helperApps.neverAsk.saveToDisk': 'application/pdf',
        'pdfjs.disabled': true,
        'plugin.disable_full_page_plugin_for_types': 'application/pdf'
      },
    },
  },

  'chrome': {
    browserName: 'chrome',
    shardTestFiles: process.env.maxinstances > 1,
    maxInstances: process.env.maxinstances,

    chromeOptions: {
      args: [
        'incognito',
        'window-size=1920,1080',
        '--disable-infobars',
        '--disable-extensions',
      ],
    },
    prefs: {
      download: {
        prompt_for_download: false,
        directory_upgrade: true,
        default_directory: downloads,
      },
    },
    loggingPrefs: {
      browser: 'SEVERE',
    },
  },

  'safari': {
    browserName: 'safari',
    shardTestFiles: process.env.maxinstances > 1,
    maxInstances: process.env.maxinstances,
    'safari.options': {
      technologyPreview: false, // set to true if Safari Technology Preview to be used
      cleanSession: true,
    }
  },

}

module.exports = capabilitiesMap