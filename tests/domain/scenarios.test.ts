import { describe, expect, it } from 'vitest'
import { countStatueSymbols, validateScenario } from '../../src/lib/domain/rules'
import {
  allCalloutOrders,
  allScenarios,
  allStatueCombinations,
  randomScenario,
  statuesKey,
} from '../../src/lib/domain/scenarios'
import { swapSymbols } from '../../src/lib/domain/swap'
import { contains } from '../../src/lib/domain/shapes'
import { SLOTS, SYMBOLS, type Callouts } from '../../src/lib/domain/types'

const calloutsKey = (callouts: Callouts) => SLOTS.map((slot) => callouts[slot]).join('|')

const balanced = allStatueCombinations().filter((statues) =>
  SYMBOLS.every((symbol) => countStatueSymbols(statues)[symbol] === 2),
)

describe('enumeration', () => {
  it('has 6 callout orders', () => {
    const orders = allCalloutOrders()
    expect(orders).toHaveLength(6)
    expect(new Set(orders.map(calloutsKey)).size).toBe(6)
  })

  it('has 216 raw statue combinations, all distinct', () => {
    const combinations = allStatueCombinations()
    expect(combinations).toHaveLength(216)
    expect(new Set(combinations.map(statuesKey)).size).toBe(216)
  })

  it('has 21 statue combinations with two of each symbol', () => {
    expect(balanced).toHaveLength(21)
  })

  it('leaves 6 valid statue combinations per callout order with rule 3', () => {
    const scenarios = allScenarios()
    expect(scenarios).toHaveLength(36)
    for (const callouts of allCalloutOrders()) {
      expect(scenarios.filter((s) => calloutsKey(s.callouts) === calloutsKey(callouts))).toHaveLength(6)
    }
  })

  it('without rule 3 every balanced combination is valid', () => {
    expect(allScenarios({ unsolvedStart: 'off' })).toHaveLength(6 * 21)
  })

  it('every generated scenario passes validation', () => {
    for (const scenario of allScenarios()) {
      expect(validateScenario(scenario, { unsolvedStart: 'enforce' }).valid).toBe(true)
    }
  })
})

describe('symbol count invariant', () => {
  it('swaps never change how many of each symbol there are', () => {
    for (const statues of balanced) {
      for (const [i, a] of SLOTS.entries()) {
        for (const b of SLOTS.slice(i + 1)) {
          for (const x of SYMBOLS.filter((s) => contains(statues[a], s))) {
            for (const y of SYMBOLS.filter((s) => contains(statues[b], s))) {
              const next = swapSymbols(statues, { slot: a, symbol: x }, { slot: b, symbol: y })
              expect(countStatueSymbols(next)).toEqual({ circle: 2, square: 2, triangle: 2 })
            }
          }
        }
      }
    }
  })
})

describe('randomScenario', () => {
  it('uses the injected random source', () => {
    const scenarios = allScenarios()
    expect(randomScenario(() => 0)).toEqual(scenarios[0])
    expect(randomScenario(() => 0.999999)).toEqual(scenarios.at(-1))
  })

  it('always returns a valid scenario', () => {
    for (let i = 0; i < 50; i++) {
      expect(validateScenario(randomScenario(), { unsolvedStart: 'enforce' }).valid).toBe(true)
    }
  })
})
