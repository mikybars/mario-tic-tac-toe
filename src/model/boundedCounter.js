export class BoundedCounter {
  constructor(lowerBound, upperBound, value) {
    if (lowerBound > upperBound) {
      throw new RangeError(
        `lowerBound ${lowerBound} must be less or equal than lowerBound ${lowerBound}`
      )
    }
    if (value < lowerBound || value > upperBound) {
      throw new RangeError(
        `value ${value} must be between ${lowerBound} and ${upperBound} inclusive`
      )
    }
    this.lowerBound = lowerBound
    this.upperBound = upperBound
    this.value = value ?? lowerBound
  }

  inc() {
    if (this.value < this.upperBound) {
      return new BoundedCounter(
        this.lowerBound,
        this.upperBound,
        this.value + 1
      )
    }
    return this
  }

  incIf(condition) {
    return condition ? this.inc() : this
  }

  dec() {
    if (this.value > this.lowerBound) {
      return new BoundedCounter(
        this.lowerBound,
        this.upperBound,
        this.value - 1
      )
    }
    return this
  }

  decIf(condition) {
    return condition ? this.dec() : this
  }

  toString() {
    return `${this.value} [${this.lowerBound}, ${this.upperBound}]`
  }
}
