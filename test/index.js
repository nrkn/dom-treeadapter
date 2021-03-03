'use strict'

const assert = require( 'assert' )
const domUtils = require( '@mojule/dom-utils' )
const parse5 = require( 'parse5' )
const Adapter = require( '../' )
const document = require( './fixtures/document' )

const { parse, parseDocument, serialize } = domUtils

const adapter = Adapter( document )
const options = { treeAdapter: adapter }

const fixtureNames = [ 'kitchen-sink', 'fragment', 'template' ]
const documents = [ 'kitchen-sink' ]

const fixtures = fixtureNames.reduce( ( obj, name ) => {
  const isDocument = documents.includes( name )

  const html = require( `./fixtures/${ name }` )
  const dom = isDocument ? parseDocument( document, html ) : parse( document, html )
  const expect = serialize( dom )

  obj[ name ] = { html, expect }

  return obj
}, {} )

const mixinInsertAdjacentText = element => {
  element.insertAdjacentText = ( type, text ) => {
    text = String( text ).replace( /&/g, '&amp;' ).replace( /</g, '&lt;' )
    element.insertAdjacentHTML( type, text )
  }
}

describe( 'dom-treeadapter', () => {
  describe( 'parsing', () => {
    fixtureNames.forEach( name => {
      const isDocument = documents.includes( name )
      const fixture = fixtures[ name ]
      const parse = isDocument ? parse5.parse : parse5.parseFragment

      const roundTrip = html => {
        const dom = parse( html, options )
        //const str = parse5.serialize( dom, options )
        const str = parse5.serialize( dom, options )

        return parse( str, options )
      }

      it( 'parses ' + name, () => {
        const { html, expect } = fixture
        
        const dom = roundTrip( html )
        const serialized = serialize( dom )

        assert.deepStrictEqual( serialized, expect )
      })
    })
  })

  /*
    some things are only called by parse5 in specific circumstances, I couldn't
    quickly figure out how to make it call them so just test the adapter
    directly
  */
  describe( 'remaining coverage', () => {
    it( 'adapter.insertBefore', () => {
      const expect = '<div><p></p><span></span></div>'

      const fragment = document.createElement( 'fragment' )
      const div = document.createElement( 'div' )
      const firstChild = document.createElement( 'p' )
      const lastChild = document.createElement( 'span' )

      fragment.appendChild( div )
      div.appendChild( lastChild )
      adapter.insertBefore( div, firstChild, lastChild )

      const html = parse5.serialize( fragment, options )

      assert.strictEqual( html, expect )
    })

    it( 'adapter.setDocumentType replaces doctype', () => {
      const dom = parse5.parse( '<!doctype html>', options )

      adapter.setDocumentType( dom, 'name', 'publicId', 'systemId' )

      const { name, publicId, systemId } = dom.doctype

      assert.strictEqual( name, 'name' )
      assert.strictEqual( publicId, 'publicId' )
      assert.strictEqual( systemId, 'systemId' )
    })

    it( 'adapter.setDocumentType adds doctype', () => {
      const dom = parse5.parse( '<p></p>', options )

      adapter.setDocumentType( dom, 'name', 'publicId', 'systemId' )

      const { name, publicId, systemId } = dom.doctype

      assert.strictEqual( name, 'name' )
      assert.strictEqual( publicId, 'publicId' )
      assert.strictEqual( systemId, 'systemId' )
    })

    it( 'adapter.getDocumentMode strict', () => {
      const dom = parse5.parse( '<!doctype html>', options )

      const mode = adapter.getDocumentMode( dom )

      assert.strictEqual( mode, 'no-quirks' )
    })

    it( 'adapter.getDocumentMode quirks', () => {
      const dom = parse5.parse( '<p></p>', options )

      const mode = adapter.getDocumentMode( dom )

      assert.strictEqual( mode, 'quirks' )
    })

    it( 'adapter.insertTextBefore throws on missing reference', () => {
      const dom = parse5.parseFragment( '<p> bar</p>', options )
      const p = dom.querySelector( 'p' )
      const nope = document.createElement( 'span' )

      assert.throws( () => adapter.insertTextBefore( p, 'foo', nope ) )
    })

    it( 'adapter.insertTextBefore inserts before text', () => {
      const dom = parse5.parseFragment( '<p> bar</p>', options )
      const p = dom.querySelector( 'p' )
      const existing = p.firstChild

      adapter.insertTextBefore( p, 'foo', existing )

      assert.strictEqual( existing.nodeValue, 'foo bar' )
    })

    it( 'adapter.insertTextBefore inserts before el', () => {
      const dom = parse5.parseFragment( '<p><span> bar</span></p>', options )
      const p = dom.querySelector( 'p' )
      const existing = p.firstChild

      adapter.insertTextBefore( p, 'foo', existing )

      assert.strictEqual( p.innerHTML, 'foo<span> bar</span>' )
    })

    it( 'adapter.insertTextBefore appends to existing text', () => {
      const dom = parse5.parseFragment( '<p>foo <span></span></p>', options )
      const p = dom.querySelector( 'p' )
      const existing = p.querySelector( 'span' )

      adapter.insertTextBefore( p, 'bar', existing )

      assert.strictEqual( p.firstChild.textContent, 'foo bar' )
    })

    it( 'adapter.insertText native inserts after el', () => {
      const dom = parse5.parseFragment( '<p><span> bar</span></p>', options )
      const p = dom.querySelector( 'p' )
      const existing = p.firstChild

      mixinInsertAdjacentText( p )
      adapter.insertText( p, 'foo', existing )

      assert.strictEqual( p.innerHTML, '<span> bar</span>foo' )
    })

    it( 'adapter.insertTextBefore native inserts before el', () => {
      const dom = parse5.parseFragment( '<p><span> bar</span></p>', options )
      const p = dom.querySelector( 'p' )
      const existing = p.firstChild

      mixinInsertAdjacentText( existing )
      adapter.insertTextBefore( p, 'foo', existing )

      assert.strictEqual( p.innerHTML, 'foo<span> bar</span>' )
    })

    it( 'adapter.adoptAttributes', () => {
      const attrs = [
        { name: 'id', value: 'foo' },
        { name: 'class', value: 'bar' },
        { name: 'name', value: 'baz' }
      ]

      const to = '<span id="qux"></span>'
      const expect = '<span id="qux" class="bar" name="baz"></span>'

      const fragment = parse5.parseFragment( to, options )
      const toEl = fragment.firstChild

      adapter.adoptAttributes( toEl, attrs )

      const html = parse5.serialize( fragment, options )

      assert.strictEqual( html, expect )
    })

    it( 'adapter.getDocumentTypeNodePublicId', () => {
      const dom = parse5.parse( '<!doctype html>', options )

      adapter.setDocumentType( dom, 'name', 'publicId', 'systemId' )

      const publicId = adapter.getDocumentTypeNodePublicId( dom.doctype )

      assert.strictEqual( publicId, 'publicId' )
    })

    it( 'adapter.getDocumentTypeNodeSystemId', () => {
      const dom = parse5.parse( '<!doctype html>', options )

      adapter.setDocumentType( dom, 'name', 'publicId', 'systemId' )

      const systemId = adapter.getDocumentTypeNodeSystemId( dom.doctype )

      assert.strictEqual( systemId, 'systemId' )
    })
  })
})
