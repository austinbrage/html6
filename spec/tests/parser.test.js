var parser = require('../../lib/parser.js')

test('parse', async ({ t }) => {
  var result = parser.parse('<div class="hello"></div>')

  t.equal(result[0].type, 'element')
  t.equal(result[0].tagName, 'div')
  t.equal(result[0].attributes[0].key, 'class')
  t.equal(result[0].attributes[0].value, 'hello')
})

test('stringify', async ({ t }) => {
  var tree = [
    {
      type: 'element',
      tagName: 'div',
      attributes: [{ key: 'class', value: 'hello' }],
      children: []
    }
  ]

  var result = parser.stringify(tree)
  var expected = '<div class="hello"></div>'

  t.equal(result, expected)
})

test('non-html6 template', async ({ t }) => {
  var html = '<template is="component"><template x-if="true">hello</template><h1>world</h1></template>'

  var tree = parser.parse(html)

  t.equal(tree[0].type, 'element')
  t.equal(tree[0].tagName, 'template')
  t.equal(tree[0].children.length, 1)
  t.equal(tree[0].children[0].type, 'text')
  t.equal(tree[0].children[0].content, '<non-html6-template x-if="true">hello</non-html6-template><h1>world</h1>')

  var childHtml = parser.stringify(tree[0].children)
  t.equal(childHtml, '<template x-if="true">hello</template><h1>world</h1>')

  var childTree = parser.parse(childHtml)
  t.equal(childTree.length, 2)
  t.equal(childTree[1].tagName, 'h1')
  t.equal(childTree[1].children.length, 1)
  t.equal(childTree[1].children[0].type, 'text')
  t.equal(childTree[1].children[0].content, 'world')
})
