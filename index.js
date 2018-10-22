const {
  curry, compose, not, isNil, prop, objOf, identity, ifElse, merge, any, map,
  chain, pickAll, pick, concat, values, apply, always
} = require('ramda')
const { Right, Left } = require('monet')
const { Future } = require('./future')
const { mem } = require('./mem')
const Fluture = require('fluture')

const all = compose(p => p.then(ifElse(any(isLeft), Left, Right)), a => Promise.all(a))
const cms = curry((name, fn, ctx) => compose(chain(r => map(merge(r), ctx)), map(objOf(name)), chain(fn))(ctx))
const hasIt = name => compose(not, isNil, prop(name))
const headMaybe = x => x.headMaybe()
const isLeft = either => either.isLeft()
const isNone = maybe => maybe.isNone()
const isRight = either => either.isRight()
const isSome = maybe => maybe.isSome()
const mapRej = curry((fn, fun) => fun.mapRej(fn))
const chainRej = curry((fn, fun) => fun.chainRej(fn))
const mergeMap = curry((name, f, ctx) => compose(map(compose(merge(ctx), objOf(name))), f)(ctx))
const mergeToState = curry((name, fn, state) => compose(merge(state), objOf(name), fn)(state))
const mms = mergeMap
const ms = mergeToState
const reject = x => Future.reject(x)
const resolve = x => Future.resolve(x)
const then = curry((fn, promise) => promise.then(ifElse(isRight, compose(fn, prop('value')), identity)))
const thenMergeToState = curry((name, fn, state) => then(compose(resolve, merge(state), objOf(name)), fn(state)))
const thenMs = curry((name, fn) => then(ms(name, fn)))
const pickParams2 = curry((keys1, keys2, applicable, params) => compose(
  map(apply(applicable)),
  map((params) => [
    pick(keys1, params),
    pick(keys2, params)
  ]),
  ifElse(compose(any(isNil), values), Left, Right),
  pickAll(concat(keys1, keys2))
)(params))
const composeNow = (...args) => compose(...args)()

// Fluture Migration
const futureToPromise = fluture => new Promise((resolve, reject) => fluture.fork(e => resolve(Left(e)), ok => resolve(Right(ok))))
const promiseToFuture = promise => Fluture((reject, resolve) => { promise.then(either => either.isRight() ? resolve(either.value) : reject(either.value)).catch(either => reject(either.value)) })
const eitherToFuture = either => (either.isLeft() ? Fluture.reject(either.value) : Fluture.of(either.value))
const callVoidPromise = curry((fn, args, ctx) => composeNow(
  map(objOf('context')),
  map(always(ctx)),
  promiseToFuture,
  args => fn(...args),
  () => concat(args, [ ctx ])
))
const callPromise = curry((name, fn, args) => composeNow(
  map(objOf(name)),
  promiseToFuture,
  () => fn(...args)
))
const parallel = x => Fluture.parallel(5, x)

module.exports = {
  Future,
  all,
  callPromise,
  callVoidPromise,
  chainRej,
  cms,
  composeNow,
  eitherToFuture,
  futureToPromise,
  hasIt,
  headMaybe,
  isLeft,
  isNone,
  isRight,
  isSome,
  mapRej,
  mem,
  mergeMap,
  mergeToState,
  mms,
  ms,
  parallel,
  pickParams2,
  promiseToFuture,
  reject,
  resolve,
  then,
  thenMergeToState,
  thenMs,
}
