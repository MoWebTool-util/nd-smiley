'use strict'

// var $ = require('nd-jquery')
var chai = require('chai')
var sinonChai = require('sinon-chai')
var Smiley = require('../index')

var expect = chai.expect
// var sinon = window.sinon

chai.use(sinonChai)

/*globals describe,it*/

describe('Smiley', function() {

  it('new Smiley', function() {
    expect(Smiley).to.be.a('function')
    expect(new Smiley).to.be.a('object')
  })

})
