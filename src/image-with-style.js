var rules = {}

// Rule to match img tag with a style attribute
// having one or more of:
//    float: [left|right]
//    height: [value]
//    width: [value]
//    margin: auto; dislay: block
// The information will be included as attributes matching the markdown attr extension
//   https://github.com/arve0/markdown-it-attrs
//   example [alt text](someurl.gif){width=200px height=100px margin:auto display:block}
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

    const floatStyleString = function (direction) {
      switch (direction) {
        case 'left':
          return 'float:left; margin:0px 1em 1em 0px;'
        case 'right':
          return 'float:right; margin:0px 0px 1em 1em;'
        default:
          return ''
      }
    }

    var height = attributeOrStyle('height')
    var width = attributeOrStyle('width')

    var heightVal = height ? 'height=' + height + ' ' : ''
    var widthVal = width ? 'width=' + width + ' ' : ''
    var attrString = widthVal + heightVal

    var centeredStyle = match.centered ? 'display:block; margin:auto; ' : ''
    var floatStyle = match.float ? floatStyleString(match.float[1]) + ' ' : ''
    var styleString = centeredStyle + floatStyle

    if (styleString.length > 1) {
      // append to attribute string and remove the last ' '
      attrString += 'style="' + styleString.substring(0, styleString.length - 1) + '"'
    }

    // remove the last ' '
    if (attrString[attrString.length - 1] === ' ') attrString = attrString.substring(0, attrString.length - 1)

    return '![' + attr.altText + '](' + attr.src + '){' + attrString + '}'
  }
}

export default function imageWithStyle (turndownService) {
  for (var key in rules) turndownService.addRule(key, rules[key])
}
