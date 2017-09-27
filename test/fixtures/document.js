'use strict'

const jsdom = require( 'jsdom' )

const { JSDOM } = jsdom
const dom = new JSDOM( '<!doctype html>' )
const { document } = dom.window

module.exports = document
