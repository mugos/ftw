const {
  curry, compose, not, isNil, prop, objOf, identity, ifElse, merge, any, map
} = require('ramda')
const { Right, Left } = require('monet')
const { Future } = require('./future')
const Fluture = require('fluture')

const all = compose(p => p.then(ifElse(any(isLeft), Left, Right)), a => Promise.all(a))
const chain = fn => ifElse(isRight, fn, identity)
const hasIt = name => compose(not, isNil, prop(name))
const headMaybe = x => x.headMaybe()
const isLeft = either => either.isLeft()
const isNone = maybe => maybe.isNone()
const isRight = either => either.isRight()
const isSome = maybe => maybe.isSome()
const mapRej = fn => f => f.mapRej(fn)
const mergeMap = curry((name, f, ctx) => compose(map(compose(merge(ctx), objOf(name))), f)(ctx))
const mergeToState = curry((name, fn, state) => compose(merge(state), objOf(name), fn)(state))
const ms = mergeToState
const reject = x => Future.reject(x)
const resolve = x => Future.resolve(x)
const then = curry((fn, promise) => promise.then(ifElse(isRight, compose(fn, prop('value')), identity)))
const thenMergeToState = curry((name, fn, state) => then(compose(resolve, merge(state), objOf(name)), fn(state)))
const thenMs = curry((name, fn) => then(ms(name, fn)))

// Fluture Migration
const futureToPromise = fluture => new Promise((resolve, reject) => fluture.fork(e => resolve(Left(e)), ok => resolve(Right(ok))))
const promiseToFuture = promise => Fluture((reject, resolve) => { promise.then(either => either.isRight() ? resolve(either.value) : reject(either.value)) })

module.exports = {
  Future,
  all,
  chain,
  futureToPromise,
  hasIt,
  headMaybe,
  isLeft,
  isNone,
  isRight,
  isSome,
  mergeMap,
  mergeToState,
  ms,
  promiseToFuture,
  reject,
  resolve,
  then,
  thenMergeToState,
  thenMs,
}
