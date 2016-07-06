'use strict'

const nodeType = require( 'nodetype-enum' )

const Adapter = document => {
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
      const element = document.createElement( tagName )

      if( Array.isArray( attrs ) && attrs.length )
        attrs.forEach( pair => element.setAttribute( pair.name, pair.value ) )

      return element
    },

    createCommentNode: data => document.createComment( data ),

    appendChild: ( parentNode, newNode ) => parentNode.appendChild( newNode ),

    insertBefore: ( parentNode, newNode, referenceNode ) =>
      parentNode.insertBefore( newNode, referenceNode ),

    setTemplateContent: ( templateElement, contentElement ) =>
      templateElement.content = contentElement,

    getTemplateContent: templateElement => templateElement.content,

    setDocumentType: ( document, name, publicId, systemId ) => {
      const doctype = document.implementation.createDocumentType( name, publicId, systemId )

      if( document.doctype ){
        document.replaceChild( doctype, document.doctype )
      } else if( document.childNodes && document.childNodes.length ) {
        document.insertBefore( doctype, document.childNodes[ 0 ] )
      } else {
        document.appendChild( doctype )
      }
    },

    setQuirksMode: document => {},

    isQuirksMode: document => document.compatMode === 'BackCompat',

    detachNode: node => node.remove(),

    insertText: ( parentNode, text ) => {
      const children = Array.from( parentNode.childNodes )
      const existing = children[ children.length - 1 ]
      const isLastText = existing && existing.nodeType === nodeType.text

      if( isLastText ){
        existing.nodeValue += text

        return
      }

      parentNode.appendChild( document.createTextNode( text ) )
    },

    insertTextBefore: ( parentNode, text, referenceNode ) => {
      const children = Array.from( parentNode.childNodes )

      const index = children.indexOf( referenceNode )

      if( index === -1 )
        throw new Error( 'Reference node not found' )

      const reference = children[ index ]
      const isRefText = reference && reference.nodeType === nodeType.text

      if( isRefText ){
        reference.nodeValue += text

        return
      }

      parentNode.insertBefore( document.createTextNode( text ), referenceNode )
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

    getTagName: element => element.tagName,

    getNamespaceURI: element => element.namespaceURI,

    getTextNodeContent: textNode => textNode.nodeValue,

    getCommentNodeContent: commentNode => commentNode.nodeValue,

    getDocumentTypeNodeName: doctypeNode => doctypeNode.name,

    getDocumentTypeNodePublicId: doctypeNode => doctypeNode.publicId,

    getDocumentTypeNodeSystemId: doctypeNode => doctypeNode.systemId,

    isTextNode: node => node.nodeType === nodeType.text,

    isCommentNode: node => node.nodeType === nodeType.comment,

    isDocumentTypeNode: node => node.nodeType === nodeType.documentType,

    isElementNode: node => node.nodeType === nodeType.element
  }

  return adapter
}

module.exports = Adapter
