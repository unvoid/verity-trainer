import { get } from 'svelte/store'
import { describe, expect, it } from 'vitest'
import { solve } from '../../src/lib/domain/solver'
import type { Scenario } from '../../src/lib/domain/types'
import { createGameStore } from '../../src/lib/stores/game'

// Callouts ○ △ □ · estatuas esfera, tetraedro, cubo (todas puras: 3 intercambios en modo normal)
const scenario: Scenario = {
  callouts: { left: 'circle', mid: 'triangle', right: 'square' },
  statues: { left: 'sphere', mid: 'tetrahedron', right: 'cube' },
}

function setup(mode: 'normal' | 'challenge' = 'normal') {
  let clock = 1000
  const store = createGameStore({ now: () => clock, random: () => 0 })
  store.newGame(scenario, mode)
  return {
    store,
    advance: (ms: number) => (clock += ms),
    session: () => get(store),
  }
}

describe('game store', () => {
  it('starts a game from a random scenario', () => {
    const store = createGameStore({ now: () => 0, random: () => 0 })
    expect(get(store).state.swaps).toBe(0)
    expect(get(store).finishedAt).toBeNull()
  })

  it('picks up and drops a symbol', () => {
    const { store, session } = setup()
    store.toggleHold('circle')
    expect(session().held).toBe('circle')
    store.toggleHold('square')
    expect(session().held).toBe('square')
    store.toggleHold('square')
    expect(session().held).toBeNull()
  })

  it('asks for a symbol when depositing empty-handed', () => {
    const { store, session } = setup()
    store.depositAt('left')
    expect(session().feedback).toEqual({ kind: 'no-symbol-held', slot: 'left' })
  })

  it('rejects a deposit and keeps the symbol in hand', () => {
    const { store, session } = setup()
    store.toggleHold('square')
    store.depositAt('left')
    expect(session().feedback).toEqual({
      kind: 'rejected',
      error: 'symbol-not-in-shape',
      deposit: { slot: 'left', symbol: 'square' },
    })
    expect(session().held).toBe('square')
  })

  it('marks, then swaps, emptying the hand each time', () => {
    const { store, session } = setup()
    store.toggleHold('circle')
    store.depositAt('left')
    expect(session().feedback).toEqual({ kind: 'marked', deposit: { slot: 'left', symbol: 'circle' } })
    expect(session().held).toBeNull()

    store.toggleHold('triangle')
    store.depositAt('mid')
    expect(session().feedback).toEqual({
      kind: 'swapped',
      swap: { first: { slot: 'left', symbol: 'circle' }, second: { slot: 'mid', symbol: 'triangle' } },
    })
    expect(session().state.swaps).toBe(1)
    expect(session().state.statues).toEqual({ left: 'cone', mid: 'cone', right: 'cube' })
  })

  it('finishes when solved and then ignores input', () => {
    const { store, session, advance } = setup()
    const solution = solve(scenario, 'normal')!
    for (const { first, second } of solution.swaps) {
      expect(session().finishedAt).toBeNull()
      advance(1000)
      store.toggleHold(first.symbol)
      store.depositAt(first.slot)
      store.toggleHold(second.symbol)
      store.depositAt(second.slot)
    }
    expect(session().state.swaps).toBe(3)
    expect(session().state.statues).toEqual(solution.final)
    expect(session().finishedAt).toBe(4000)

    store.toggleHold('circle')
    expect(session().held).toBeNull()
  })

  it('restarts from the same starting point', () => {
    const { store, session } = setup()
    store.toggleHold('circle')
    store.depositAt('left')
    store.restart()
    expect(session().scenario).toEqual(scenario)
    expect(session().state.statues).toEqual(scenario.statues)
    expect(session().state.selection).toBeNull()
    expect(session().held).toBeNull()
  })

  it('keeps the mode across new games', () => {
    const { store, session } = setup('challenge')
    store.newGame()
    expect(session().mode).toBe('challenge')
  })
})
