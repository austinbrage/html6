var expression = require('./expression.js')
var implode = require('./implode.js')
var literal = require('./literal.js')
var parser = require('./parser.js')
var escape = require('./escape.js')
var mask = require('./mask.js')

var keys = { map: 1, if: 1, elsif: 1, else: 1 }

function map(node, opt) {
  var atts = node.attributes || []
  var attr
  var ifAttr
  var otherAtts

  for (var i = 0; i < atts.length; i++) {
    var a = atts[i]
    if (a.key === 'map') {
      attr = a
    } else if (a.key === 'if') {
      ifAttr = a
    } else if (!keys[a.key]) {
      if (!otherAtts) otherAtts = []
      otherAtts.push(a)
    }
  }

  if (!attr) return

  var isObjectMap = attr.value.indexOf(" in ") !== -1;
  var splitter = isObjectMap ? "in" : "of";

  var [vars, list] = attr.value.split(splitter).map((x) => x.trim())
  var [item, index] = vars.split(',').map((x) => x.trim())

  var iterators = index ? `${item}, ${index}` : item

  var clone = {
    type: node.type,
    tagName: node.tagName,
    attributes: otherAtts || [],
    children: node.children || [],
  }

  var content = parser.stringify(clone)

  if (literal(content)) {
    content = expression(content, function (expr) {
      return mask('${' + expr + '}', 'literal', opt.store)
    })
  }

  content = escape(content)

  var inner = ifAttr
    ? [
        `    if (${ifAttr.value}) {`,
        `      return \`${content}\``,
        '    }',
        "    return ''",
      ]
    : [`    return \`${content}\``]

  var code = []

  if (isObjectMap) {
    var keyValueLine = index
      ? `    ${index} = key;\n    ${item} = obj[key];`
      : `    ${item} = obj[key];`;

    code = [
      `(function (obj) {`,
      `  return Object.keys(obj || {}).map(function(key) {`,
      keyValueLine,
      ...inner,
      `  }).join("")`,
      `})(${list})`
    ].join('\n')
  } else {
    code = [
      '(function (mapArg) {',
      `  return (mapArg || []).map(function(${iterators}) {`,
      ...inner,
      `  }).join('')`,
      '})(' + list + ')',
    ].join('\n')
  }

  code = '${' + code + '}'

  if (code.length) {
    code = mask(code, 'map', opt.store)
  }

  implode(node, code)
}

module.exports = map
