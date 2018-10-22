const test = require('ava')
const { pickParams2, composeNow } = require('../index')

test('ok value', t => {
  const { value } = pickParams2(['a'], ['b'], (a, b) => ([ a, b ]), { a: 1, b: 2 })
  t.deepEqual(value, [ { a: 1 }, { b: 2 } ])
})


test('not ok value', t => {
  const resp = pickParams2(['a'], ['c'], (a, b) => ([ a, b ]), { a: 1, b: 2 })
  t.is(resp.isLeft(), true);
})


test('not ok value', t => {
  const resp = composeNow(() => "a", () => "b")
  t.is(resp, "a");
})
