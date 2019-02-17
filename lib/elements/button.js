'use strict'

let BaseElement = require('./baseElement')

class Button extends BaseElement {
  constructor (by, name) {
    super(by, name)
  }
}

module.exports = Button