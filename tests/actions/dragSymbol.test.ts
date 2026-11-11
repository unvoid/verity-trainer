import { describe, expect, it } from 'vitest'
import { exceedsThreshold, isSlot } from '../../src/lib/actions/dragSymbol'

describe('exceedsThreshold', () => {
  it('is false within the threshold radius', () => {
    expect(exceedsThreshold(0, 0, 6)).toBe(false)
    expect(exceedsThreshold(6, 0, 6)).toBe(false)
    expect(exceedsThreshold(4, 4, 6)).toBe(false)
  })

  it('is true beyond the threshold radius, in any direction', () => {
    expect(exceedsThreshold(7, 0, 6)).toBe(true)
    expect(exceedsThreshold(0, -7, 6)).toBe(true)
    expect(exceedsThreshold(5, 5, 6)).toBe(true)
  })
})

describe('isSlot', () => {
  it('accepts only slot names', () => {
    expect(isSlot('left')).toBe(true)
    expect(isSlot('mid')).toBe(true)
    expect(isSlot('right')).toBe(true)
    expect(isSlot('center')).toBe(false)
    expect(isSlot(undefined)).toBe(false)
  })
})
