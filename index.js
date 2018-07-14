const {
  curry, compose, not, isNil, prop, objOf, identity, ifElse, merge, any, map
} = require('ramda')
const { Right, Left } = require('monet')

const hasIt = name => compose(not, isNil, prop(name))
const isLeft = either => either.isLeft()
const isRight = either => either.isRight()
const isSome = maybe => maybe.isSome()
const isNone = maybe => maybe.isNone()
const mergeToState = curry((name, fn, state) => compose(merge(state), objOf(name), fn)(state))
const reject = x => Future.reject(x)
const resolve = x => Future.resolve(x)
const then = curry((fn, promise) => promise.then(ifElse(isRight, compose(fn, prop('value')), identity)))
const thenMergeToState = curry((name, fn, state) => then(compose(resolve, merge(state), objOf(name)), fn(state)))
const all = compose(p => p.then(ifElse(any(isLeft), Left, Right)), a => Promise.all(a))
const chain = fn => ifElse(isRight, fn, identity)
const ms = mergeToState
const thenMs = curry((name, fn) => then(ms(name, fn)))
// mergeMap :: Functor f => n -> ( a -> f ) -> c -> Functor(c)
const mergeMap = curry((name, f, ctx) => compose(map(compose(merge(ctx), objOf(name))), f)(ctx))
const headMaybe = x => x.headMaybe()

class Future {
  static resolve(x) {
   return new Future(Promise.resolve(Right(x)))
  }
  static reject(x) {
   return new Future(Promise.resolve(Left(x)))
  }
  static of(x) {
    return new Future(x)
  }
  constructor(promise) {
    this.value = promise
  }
  map(f) {
    return Future.of(this.value.then(map(f)))
  }
  // ap :: Apply f => f a ~> f (a -> b) -> f b
  ap(f) {
    return f.map(this.value)
  }
  then(f) {
    return Future.of(this.value.then(f))
  }
  catch(f) {
    return Future.of(this.value.catch(f))
  }
}

module.exports = {
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
