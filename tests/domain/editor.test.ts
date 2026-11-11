import { describe, expect, it } from 'vitest'
import {
  calloutOptions,
  completeDraft,
  EMPTY_DRAFT,
  selectCallout,
  selectStatue,
  statueOptions,
  type CalloutsDraft,
  type StatuesDraft,
} from '../../src/lib/domain/editor'
import { countStatueSymbols, validateScenario } from '../../src/lib/domain/rules'
import { allCalloutOrders, allStatueCombinations, statuesKey } from '../../src/lib/domain/scenarios'
import { SHAPES, SLOTS, SYMBOLS, type Statues } from '../../src/lib/domain/types'

const isBalanced = (statues: Statues) => SYMBOLS.every((s) => countStatueSymbols(statues)[s] === 2)
const balanced = allStatueCombinations().filter(isBalanced)

describe('callouts', () => {
  const full: CalloutsDraft = { left: 'circle', mid: 'triangle', right: 'square' }

  it('changing a complete group clears the other two', () => {
    expect(selectCallout(full, 'mid', 'square')).toEqual({ left: null, mid: 'square', right: null })
  })

  it('autocompletes the third after choosing two', () => {
    const one = selectCallout(full, 'left', 'square')
    expect(selectCallout(one, 'right', 'circle')).toEqual({ left: 'square', mid: 'triangle', right: 'circle' })
  })

  it('replaces the only chosen slot without completing', () => {
    const one = selectCallout(full, 'left', 'square')
    expect(selectCallout(one, 'left', 'circle')).toEqual({ left: 'circle', mid: null, right: null })
  })

  it('offers every symbol when the group is complete', () => {
    expect(calloutOptions(full, 'left')).toEqual([...SYMBOLS])
  })

  it('hides symbols already used in other slots', () => {
    const one = selectCallout(full, 'left', 'square')
    expect(calloutOptions(one, 'mid')).toEqual(['circle', 'triangle'])
    expect(calloutOptions(one, 'left')).toEqual([...SYMBOLS])
  })

  it('every pair of choices leads to a valid order (all 6 reachable)', () => {
    const reached = new Set<string>()
    for (const first of SLOTS) {
      for (const a of SYMBOLS) {
        const one = selectCallout(full, first, a)
        for (const second of SLOTS.filter((s) => s !== first)) {
          for (const b of calloutOptions(one, second)) {
            const done = completeDraft(selectCallout(one, second, b))
            expect(done).not.toBeNull()
            expect(new Set(Object.values(done!)).size).toBe(3)
            reached.add(Object.values(done!).join('|'))
          }
        }
      }
    }
    expect(reached.size).toBe(allCalloutOrders().length)
  })
})

describe('statues', () => {
  const full: StatuesDraft = { left: 'sphere', mid: 'tetrahedron', right: 'cube' }

  it('changing a complete group clears the other two', () => {
    expect(selectStatue(full, 'left', 'prism')).toEqual({ left: 'prism', mid: null, right: null })
  })

  it('autocompletes the third with the missing symbols', () => {
    const one = selectStatue(full, 'left', 'sphere')
    expect(selectStatue(one, 'mid', 'prism')).toEqual({ left: 'sphere', mid: 'prism', right: 'prism' })
  })

  it('does not offer shapes that would exceed two of a symbol', () => {
    const one = selectStatue(full, 'left', 'sphere')
    expect(statueOptions(one, 'mid')).toEqual(['cube', 'tetrahedron', 'prism'])
  })

  it('offers every shape for the only chosen slot and when complete', () => {
    const one = selectStatue(full, 'left', 'sphere')
    expect(statueOptions(one, 'left')).toEqual([...SHAPES])
    expect(statueOptions(full, 'mid')).toEqual([...SHAPES])
  })

  it('every offered pair completes to a balanced group, and all 21 are reachable', () => {
    const reached = new Set<string>()
    for (const first of SLOTS) {
      for (const a of SHAPES) {
        const one = selectStatue(full, first, a)
        for (const second of SLOTS.filter((s) => s !== first)) {
          for (const b of SHAPES) {
            const done = completeDraft(selectStatue(one, second, b))
            const offered = statueOptions(one, second).includes(b)
            // Se ofrece si y solo si completa a un grupo válido.
            expect(done !== null && isBalanced(done)).toBe(offered)
            if (done) reached.add(statuesKey(done))
          }
        }
      }
    }
    expect(reached).toEqual(new Set(balanced.map(statuesKey)))
  })
})

describe('result passes validation', () => {
  it('any completed draft satisfies rules 1 and 2', () => {
    const callouts = selectCallout(selectCallout(EMPTY_DRAFT, 'left', 'triangle'), 'mid', 'circle')
    const statues = selectStatue(selectStatue(EMPTY_DRAFT, 'right', 'cone'), 'mid', 'cube')
    const result = validateScenario({ callouts: completeDraft(callouts)!, statues: completeDraft(statues)! })
    expect(result.issues.filter((issue) => issue.severity === 'error')).toEqual([])
  })
})
