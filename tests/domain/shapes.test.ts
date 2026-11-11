import { describe, expect, it } from 'vitest'
import {
  compose,
  contains,
  countSymbol,
  decompose,
  isPure,
  pureShapeOf,
  replaceSymbol,
} from '../../src/lib/domain/shapes'
import { SHAPES, SYMBOLS } from '../../src/lib/domain/types'

describe('compose / decompose', () => {
  it('matches the composition table', () => {
    expect(compose('circle', 'circle')).toBe('sphere')
    expect(compose('square', 'square')).toBe('cube')
    expect(compose('triangle', 'triangle')).toBe('tetrahedron')
    expect(compose('circle', 'square')).toBe('cylinder')
    expect(compose('circle', 'triangle')).toBe('cone')
    expect(compose('square', 'triangle')).toBe('prism')
  })

  it('ignores symbol order', () => {
    for (const a of SYMBOLS) {
      for (const b of SYMBOLS) expect(compose(a, b)).toBe(compose(b, a))
    }
  })

  it('round-trips every shape', () => {
    for (const shape of SHAPES) {
      const [a, b] = decompose(shape)
      expect(compose(a, b)).toBe(shape)
    }
  })

  it('maps every symbol pair to a different shape', () => {
    const shapes = new Set<string>()
    for (const [i, a] of SYMBOLS.entries()) {
      for (const b of SYMBOLS.slice(i)) shapes.add(compose(a, b))
    }
    expect(shapes.size).toBe(SHAPES.length)
  })
})

describe('isPure / pureShapeOf', () => {
  it('identifies the pure shapes', () => {
    expect(SHAPES.filter(isPure)).toEqual(['sphere', 'cube', 'tetrahedron'])
  })

  it('returns the pure shape of each symbol', () => {
    expect(pureShapeOf('circle')).toBe('sphere')
    expect(pureShapeOf('square')).toBe('cube')
    expect(pureShapeOf('triangle')).toBe('tetrahedron')
  })
})

describe('contains / countSymbol', () => {
  it('reports the symbols of a shape', () => {
    expect(contains('cone', 'circle')).toBe(true)
    expect(contains('cone', 'triangle')).toBe(true)
    expect(contains('cone', 'square')).toBe(false)
  })

  it('counts repeated symbols', () => {
    expect(countSymbol('sphere', 'circle')).toBe(2)
    expect(countSymbol('cylinder', 'circle')).toBe(1)
    expect(countSymbol('cube', 'circle')).toBe(0)
  })
})

describe('replaceSymbol', () => {
  it('swaps one symbol for another', () => {
    expect(replaceSymbol('sphere', 'circle', 'square')).toBe('cylinder')
    expect(replaceSymbol('cone', 'triangle', 'circle')).toBe('sphere')
    expect(replaceSymbol('prism', 'square', 'triangle')).toBe('tetrahedron')
  })

  it('is a no-op when replacing a symbol with itself', () => {
    expect(replaceSymbol('cone', 'circle', 'circle')).toBe('cone')
  })

  it('throws when the shape lacks the symbol', () => {
    expect(() => replaceSymbol('cube', 'circle', 'square')).toThrow()
  })
})
