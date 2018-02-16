var rules = {}

// Rule to match img tag with a style attribute
// having one or more of:
//    float: [left|right]
//    height: [value]
//    width: [value]
//    margin: auto; dislay: block
// The information will be appended to the src url as originalSrcUrl?align=[left\center|right]&width=value&height=value
rules.imageWithSizeAndAlign = {
  regex: {
    height: /height:\s*(\d+(?:\.\d+)?(?:px|em|%){0,1})/i,
    width: /width:\s*(\d+(?:\.\d+)?(?:px|em|%){0,1})/i, // removed the g flag from all cases because this expression was not matching with the flag.  Not sure why...
    float: /float:\s*(left|right)/i,
    centered: /^(?=.*display:\s*block)(?=.*margin:auto).*$/i // using positive lookahead to allow for ay order and no need to capture anything
  },
  filter: function (node, options) {
    // only match if this is an img tag with one of the special treatment style css declaration
    if (node.nodeName !== 'IMG') return false
    var styleAttr = node.getAttribute('style')
    var widthOrHeight = node.getAttribute('width') + node.getAttribute('height')

    if ((widthOrHeight && widthOrHeight.length > 1) || (
      styleAttr && (
      this.regex.width.test(styleAttr) ||
      this.regex.height.test(styleAttr) ||
      this.regex.float.test(styleAttr) ||
      this.regex.centered.test(styleAttr)
    ))) {
      return true
    } else {
      return false
    }
  },
  replacement: function (content, node) {
    var attr = {
      src: node.getAttribute('src'),
      altText: node.getAttribute('alt') || '',
      style: node.getAttribute('style')
    }

    var match = {
      float: this.regex.float.exec(attr.style),
      width: this.regex.width.exec(attr.style),
      height: this.regex.height.exec(attr.style),
      centered: this.regex.centered.test(attr.style)
    }

    const attributeOrStyle = function (attrName) {
      var val = null
      var attr = node.getAttribute(attrName)
      if (match[attrName]) {
        val = match[attrName][1]
      } else if (attr && attr.length > 0) {
        val = attr
      }
      return val
    }

    var height = attributeOrStyle('height')
    var width = attributeOrStyle('width')

    // float and centered will append the same qs key.  If this happens, tough puhtooties.  User error :)
    var querystring = (match.float ? `align=${match.float[1]}&` : '') +
                      (width ? `width=${width}&` : '') +
                      (height ? `height=${height}&` : '') +
                      (match.centered ? `align=center&` : '')

    var modifiedSrc = attr.src
    // if any match was found
    if (querystring.length > 0) {
      if (modifiedSrc.indexOf('?') === -1) modifiedSrc += '?'
      else modifiedSrc += '&'

      // append the querystring, remove the last '&'
      modifiedSrc += querystring.substring(0, querystring.length - 1)
    }

    return `![${attr.altText}](${modifiedSrc})`
  }
}

export default function imageWithStyle (turndownService) {
  for (var key in rules) turndownService.addRule(key, rules[key])
}
