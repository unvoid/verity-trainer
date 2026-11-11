import { describe, expect, it } from 'vitest'
import { createGameState, deposit, depositError, swapSymbols } from '../../src/lib/domain/swap'
import type { GameState, Scenario } from '../../src/lib/domain/types'

const scenario: Scenario = {
  callouts: { left: 'circle', mid: 'triangle', right: 'square' },
  statues: { left: 'sphere', mid: 'tetrahedron', right: 'cube' },
}

function depositOk(state: GameState, slot: 'left' | 'mid' | 'right', symbol: 'circle' | 'square' | 'triangle') {
  const result = deposit(state, { slot, symbol })
  if (!result.ok) throw new Error(`Unexpected deposit error: ${result.error}`)
  return result
}

describe('createGameState', () => {
  it('starts with no selection and no swaps', () => {
    expect(createGameState(scenario, 1000)).toEqual({ ...scenario, selection: null, swaps: 0, startedAt: 1000 })
  })
})

describe('swapSymbols', () => {
  it('exchanges the deposited symbols between both statues', () => {
    const statues = swapSymbols(scenario.statues, { slot: 'left', symbol: 'circle' }, { slot: 'mid', symbol: 'triangle' })
    expect(statues).toEqual({ left: 'cone', mid: 'cone', right: 'cube' })
  })

  it('does not mutate the input', () => {
    const before = { ...scenario.statues }
    swapSymbols(scenario.statues, { slot: 'left', symbol: 'circle' }, { slot: 'right', symbol: 'square' })
    expect(scenario.statues).toEqual(before)
  })

  it('throws on the same statue', () => {
    expect(() =>
      swapSymbols(scenario.statues, { slot: 'left', symbol: 'circle' }, { slot: 'left', symbol: 'circle' }),
    ).toThrow()
  })
})

describe('deposit', () => {
  const initial = createGameState(scenario, 0)

  it('rejects a symbol the shape does not contain', () => {
    expect(depositError(initial, { slot: 'left', symbol: 'square' })).toBe('symbol-not-in-shape')
    expect(deposit(initial, { slot: 'left', symbol: 'square' })).toEqual({ ok: false, error: 'symbol-not-in-shape' })
  })

  it('first deposit marks the statue without swapping', () => {
    const result = depositOk(initial, 'left', 'circle')
    expect(result.swapped).toBe(false)
    expect(result.state.selection).toEqual({ slot: 'left', symbol: 'circle' })
    expect(result.state.statues).toEqual(scenario.statues)
    expect(result.state.swaps).toBe(0)
  })

  it('rejects a second deposit on the marked statue', () => {
    const marked = depositOk(initial, 'left', 'circle').state
    expect(deposit(marked, { slot: 'left', symbol: 'circle' })).toEqual({
      ok: false,
      error: 'statue-already-selected',
    })
  })

  it('second deposit swaps, clears the selection and counts', () => {
    const marked = depositOk(initial, 'left', 'circle').state
    const result = depositOk(marked, 'right', 'square')
    expect(result.swapped).toBe(true)
    expect(result.state.statues).toEqual({ left: 'cylinder', mid: 'tetrahedron', right: 'cylinder' })
    expect(result.state.selection).toBeNull()
    expect(result.state.swaps).toBe(1)
  })

  it('validates the second deposit against the current shape', () => {
    const marked = depositOk(initial, 'left', 'circle').state
    expect(deposit(marked, { slot: 'mid', symbol: 'circle' })).toEqual({ ok: false, error: 'symbol-not-in-shape' })
  })

  it('does not mutate the previous state', () => {
    const marked = depositOk(initial, 'left', 'circle').state
    depositOk(marked, 'right', 'square')
    expect(marked.selection).toEqual({ slot: 'left', symbol: 'circle' })
    expect(marked.statues).toEqual(scenario.statues)
  })
})
