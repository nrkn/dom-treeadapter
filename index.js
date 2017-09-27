'use strict'

const Adapter = document => {
  const {
    TEXT_NODE,
    DOCUMENT_TYPE_NODE,
    ELEMENT_NODE,
    COMMENT_NODE,
  } = document

  const adapter = {
    createDocument: () => {
      const doc = document.implementation.createHTMLDocument( '' )

      // clear out automatically added children
      const children = Array.from( doc.childNodes )

      children.forEach( child => child.remove() )

      return doc
    },

    createDocumentFragment: () => document.createDocumentFragment(),

    createElement: ( tagName, nameSpaceUri, attrs ) => {
      const element = document.createElementNS( nameSpaceUri, tagName )
      attrs.forEach( pair => element.setAttribute( pair.name, pair.value ) )
      return element
    },

    createCommentNode: data => document.createComment( data ),

    appendChild: ( parentNode, newNode ) => parentNode.appendChild( newNode ),

    insertBefore: ( parentNode, newNode, referenceNode ) =>
      parentNode.insertBefore( newNode, referenceNode ),

    // templateElement.content is readonly
    setTemplateContent: ( templateElement, fragment ) => {
      templateElement.innerHTML = ''

      templateElement.appendChild( fragment )
    },

    getTemplateContent: templateElement => templateElement.content,

    setDocumentType: ( document, name, publicId, systemId ) => {
      publicId = publicId || ''
      systemId = systemId || ''

      const doctype = document.implementation.createDocumentType( name, publicId, systemId )

      if( document.doctype ){
        document.replaceChild( doctype, document.doctype )
      } else if( document.childNodes && document.childNodes.length ) {
        document.insertBefore( doctype, document.childNodes[ 0 ] )
      } else {
        document.appendChild( doctype )
      }
    },

    setDocumentMode: () => {},

    getDocumentMode: document =>
      document.compatMode === 'CSS1Compat' ? 'no-quirks' : 'quirks',

    detachNode: node => node.remove(),

    insertText: ( parentNode, text ) => {
      if( 'insertAdjacentText' in parentNode ) {
        parentNode.insertAdjacentText( 'beforeend', text )
      } else {
        const last = parentNode.lastChild

        if( last && last.nodeType === TEXT_NODE ){
          last.appendData( text )
        } else {
          parentNode.appendChild( document.createTextNode( text ) )
        }
      }
    },

    insertTextBefore: ( parentNode, text, referenceNode ) => {
      if( 'insertAdjacentText' in referenceNode ) {
        referenceNode.insertAdjacentText( 'beforebegin', text )
      } else if ( referenceNode.nodeType === TEXT_NODE ) {
        referenceNode.insertData( 0, text )
      } else {
        const prev = referenceNode.previousSibling

        if ( prev && prev.nodeType === TEXT_NODE ) {
          prev.appendData( text )
        } else {
          parentNode.insertBefore( document.createTextNode( text ), referenceNode )
        }
      }
    },

    adoptAttributes: ( recipientNode, attrs ) => {
      attrs.filter( pair => !recipientNode.hasAttribute( pair.name ) ).forEach( pair => {
        recipientNode.setAttribute( pair.name, pair.value )
      })
    },

    getFirstChild: node => node.firstChild,

    getChildNodes: node => Array.from( node.childNodes ),

    getParentNode: node => node.parentNode,

    getAttrList: node => Array.from( node.attributes ),

    getTagName: element => element.localName,

    getNamespaceURI: element => element.namespaceURI,

    getTextNodeContent: textNode => textNode.nodeValue,

    getCommentNodeContent: commentNode => commentNode.nodeValue,

    getDocumentTypeNodeName: doctypeNode => doctypeNode.name,

    getDocumentTypeNodePublicId: doctypeNode => doctypeNode.publicId,

    getDocumentTypeNodeSystemId: doctypeNode => doctypeNode.systemId,

    isTextNode: node => node.nodeType === TEXT_NODE,

    isCommentNode: node => node.nodeType === COMMENT_NODE,

    isDocumentTypeNode: node => node.nodeType === DOCUMENT_TYPE_NODE,

    isElementNode: node => node.nodeType === ELEMENT_NODE,
  }

  return adapter
}

module.exports = Adapter
