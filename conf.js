exports.config = {
  directConnect: true,

  specs: ['spec/*Spec.js'],
  framework: 'jasmine',

  capabilities: {
    browserName: 'firefox',
  },

  jasmineNodeOpts: {
    showColors: true,
    displaySpecDuration: true,
    defaultTimeoutInterval: 40000
  }
}