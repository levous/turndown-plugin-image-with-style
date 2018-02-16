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
    height: /height:\s*(\d+(?:px|em|%){0,1})/i,
    width: /width:\s*(\d+(?:px|em|%){0,1})/i, // removed the g flag from all cases because this expression was not matching with the flag.  Not sure why...
    float: /float:\s*(left|right)/i,
    centered: /^(?=.*display:\s*block)(?=.*margin:auto).*$/i // using positive lookahead to allow for ay order and no need to capture anything
  },
  filter: function (node, options) {
    // only match if this is an img tag with one of the special treatment style css declaration
    if (node.nodeName !== 'IMG') return false
    var styleAttr = node.getAttribute('style')

    if (styleAttr && (
      this.regex.width.test(styleAttr) ||
      this.regex.height.test(styleAttr) ||
      this.regex.float.test(styleAttr) ||
      this.regex.centered.test(styleAttr)
    )) {
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
    // float and centered will append the same qs key.  If this happens, tough puhtooties.  User error :)
    var querystring = (match.float ? `align=${match.float[1]}&` : '') +
                      (match.width ? `width=${match.width[1]}&` : '') +
                      (match.height ? `height=${match.height[1]}&` : '') +
                      (match.centered ? `align=center&` : '')

    var modifiedSrc = attr.src
    // if any match was found
    if (querystring.length > 0) {
      if (modifiedSrc.indexOf('?') === -1) modifiedSrc += '?'
      // append the querystring, remove the last '&'
      modifiedSrc += querystring.substring(0, querystring.length - 1)
    }

    return `![${attr.altText}](${modifiedSrc})`
  }
}

export default function imageWithStyle (turndownService) {
  for (var key in rules) turndownService.addRule(key, rules[key])
}
