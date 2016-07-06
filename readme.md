# dom-treeadapter

## A parse5-compatible TreeAdapter for the DOM

See [TreeAdapter at parse5 documentation](https://github.com/inikulin/parse5/wiki/Documentation#TreeAdapter)

## Install

`npm install dom-treeadapter`

## Usage

```javascript
const parse5 = require( 'parse5' )
const Adapter = require( 'dom-treeadapter' )

// Needs an interface with .createElement etc.
// You can use window.document in the browser:
const adapter = Adapter( window.document )
// or a jsdom() instance:
const jsdom = require( 'jsdom' ).jsdom
const adapter2 = Adapter( jsdom() )

const domNodes = parse5.parse( '<div></div>', { treeAdapter: adapter } )
```
