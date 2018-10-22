// Libs
const Future = require('fluture')
const fs = require('fs')
const { compose, map, chain, objOf, merge, curry } = require('ramda')
const { encase } = require('fluture')
// Deps
const fWrite = (fileName, data) => Future((reject, resolve) => fs.writeFile(fileName, data, 'utf8', (err) => err ? reject(err) : resolve(data)))
const fRead = (fileName) => Future((reject, resolve) => fs.readFile(fileName, 'utf8', (err, data) => err ? reject(err) : resolve(data)))

// Functions
const fileName = (name) => `/tmp/${name}.memoization`

// Implementation
const write = (name) => compose(
  chain(encase(JSON.parse)),
  chain(({ fileName, data }) => fWrite(fileName, data)),
  map(merge({ fileName: fileName(name) })),
  map(objOf('data')),
  encase(JSON.stringify))
const read = compose(chain(encase(JSON.parse)), fRead, fileName)

// Body
const mem = curry((name, fn) => compose(
  chain(write(name)),
  fun => fun.chainRej(fn),
  () => read(name))())

module.exports = { mem }
