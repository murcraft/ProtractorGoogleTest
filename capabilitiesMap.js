const keyVars = require('./keyVariables.js')

let downloads = keyVars.downloadPath

let capabilitiesMap = {

  'firefox': {
    browserName: 'firefox',
    shardTestFiles: process.env.maxinstances > 1,
    maxInstances: process.env.maxinstances,
    acceptSslCerts: true,
    verboseMultiSession: true,

    'moz:firefoxOptions': {
      args: [
        '--width=1920',
        '--height=1080',
        '--private'
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
        'plugin.disable_full_page_plugin_for_types': 'application/pdf',

        'app.update.enabled': false,
        'app.update.auto': false,
        'app.update.silent': false,
        'extensions.update.enabled': false,
        'security.sandbox.content.level': 5,
        // 'extensions.logging.enabled': true,
        'browser.tabs.remote.autostart': false,
      },
    },
    log: {
      level: 'trace'
    }
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
      javascriptEnabled: true,
      acceptSslCerts: true,
      nativeEvents: true
    }
  },

}

module.exports = capabilitiesMap