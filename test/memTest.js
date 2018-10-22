const test = require('ava')
const Future = require('fluture')
const { mem } = require('../mem')
const { futureToPromise } = require('../index')

const data = { hy: 'hello' }

test('mem', async t => {
  const first = await futureToPromise(mem('hy', () => Future.of(data)))
  t.deepEqual(first.value, data)

  const second = await futureToPromise(mem('hy', () => t.fail()))
  t.deepEqual(second.value, data)
})
