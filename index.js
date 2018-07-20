const {
  curry, compose, not, isNil, prop, objOf, identity, ifElse, merge, any, map
} = require('ramda')
const { Right, Left } = require('monet')
const { Future } = require('./future')

const all = compose(p => p.then(ifElse(any(isLeft), Left, Right)), a => Promise.all(a))
const chain = fn => ifElse(isRight, fn, identity)
const futureToPromise = future => new Promise((resolve, reject) => future.fork(e => resolve(Left(e)), ok => resolve(Right(ok))))
const hasIt = name => compose(not, isNil, prop(name))
const headMaybe = x => x.headMaybe()
const isLeft = either => either.isLeft()
const isNone = maybe => maybe.isNone()
const isRight = either => either.isRight()
const isSome = maybe => maybe.isSome()
// mergeMap :: Functor f => n -> ( a -> f ) -> c -> Functor(c)
const mergeMap = curry((name, f, ctx) => compose(map(compose(merge(ctx), objOf(name))), f)(ctx))
const mergeToState = curry((name, fn, state) => compose(merge(state), objOf(name), fn)(state))
const ms = mergeToState
const promiseToFuture = promise => Future((reject, resolve) => { promise.then(either => either.isRight() ? resolve(either.value) : reject(either.value)) })
const reject = x => Future.reject(x)
const resolve = x => Future.resolve(x)
const then = curry((fn, promise) => promise.then(ifElse(isRight, compose(fn, prop('value')), identity)))
const thenMergeToState = curry((name, fn, state) => then(compose(resolve, merge(state), objOf(name)), fn(state)))
const thenMs = curry((name, fn) => then(ms(name, fn)))

module.exports = {
  futureToPromise,
  promiseToFuture,
  headMaybe,
  mergeMap,
  Future,
  ms,
  chain,
  all,
  hasIt,
  isLeft,
  isRight,
  isSome,
  isNone,
  mergeToState,
  reject,
  resolve,
  then,
  thenMs,
  thenMergeToState,
}
