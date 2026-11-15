import { describe, expect, it } from 'vitest'
import { PIECE_SIZES, sizesFor } from '../../src/lib/stores/viewport'

describe('piece sizes', () => {
  it('uses the regular sizes on wide screens and the compact ones on narrow screens', () => {
    expect(sizesFor(false)).toBe(PIECE_SIZES.regular)
    expect(sizesFor(true)).toBe(PIECE_SIZES.compact)
  })

  it('makes every piece smaller, never larger, on narrow screens', () => {
    for (const key of Object.keys(PIECE_SIZES.regular) as (keyof typeof PIECE_SIZES.regular)[]) {
      expect(PIECE_SIZES.compact[key]).toBeLessThan(PIECE_SIZES.regular[key])
    }
  })
})
