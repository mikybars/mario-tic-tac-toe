import { BoundedCounter } from './boundedCounter'

describe('BoundedCounter', () => {
  test('counter without initial value starts at the lower bound', () => {
    expect(new BoundedCounter(3, 5).value).toEqual(3)
  })

  describe('increment', () => {
    describe('counter below upper bound', () => {
      let counter

      beforeEach(() => {
        counter = new BoundedCounter(3, 5, 4)
      })

      test('can be incremented', () => {
        expect(counter.inc().value).toEqual(5)
      })

      test('is incremented when condition holds', () => {
        expect(counter.incIf(true).value).toEqual(5)
      })

      test('is NOT incremented when condition does not hold', () => {
        expect(counter.incIf(false).value).toEqual(4)
      })
    })

    describe('counter at upper bound', () => {
      let counter

      beforeEach(() => {
        counter = new BoundedCounter(3, 5, 5)
      })

      test('cannot be incremented', () => {
        expect(counter.inc().value).toEqual(5)
      })

      test('cannot be incremented even when condition holds', () => {
        expect(counter.incIf(true).value).toEqual(5)
      })
    })
  })

  describe('decrement', () => {
    describe('counter above lower bound', () => {
      let counter

      beforeEach(() => {
        counter = new BoundedCounter(3, 5, 4)
      })

      test('can be decremented', () => {
        expect(counter.dec().value).toEqual(3)
      })

      test('is decremented when condition holds', () => {
        expect(counter.decIf(true).value).toEqual(3)
      })

      test('is NOT decremented when condition does not hold', () => {
        expect(counter.decIf(false).value).toEqual(4)
      })
    })

    describe('counter at lower bound', () => {
      let counter

      beforeEach(() => {
        counter = new BoundedCounter(3, 5)
      })

      test('cannot be decremented', () => {
        expect(counter.dec().value).toEqual(3)
      })

      test('cannot be decremented even when condition holds', () => {
        expect(counter.decIf(true).value).toEqual(3)
      })
    })
  })

  describe('validation', () => {
    test('lower bound and upper bound can be equal', () => {
      expect(() => new BoundedCounter(3, 3)).not.toThrow()
    })

    test('lower bound cannot be greater than upper bound', () => {
      expect(() => new BoundedCounter(3, 2)).toThrow()
    })

    test.each([3, 4, 5])('counter %i [3, 5] is valid', (v) => {
      expect(() => new BoundedCounter(3, 5, v)).not.toThrow()
    })

    test.each([2, 6])('counter %i [3, 5] is NOT valid', (v) => {
      expect(() => new BoundedCounter(3, 5, v)).toThrow()
    })
  })
})
