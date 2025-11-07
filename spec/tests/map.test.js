var map = require('../../lib/map.js')

test('map', async ({ t }) => {
  var node = {
    type: 'element',
    tagName: 'li',
    attributes: [{ key: 'map', value: 'project of projects' }],
    children: [{ type: 'text', content: 'item' }]
  }

  var opt = { store: new Map() }

  map(node, opt)

  var content = node.content
  var value = opt.store.get(content)

  var expectedVal = [
    '${(function (mapArg) {',
    '  return (mapArg || []).map(function(project) {',
    '    return `<li>item</li>`',
    `  }).join('')`,
    '})(projects)}'
  ].join('\n')
  t.equal(value, expectedVal)

  var expectedContent = '__::MASK_map_0_::__'
  t.equal(content, expectedContent)
})

test('map - backticks', async ({ t }) => {
  var node = {
    type: 'element',
    tagName: 'li',
    attributes: [{ key: 'map', value: 'project of projects' }],
    children: [{ type: 'text', content: '`item' }]
  }

  var opt = { store: new Map() }

  map(node, opt)

  var content = node.content
  var value = opt.store.get(content)

  var expectedVal = [
    '${(function (mapArg) {',
    '  return (mapArg || []).map(function(project) {',
    '    return `<li>\\`item</li>`',
    `  }).join('')`,
    '})(projects)}'
  ].join('\n')
  t.equal(value, expectedVal)

  var expectedContent = '__::MASK_map_0_::__'
  t.equal(content, expectedContent)
})

test('map - dollar', async ({ t }) => {
  var node = {
    type: 'element',
    tagName: 'li',
    attributes: [{ key: 'map', value: 'project of projects' }],
    children: [{ type: 'text', content: '${item}' }]
  }

  var opt = { store: new Map() }

  map(node, opt)

  var content = node.content
  var value = opt.store.get(content)

  var expectedVal = [
    '${(function (mapArg) {',
    '  return (mapArg || []).map(function(project) {',
    '    return `<li>\\${item}</li>`',
    `  }).join('')`,
    '})(projects)}'
  ].join('\n')
  t.equal(value, expectedVal)

  var expectedContent = '__::MASK_map_0_::__'
  t.equal(content, expectedContent)
})

test('map - backslashes', async ({ t }) => {
  var node = {
    type: 'element',
    tagName: 'li',
    attributes: [{ key: 'map', value: 'project of projects' }],
    children: [{ type: 'text', content: '\\{{item}}' }]
  }

  var opt = { store: new Map() }

  map(node, opt)

  var content = node.content
  var value = opt.store.get(content)

  var expectedVal = [
    '${(function (mapArg) {',
    '  return (mapArg || []).map(function(project) {',
    '    return `<li>{{item}}</li>`',
    `  }).join('')`,
    '})(projects)}'
  ].join('\n')
  t.equal(value, expectedVal)

  var expectedContent = '__::MASK_map_0_::__'
  t.equal(content, expectedContent)
})

test('map - value', async ({ t }) => {
  var node = {
    type: 'element',
    tagName: 'li',
    attributes: [{ key: 'map', value: 'project of projects' }],
    children: [{ type: 'text', content: '{{item}}' }]
  }

  var opt = { store: new Map() }

  map(node, opt)

  var maskLiteral = '__::MASK_literal_0_::__'

  var content = node.content
  var value = opt.store.get(content)

  var expectedVal = [
    '${(function (mapArg) {',
    '  return (mapArg || []).map(function(project) {',
    `    return \`<li>${maskLiteral}</li>\``,
    `  }).join('')`,
    '})(projects)}'
  ].join('\n')
  t.equal(value, expectedVal)

  var expectedContent = '__::MASK_map_1_::__'
  t.equal(content, expectedContent)

  var value = opt.store.get(maskLiteral)
  t.equal(value, '${item}')
})

test('map - empty value', async ({ t }) => {
  var node = {
    type: 'element',
    tagName: 'li',
    attributes: [{ key: 'map', value: 'project of projects' }],
    children: [{ type: 'text', content: '{{}}' }]
  }

  var opt = { store: new Map() }

  map(node, opt)

  var content = node.content
  var value = opt.store.get(content)

  var expectedVal = [
    '${(function (mapArg) {',
    '  return (mapArg || []).map(function(project) {',
    '    return `<li></li>`',
    `  }).join('')`,
    '})(projects)}'
  ].join('\n')
  t.equal(value, expectedVal)

  var expectedContent = '__::MASK_map_0_::__'
  t.equal(content, expectedContent)
})

test('map - everything', async ({ t }) => {
  var node = {
    type: 'element',
    tagName: 'li',
    attributes: [{ key: 'map', value: 'project of projects' }],
    children: [{ type: 'text', content: '`item ${item} \\{{item}} {{item}}' }]
  }

  var opt = { store: new Map() }

  map(node, opt)

  var maskLiteral = '__::MASK_literal_0_::__'

  var content = node.content
  var value = opt.store.get(content)

  var expectedVal = [
    '${(function (mapArg) {',
    '  return (mapArg || []).map(function(project) {',
    '    return `<li>\\`item \\${item} {{item}} ' + maskLiteral + '</li>`',
    `  }).join('')`,
    '})(projects)}'
  ].join('\n')
  t.equal(value, expectedVal)

  var expectedContent = '__::MASK_map_1_::__'
  t.equal(content, expectedContent)

  var value = opt.store.get(maskLiteral)
  t.equal(value, '${item}')
})

test('map if', async ({ t }) => {
  var node = {
    type: 'element',
    tagName: 'li',
    attributes: [
      { key: 'map', value: 'project of projects' },
      { key: 'if', value: 'project.active' }
    ],
    children: [{ type: 'text', content: 'item' }]
  }

  var opt = { store: new Map() }

  map(node, opt)

  var content = node.content
  var value = opt.store.get(content)

  var expectedVal = [
    '${(function (mapArg) {',
    '  return (mapArg || []).map(function(project) {',
    '    if (project.active) {',
    '      return `<li>item</li>`',
    '    }',
    "    return ''",
    "  }).join('')",
    '})(projects)}'
  ].join('\n')
  t.equal(value, expectedVal)

  var expectedContent = '__::MASK_map_0_::__'
  t.equal(content, expectedContent)
})

test('map if - everything', async ({ t }) => {
  var node = {
    type: 'element',
    tagName: 'li',
    attributes: [
      { key: 'map', value: 'project of projects' },
      { key: 'if', value: 'project.active' }
    ],
    children: [{ type: 'text', content: '`item ${item} \\{{item}} {{item}}' }]
  }

  var opt = { store: new Map() }

  map(node, opt)

  var maskLiteral = '__::MASK_literal_0_::__'

  var content = node.content
  var value = opt.store.get(content)

  var expectedVal = [
    '${(function (mapArg) {',
    '  return (mapArg || []).map(function(project) {',
    '    if (project.active) {',
    '      return `<li>\\`item \\${item} {{item}} ' + maskLiteral + '</li>`',
    '    }',
    "    return ''",
    "  }).join('')",
    '})(projects)}'
  ].join('\n')
  t.equal(value, expectedVal)

  var expectedContent = '__::MASK_map_1_::__'
  t.equal(content, expectedContent)

  var value = opt.store.get(maskLiteral)
  t.equal(value, '${item}')
})

test('map object notation', async ({ t }) => {
  var node = {
    type: 'element',
    tagName: 'li',
    attributes: [{ key: 'map', value: 'project of projects.item' }],
    children: [{ type: 'text', content: 'item' }]
  }

  var opt = { store: new Map() }

  map(node, opt)

  var content = node.content
  var value = opt.store.get(content)

  var expectedVal = [
    '${(function (mapArg) {',
    '  return (mapArg || []).map(function(project) {',
    '    return `<li>item</li>`',
    `  }).join('')`,
    '})(projects.item)}'
  ].join('\n')
  t.equal(value, expectedVal)

  var expectedContent = '__::MASK_map_0_::__'
  t.equal(content, expectedContent)
})

test('map - value in object', async ({ t }) => {
  var node = {
    type: 'element',
    tagName: 'li',
    attributes: [{ key: 'map', value: 'value in items' }],
    children: [{ type: 'text', content: '{{value}}' }]
  }

  var opt = { store: new Map() }

  map(node, opt)

  var maskLiteral1 = '__::MASK_literal_0_::__'

  var content = node.content
  var value = opt.store.get(content)

  var expectedVal = [
    '${(function (obj) {',
    '  return Object.keys(obj || {}).map(function(key) {',
    '    value = obj[key];',
    `    return \`<li>${maskLiteral1}</li>\``,
    '  }).join("")',
    '})(items)}'
  ].join('\n')

  t.equal(value, expectedVal)

  var expectedContent = '__::MASK_map_1_::__'
  t.equal(content, expectedContent)

  var maskVal = opt.store.get(maskLiteral1)
  t.equal(maskVal, '${value}')
})

test('map - value, key in object', async ({ t }) => {
  var node = {
    type: 'element',
    tagName: 'li',
    attributes: [{ key: 'map', value: 'value, items_key in items' }],
    children: [{ type: 'text', content: '{{items_key}}: {{value}}' }]
  }

  var opt = { store: new Map() }

  map(node, opt)

  var maskLiteral1 = '__::MASK_literal_0_::__'
  var maskLiteral2 = '__::MASK_literal_1_::__'

  var content = node.content
  var value = opt.store.get(content)

  var expectedVal = [
    '${(function (obj) {',
    '  return Object.keys(obj || {}).map(function(key) {',
    '    items_key = key;',
    '    value = obj[key];',
    `    return \`<li>${maskLiteral1}: ${maskLiteral2}</li>\``,
    '  }).join("")',
    '})(items)}'
  ].join('\n')

  t.equal(value, expectedVal)

  var expectedContent = '__::MASK_map_2_::__'
  t.equal(content, expectedContent)

  var maskVal = opt.store.get(maskLiteral1)
  t.equal(maskVal, '${items_key}')

  var maskVal = opt.store.get(maskLiteral2)
  t.equal(maskVal, '${value}')
})
