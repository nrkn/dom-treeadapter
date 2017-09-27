# dom-treeadapter

## A parse5-compatible TreeAdapter for the DOM

See [TreeAdapter at parse5 documentation](https://github.com/inikulin/parse5/wiki/Documentation#TreeAdapter)

## Install

`npm install dom-treeadapter`

## Usage

Browser:

```javascript
const parse5 = require( 'parse5' )
const Adapter = require( 'dom-treeadapter' )

const adapter = Adapter( window.document )

const domNodes = parse5.parseFragment( '<div></div>', { treeAdapter: adapter } )
```

jsdom:

```javascript
const parse5 = require( 'parse5' )
const Adapter = require( 'dom-treeadapter' )
const jsdom = require( 'jsdom' )

const { JSDOM } = jsdom
const dom = new JSDOM( '<!doctype html>' )
const { document } = dom.window

const adapter = Adapter( document )

const domNodes = parse5.parseFragment( '<div></div>', { treeAdapter: adapter } )
```
