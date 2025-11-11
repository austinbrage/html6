var parser = require('../../lib/parser.js')
var html = require('../../index.js')

test('plain', async ({ t }) => {
  var page = '<div>hello</div>'

  var renderer = html.compile(page)
  var data = {}
  var result = renderer.render(data)

  t.equal(result, '<div>hello</div>')
})

test('attributes', async ({ t }) => {
  var page = '<div class="hello">world</div>'

  var renderer = html.compile(page)
  var data = {}
  var result = renderer.render(data)

  t.equal(result, '<div class="hello">world</div>')
})

test('expression', async ({ t }) => {
  var page = '<div>{{hello}}</div>'

  var renderer = html.compile(page)
  var data = { hello: 'world' }
  var result = renderer.render(data)

  t.equal(result, '<div>world</div>')
})

test('expression atts', async ({ t }) => {
  var page = '<div class="{{ hello }}">bye</div>'

  var renderer = html.compile(page)
  var data = { hello: 'world' }
  var result = renderer.render(data)

  t.equal(result, '<div class="world">bye</div>')
})

test('if', async ({ t }) => {
  var page = '<div if="true">{{hello}}</div>'

  var renderer = html.compile(page)
  var data = { hello: 'world' }
  var result = renderer.render(data)

  t.equal(result, '<div>world</div>')
})

test('if map', async ({ t }) => {
  var page = '<ul if="ps.length"><li map="p of ps">{{p}}</li></ul>'

  var renderer = html.compile(page)
  var data = { ps: [1, 2] }
  var result = renderer.render(data)

  t.equal(result, '<ul><li>1</li><li>2</li></ul>')
})

test('if map - empty', async ({ t }) => {
  var page = '<ul><li if="ps?.length" map="p of ps">{{p}}</li></ul>'

  var renderer = html.compile(page)
  var data = { ps: null }
  var result = renderer.render(data)

  t.equal(result, '<ul></ul>')
})

test('if map - consecutive', async ({ t }) => {
  var page = [
    '<ul if="false"><li map="p of ps">{{p}}</li></ul>',
    '<ul if="true"><li map="p of ps">{{p}}</li></ul>',
  ].join('')

  var renderer = html.compile(page)
  var data = { ps: [1, 2] }
  var result = renderer.render(data)

  t.equal(result, '<ul><li>1</li><li>2</li></ul>')
})

test('if atts', async ({ t }) => {
  var page = '<div if="true" class="world">{{hello}}</div>'

  var renderer = html.compile(page)
  var data = { hello: 'world' }
  var result = renderer.render(data)

  t.equal(result, '<div class="world">world</div>')
})

test('if atts expression', async ({ t }) => {
  var page = '<div if="true" class="{{hello}}">bye</div>'

  var renderer = html.compile(page)
  var data = { hello: 'world' }
  var result = renderer.render(data)

  t.equal(result, '<div class="world">bye</div>')
})

test('elsif', async ({ t }) => {
  var page = '<div if="false"></div><div elsif="true">{{hello}}</div>'

  var renderer = html.compile(page)
  var data = { hello: 'world' }
  var result = renderer.render(data)

  t.equal(result, '<div>world</div>')
})

test('if else', async ({ t }) => {
  var page = '<div if="false"></div><div else>{{hello}}</div>'

  var renderer = html.compile(page)
  var data = { hello: 'world' }
  var result = renderer.render(data)

  t.equal(result, '<div>world</div>')
})

test('if elsif else', async ({ t }) => {
  var page =
    '<div if="false"></div><div elsif="false"></div><div else>{{hello}}</div>'

  var renderer = html.compile(page)
  var data = { hello: 'world' }
  var result = renderer.render(data)

  t.equal(result, '<div>world</div>')
})

test('nested if on else', async ({ t }) => {
  var page =
    '<div if="false"></div><div else><span if="true">{{hello}}</span></div>'

  var renderer = html.compile(page)
  var data = { hello: 'world' }
  var result = renderer.render(data)

  t.equal(result, '<div><span>world</span></div>')
})

test('if else map', async ({ t }) => {
  var page = [
    '<div if="products?.length > 0" map="p of products">',
    '  <span>{{p}}</span>',
    '</div>',
    '<div else></div>',
  ].join('')

  var renderer = html.compile(page)
  var data = { products: ['world'] }
  var result = renderer.render(data)

  t.equal(result, '<div>  <span>world</span></div>')
})

test('map', async ({ t }) => {
  var page = '<ul><li map="p of projects">{{p.name}}</li></ul>'

  var renderer = html.compile(page)
  var data = { projects: [{ name: 'a' }, { name: 'b' }] }
  var result = renderer.render(data)

  t.equal(result, '<ul><li>a</li><li>b</li></ul>')
})

test('map object notation', async ({ t }) => {
  var page = '<ul><li map="p of projects.items">{{p.name}}</li></ul>'

  var renderer = html.compile(page)
  var data = { projects: { items: [{ name: 'a' }, { name: 'b' }] } }
  var result = renderer.render(data)

  t.equal(result, '<ul><li>a</li><li>b</li></ul>')
})

test('nested map', async ({ t }) => {
  var page =
    '<ul><li map="p of projects"><span map="name of p.name">{{name}}</span></li></ul>'

  var renderer = html.compile(page)
  var data = { projects: [{ name: ['a', 'b'] }, { name: ['c', 'd'] }] }
  var result = renderer.render(data)

  t.equal(
    result,
    '<ul><li><span>a</span><span>b</span></li><li><span>c</span><span>d</span></li></ul>',
  )
})

test('map slot', async ({ t }) => {
  var page = '<card><ul><li map="p of projects">{{p.name}}</li></ul></card>'

  var components = ['<template is="card"><slot></slot></template>']
  var opt = { components }

  var renderer = html.compile(page, opt)
  var data = { projects: [{ name: 'a' }, { name: 'b' }] }
  var result = renderer.render(data)

  t.equal(result, '<ul><li>a</li><li>b</li></ul>')
})

test('if else slot', async ({ t }) => {
  var page =
    '<card><div if="projects.length">hello</div><div else>p</div></card>'

  var components = ['<template is="card"><slot></slot></template>']
  var opt = { components }

  var renderer = html.compile(page, opt)
  var data = { projects: [{ name: 'a' }, { name: 'b' }] }
  var result = renderer.render(data)

  t.equal(result, '<div>hello</div>')
})

test('if component', async ({ t }) => {
  var page = '<card if="card"></card>'
  var components = ['<template is="card"><div>hello</div></template>']
  var opt = { components }

  var renderer = html.compile(page, opt)

  var result = renderer.render({ card: true })

  t.equal(result, '<div>hello</div>')

  result = renderer.render({ card: false })

  t.equal(result, '')
})

test('empty component', async ({ t }) => {
  var page = '<div>{{hello}}</div>'
  var components = ['']
  var opt = { components }

  var renderer = html.compile(page, opt)
  var data = { hello: 'world' }
  var result = renderer.render(data)

  t.equal(result, '<div>world</div>')
})

test('simple component', async ({ t }) => {
  var page = '<card></card>'
  var components = ['<template is="card"><div>hello</div></template>']
  var opt = { components }

  var renderer = html.compile(page, opt)

  var result = renderer.render()

  t.equal(result, '<div>hello</div>')
})

test('nested component', async ({ t }) => {
  var page = '<cards></cards>'
  var components = [
    '<template is="card"><div>hello</div></template>',
    '<template is="cards"><card></card></template>',
  ]
  var opt = { components }

  var renderer = html.compile(page, opt)

  var result = renderer.render()

  t.equal(result, '<div>hello</div>')
})

test('nested component - same string', async ({ t }) => {
  var page = '<cards></cards>'
  var components = [
    `
      <template is="cards"><card></card></template>
      <template is="card"><div>hello</div></template>
    `,
  ]
  var opt = { components }

  var renderer = html.compile(page, opt)

  var result = renderer.render()

  t.equal(result, '<div>hello</div>')
})

test('slot component', async ({ t }) => {
  var page = '<card><div>hello</div></card>'
  var components = ['<template is="card"><slot></slot></template>']
  var opt = { components }

  var renderer = html.compile(page, opt)

  var result = renderer.render()

  t.equal(result, '<div>hello</div>')
})

test('deep slot', async ({ t }) => {
  var page = '<layout><div>hello</div></layout>'
  var components = ['<template is="layout"><p><slot></section></p></template>']
  var opt = { components }

  var renderer = html.compile(page, opt)

  var result = renderer.render()

  t.equal(result, '<p><div>hello</div></p>')
})

test('basic page data', async ({ t }) => {
  var page = '<div>{{hello}}</div>'
  var renderer = html.compile(page)

  var result = renderer.render({ hello: 'world' })

  t.equal(result, '<div>world</div>')
})

test('deep page data', async ({ t }) => {
  var page = '<div>{{project.title}}</div>'
  var renderer = html.compile(page)

  var result = renderer.render({ project: { title: 'world' } })

  t.equal(result, '<div>world</div>')
})

test('component props - parent scope', async ({ t }) => {
  var page = '<card greeting="{{greeting}}"></card>'
  var components = ['<template is="card"><div>{{greeting}}</div></template>']
  var opt = { components }

  var renderer = html.compile(page, opt)

  var result = renderer.render({ greeting: 'hello' })

  t.equal(result, '<div>hello</div>')
})

test('component props - local scope', async ({ t }) => {
  var page = '<card greeting="{{greeting}}"></card>'
  var components = [
    '<template is="card"><div>{{props.greeting}}</div></template>',
  ]
  var opt = { components }

  var renderer = html.compile(page, opt)

  var result = renderer.render({ greeting: 'hello' })

  t.equal(result, '<div>hello</div>')
})

test('component html props', async ({ t }) => {
  var page = '<card item="<div>{{greeting}}</div>">></card>'
  var components = ['<template is="card">{{props.item}}</template>']
  var opt = { components }

  var renderer = html.compile(page, opt)

  var result = renderer.render({ greeting: 'hello' })

  t.equal(result, '<div>hello</div>')
})

test('component template props', async ({ t }) => {
  var page = '<card item="{{`<div>${5}</div>`}}"></card>'
  var components = ['<template is="card">{{props.item}}</template>']
  var opt = { components }

  var renderer = html.compile(page, opt)

  var result = renderer.render({ greeting: 'hello' })

  t.equal(result, '<div>5</div>')
})

test('component empty props', async ({ t }) => {
  var page = `<card item="{{}}"></card>`
  var components = ['<template is="card"><div>{{props.item}}</div></template>']
  var opt = { components }

  var renderer = html.compile(page, opt)

  var result = renderer.render({})

  t.equal(result, '<div></div>')
})

test('component function props', async ({ t }) => {
  var page = `<card item="{{(function(){ return 'hello' }()}}"></card>`
  var components = ['<template is="card"><div>{{props.item}}</div></template>']
  var opt = { components }

  var renderer = html.compile(page, opt)

  var result = renderer.render({})

  t.equal(result, '<div></div>')
})

test('deep component props', async ({ t }) => {
  var page = '<card greeting="{{greeting}}"></card>'
  var components = [
    '<template is="card"><heading greeting="{{props.greeting}}"></heading></template>',
    '<template is="heading"><div>{{props.greeting}}</div></template>',
  ]
  var opt = { components }

  var renderer = html.compile(page, opt)

  var result = renderer.render({ greeting: 'hello' })

  t.equal(result, '<div>hello</div>')
})

test('map component props', async ({ t }) => {
  var page =
    '<ul><li map="p of projects"><card project="{{p}}"></card></li></ul>'
  var components = [
    '<template is="card"><a>{{props.project.name}}</a></template>',
  ]
  var opt = { components }

  var renderer = html.compile(page, opt)

  var data = { projects: [{ name: '1' }, { name: '2' }] }

  var result = renderer.render(data)

  t.equal(result, '<ul><li><a>1</a></li><li><a>2</a></li></ul>')
})

test('double and triple braces', async ({ t }) => {
  var page = '<div>{{msg}} {{{msg}}}</div>'
  var expected = '<div>Hello {Hello}</div>'
  var renderer = html.compile(page)
  var result = renderer.render({ msg: 'Hello' })
  t.equal(result, expected)
})

test('pipe on attr', async ({ t }) => {
  var page = '<div data-test="{{msg1 |> truncate 2}}"></div>'
  var expected = '<div data-test="He"></div>'

  var pipes = {
    truncate: (a, b) => (a.length > b ? a.slice(0, b) : a),
  }

  var renderer = html.compile(page, { pipes })
  var result = renderer.render({ msg1: 'Hello' })
  t.equal(result, expected)
})

test('pipe with args', async ({ t }) => {
  var page =
    '<div>{{msg |> pipe1 0 |> pipe2 "0" |> pipe3 true |> pipe4 {n: "0"} |> pipe5 ["0"] |> pipe6 value}}</div>'

  var pipes = {
    pipe1: (_, arg) => {
      t.strictEqual(arg, 0)
      return 'h'
    },
    pipe2: (text, arg) => {
      t.strictEqual(arg, '0')
      return text + 'e'
    },
    pipe3: (text, arg) => {
      t.strictEqual(arg, true)
      return text + 'l'
    },
    pipe4: (text, arg) => {
      t.strictEqual(arg.n, '0')
      return text + 'l'
    },
    pipe5: (text, arg) => {
      t.strictEqual(arg[0], '0')
      return text + 'o'
    },
    pipe6: (text, arg) => {
      t.strictEqual(arg, 5)
      return text + '!'
    },
  }

  var renderer = html.compile(page, { pipes })
  var result = renderer.render({ msg: '', value: 5 })
  t.equal(result, '<div>hello!</div>')
})

test('pipe with function args', async ({ t }) => {
  var page = '<div>{{msg1 |> fallback x()}}</div>'
  var expected = '<div>Hellobye</div>'

  globalThis.x = function () {
    return 'bye'
  }

  var pipes = {
    fallback: function (a, b) {
      return a + b
    },
  }

  var renderer = html.compile(page, { pipes })
  var result = renderer.render({ msg1: 'Hello' })

  t.equal(result, expected)
})

test('literal on embedded js', async ({ t }) => {
  var page = '<script>var items = "{{msg}}"</script>'
  var expected = '<script>var items = "Hello"</script>'

  var renderer = html.compile(page)
  var result = renderer.render({ msg: 'Hello' })
  t.equal(result, expected)
})

test('literal and pipe on embedded js', async ({ t }) => {
  var page = '<script>var items = {{msg |> stringify}}</script>'
  var expected = '<script>var items = {"greeting":"Hello"}</script>'

  var pipes = {
    stringify: (a) => JSON.stringify(a),
  }

  var renderer = html.compile(page, { pipes })
  var result = renderer.render({ msg: { greeting: 'Hello' } })
  t.equal(result, expected)
})

test('boolean attribute - empty', async ({ t }) => {
  var page = '<button disabled>hello</button>'

  var renderer = html.compile(page)
  var data = {}
  var result = renderer.render(data)

  t.equal(result, '<button disabled>hello</button>')
})

test('boolean attribute - string', async ({ t }) => {
  var page = '<button disabled="true">hello</button>'

  var renderer = html.compile(page)
  var data = {}
  var result = renderer.render(data)

  t.equal(result, '<button disabled="true">hello</button>')
})

test('boolean attribute expression - true', async ({ t }) => {
  var page = '<button disabled="{{true}}">hello</button>'

  var renderer = html.compile(page)
  var data = {}
  var result = renderer.render(data)

  t.equal(result, '<button disabled>hello</button>')
})

test('boolean attribute expression - false', async ({ t }) => {
  var page = '<button disabled="{{false}}">hello</button>'

  var renderer = html.compile(page)
  var data = {}
  var result = renderer.render(data)

  t.equal(result, '<button >hello</button>')
})

test('non-html6 template tag', async ({ t }) => {
  var component = '<template is="component"><template x-if="true">hello</template><span>world</span></template>'
  var page = '<component></component>'

  var renderer = html.compile(page, { components: [component] })
  var data = {}
  var result = renderer.render(data)

  t.equal(result, '<template x-if="true">hello</template><span>world</span>')
})

test('non-html6 template tag - expression & slot', async ({ t }) => {
  var component = '<template is="component"><slot></slot></template>'
  var page = '<component><template x-if="true">{{value1}}</template><span>{{value2}}</span></component>'

  var renderer = html.compile(page, { components: [component] })
  var data = { value1: 'hello', value2: 'world' }
  var result = renderer.render(data)

  t.equal(result, '<template x-if="true">hello</template><span>world</span>')
})

test('multiline component definition', async ({ t }) => {
  var component = `<template
    is="card"
    foo="bar"
  ><h1>{{value}}</h1></template>`
  var page = '<card></card>'

  var renderer = html.compile(page, { components: [component] })
  var data = { value: 'world' }
  var result = renderer.render(data)

  t.equal(result, '<h1>world</h1>')
})
