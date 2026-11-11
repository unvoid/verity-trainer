import { describe, expect, it } from 'vitest'
import { countStatueSymbols, isSolved } from '../../src/lib/domain/rules'
import { allScenarios, allStatueCombinations, statuesKey } from '../../src/lib/domain/scenarios'
import { isPure } from '../../src/lib/domain/shapes'
import {
  challengeTargets,
  findShortestPath,
  minimumSwaps,
  solve,
  solveTowards,
  usefulSwaps,
} from '../../src/lib/domain/solver'
import { createGameState, deposit } from '../../src/lib/domain/swap'
import { SLOTS, SYMBOLS, type GameState, type Mode, type Scenario, type Statues } from '../../src/lib/domain/types'

const MODES: readonly Mode[] = ['normal', 'challenge']

/** Ejecuta una solución con la API de depósitos, como lo haría un jugador. */
function play(scenario: Scenario, mode: Mode): GameState {
  const solution = solve(scenario, mode)
  if (!solution) throw new Error('No solution')
  let state = createGameState(scenario, 0)
  for (const swap of solution.swaps) {
    for (const step of [swap.first, swap.second]) {
      const result = deposit(state, step)
      if (!result.ok) throw new Error(`Invalid step: ${result.error}`)
      state = result.state
    }
  }
  return state
}

/**
 * Estados alcanzables en `depth` intercambios o menos, probando todos los
 * depósitos posibles con la API del juego (independiente del solucionador).
 */
function reachableWithin(start: Statues, depth: number): Statues[] {
  const seen = new Map([[statuesKey(start), start]])
  let frontier = [start]
  for (let i = 0; i < depth; i++) {
    const next: Statues[] = []
    for (const statues of frontier) {
      const state = createGameState({ callouts: { left: 'circle', mid: 'square', right: 'triangle' }, statues }, 0)
      for (const a of SLOTS) {
        for (const x of SYMBOLS) {
          const first = deposit(state, { slot: a, symbol: x })
          if (!first.ok) continue
          for (const b of SLOTS) {
            for (const y of SYMBOLS) {
              const second = deposit(first.state, { slot: b, symbol: y })
              if (!second.ok) continue
              const key = statuesKey(second.state.statues)
              if (!seen.has(key)) {
                seen.set(key, second.state.statues)
                next.push(second.state.statues)
              }
            }
          }
        }
      }
    }
    frontier = next
  }
  return [...seen.values()]
}

const scenarios = allScenarios()
/** Las 21 configuraciones de estatuas con dos de cada símbolo. */
const balanced = allStatueCombinations().filter((statues) =>
  SYMBOLS.every((symbol) => countStatueSymbols(statues)[symbol] === 2),
)
const scenariosWithoutRule3 = allScenarios({ unsolvedStart: 'off' })

describe('usefulSwaps', () => {
  it('only pairs distinct statues and distinct symbols', () => {
    for (const swap of usefulSwaps({ left: 'sphere', mid: 'prism', right: 'prism' })) {
      expect(swap.first.slot).not.toBe(swap.second.slot)
      expect(swap.first.symbol).not.toBe(swap.second.symbol)
    }
  })

  it('lists every combination once', () => {
    // sphere(○) con prism(□△): 2 · prism con prism: □↔△ y △↔□ = 2 · sphere con prism: 2
    expect(usefulSwaps({ left: 'sphere', mid: 'prism', right: 'prism' })).toHaveLength(6)
  })
})

describe('solve', () => {
  it('returns an empty solution when already solved', () => {
    const scenario: Scenario = {
      callouts: { left: 'circle', mid: 'triangle', right: 'square' },
      statues: { left: 'cube', mid: 'sphere', right: 'tetrahedron' },
    }
    for (const mode of MODES) {
      expect(solve(scenario, mode)).toEqual({ swaps: [], states: [], final: scenario.statues })
    }
  })

  it('returns null for unsolvable scenarios (rule 2 broken)', () => {
    const scenario: Scenario = {
      callouts: { left: 'circle', mid: 'triangle', right: 'square' },
      statues: { left: 'sphere', mid: 'sphere', right: 'sphere' },
    }
    expect(solve(scenario, 'normal')).toBeNull()
    expect(minimumSwaps(scenario, 'normal')).toBeNull()
  })

  it('records the state after each swap', () => {
    const solution = solve(scenarios[0]!, 'challenge')!
    expect(solution.states).toHaveLength(solution.swaps.length)
    expect(solution.states.at(-1)).toEqual(solution.final)
  })

  describe.each(MODES)('%s mode, every valid scenario', (mode) => {
    it('solves it when played through the deposit API', () => {
      for (const scenario of scenariosWithoutRule3) {
        const state = play(scenario, mode)
        expect(isSolved(state.callouts, state.statues, mode)).toBe(true)
        expect(state.statues).toEqual(solve(scenario, mode)!.final)
      }
    })

    it('is minimal: no shorter sequence solves it', () => {
      for (const scenario of scenariosWithoutRule3) {
        const minimum = minimumSwaps(scenario, mode)!
        if (minimum === 0) continue
        const shorter = reachableWithin(scenario.statues, minimum - 1)
        expect(shorter.some((statues) => isSolved(scenario.callouts, statues, mode))).toBe(false)
      }
    })
  })
})

describe('normal mode minimum', () => {
  it('matches the original simulator rule: 3 if all statues start pure, 2 otherwise', () => {
    for (const scenario of scenarios) {
      const allPure = SLOTS.every((slot) => isPure(scenario.statues[slot]))
      expect(minimumSwaps(scenario, 'normal')).toBe(allPure ? 3 : 2)
    }
  })
})

describe('challenge mode', () => {
  it('targets are pure, free of their callout and distinct', () => {
    for (const { callouts } of scenarios) {
      const { a, b } = challengeTargets(callouts)
      expect(isSolved(callouts, a, 'challenge')).toBe(true)
      expect(isSolved(callouts, b, 'challenge')).toBe(true)
      expect(statuesKey(a)).not.toBe(statuesKey(b))
    }
  })

  it('A and B are the only challenge solutions', () => {
    for (const { callouts } of scenarios) {
      const { a, b } = challengeTargets(callouts)
      const solutions = balanced.filter((statues) => isSolved(callouts, statues, 'challenge')).map(statuesKey)
      expect(solutions.sort()).toEqual([statuesKey(a), statuesKey(b)].sort())
    }
  })

  it('reaches the closer of A and B', () => {
    for (const scenario of scenariosWithoutRule3) {
      const { a, b } = challengeTargets(scenario.callouts)
      const toA = solveTowards(scenario.statues, a)!.swaps.length
      const toB = solveTowards(scenario.statues, b)!.swaps.length
      const solution = solve(scenario, 'challenge')!
      expect(solution.swaps.length).toBe(Math.min(toA, toB))
      expect([statuesKey(a), statuesKey(b)]).toContain(statuesKey(solution.final))
    }
  })

  it('needs 4 swaps from all-pure starts and 2 or 3 otherwise', () => {
    for (const scenario of scenarios) {
      const allPure = SLOTS.every((slot) => isPure(scenario.statues[slot]))
      const minimum = minimumSwaps(scenario, 'challenge')
      if (allPure) expect(minimum).toBe(4)
      else expect([2, 3]).toContain(minimum)
    }
  })
})

describe('state space', () => {
  it('connects all 21 balanced configurations', () => {
    expect(balanced).toHaveLength(21)
    for (const start of balanced) {
      for (const target of balanced) expect(solveTowards(start, target)).not.toBeNull()
    }
  })

  it('findShortestPath returns null when the goal is unreachable', () => {
    expect(findShortestPath({ left: 'sphere', mid: 'cube', right: 'tetrahedron' }, () => false)).toBeNull()
  })
})
