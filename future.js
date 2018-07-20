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
  // Experimental
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
module.exports = { Future }
