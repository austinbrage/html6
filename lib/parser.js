var parser = require('himalaya')
var DEFAULT_CONFIG = {
  ...parser.parseDefaults,
  preferDoubleQuoteAttributes: true
}

var MASK_TAG = 'non-html6-template'

function maskTemplates(html) {
  var openCount = 0

  return html
    .replace(/<template(\s+(?!is=)[^>]*?)>/g, function (match, attrs) {
      openCount++
      return '<' + MASK_TAG + attrs + '>'
    })
    .replace(/<\/template>/g, function () {
      return openCount-- > 0 ? '</' + MASK_TAG + '>' : '</template>'
    })
}

function unmaskTemplates(html) {
  return html
    .replace(new RegExp('<' + MASK_TAG, 'g'), '<template')
    .replace(new RegExp('</' + MASK_TAG + '>', 'g'), '</template>')
}

module.exports = {
  parse: function (html) {
    return parser.parse(maskTemplates(html))
  },
  stringify: function (tree, config = {}) {
    config = { ...DEFAULT_CONFIG, ...config }
    if (!Array.isArray(tree)) {
      tree = [tree]
    }
    return unmaskTemplates(parser.stringify(tree, config))
  }
}
