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
  store.newGame(scenario, { mode })
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

  describe('dropAt (drag and drop)', () => {
    it('deposits the dropped symbol without holding it first', () => {
      const { store, session } = setup()
      store.dropAt('left', 'circle')
      expect(session().feedback).toEqual({ kind: 'marked', deposit: { slot: 'left', symbol: 'circle' } })
      store.dropAt('mid', 'triangle')
      expect(session().state.swaps).toBe(1)
      expect(session().state.statues).toEqual({ left: 'cone', mid: 'cone', right: 'cube' })
    })

    it('rejects invalid drops like a tap deposit', () => {
      const { store, session } = setup()
      store.dropAt('left', 'square')
      expect(session().feedback).toEqual({
        kind: 'rejected',
        error: 'symbol-not-in-shape',
        deposit: { slot: 'left', symbol: 'square' },
      })
    })

    it('empties the hand after a successful drop', () => {
      const { store, session } = setup()
      store.toggleHold('square')
      store.dropAt('left', 'circle')
      expect(session().held).toBeNull()
    })

    it('mixes with tap deposits in the same swap', () => {
      const { store, session } = setup()
      store.toggleHold('circle')
      store.depositAt('left')
      store.dropAt('right', 'square')
      expect(session().state.swaps).toBe(1)
    })
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

describe('game store with symbol rounds', () => {
  function setupRounds() {
    let clock = 0
    const store = createGameStore({ now: () => clock, random: () => 0, timings: { symbolLifetime: 10_000, respawnDelay: 3_000 } })
    store.newGame(scenario, { mode: 'normal', rounds: true })
    return { store, at: (ms: number) => (clock = ms), session: () => get(store) }
  }

  it('starts with knights and no symbols available', () => {
    const { store, session } = setupRounds()
    expect(session().drops?.slots.left.status).toBe('knight')
    store.toggleHold('circle')
    expect(session().held).toBeNull()
    expect(session().feedback).toEqual({ kind: 'symbol-unavailable', symbol: 'circle' })
  })

  it('defeating a knight makes its symbol available', () => {
    const { store, session } = setupRounds()
    store.defeatKnight('left')
    expect(session().feedback).toEqual({ kind: 'knight-defeated', symbol: 'circle' })
    store.toggleHold('circle')
    expect(session().held).toBe('circle')
  })

  it('a deposited symbol is spent', () => {
    const { store, session } = setupRounds()
    store.defeatKnight('left')
    store.dropAt('left', 'circle')
    expect(session().feedback?.kind).toBe('marked')
    expect(session().drops?.slots.left.status).toBe('used')
    store.dropAt('mid', 'circle')
    expect(session().feedback).toEqual({ kind: 'symbol-unavailable', symbol: 'circle' })
  })

  it('a rejected deposit does not spend the symbol', () => {
    const { store, session } = setupRounds()
    store.defeatKnight('right')
    store.dropAt('left', 'square') // la esfera no tiene cuadrado
    expect(session().feedback?.kind).toBe('rejected')
    expect(session().drops?.slots.right.status).toBe('dropped')
  })

  it('unused symbols expire on tick, but not while held', () => {
    const { store, session, at } = setupRounds()
    store.defeatKnight('left')
    store.defeatKnight('mid')
    store.toggleHold('triangle')
    at(10_000)
    store.tick()
    expect(session().feedback).toEqual({ kind: 'expired', symbols: ['circle'] })
    expect(session().drops?.slots.mid.status).toBe('dropped')
  })

  it('ticks without changes keep the same session', () => {
    const { store, session } = setupRounds()
    const before = session()
    store.tick()
    expect(session()).toBe(before)
  })

  it('full round: ogres appear, are defeated and knights return', () => {
    const { store, session, at } = setupRounds()
    store.defeatKnight('left')
    store.defeatKnight('mid')
    store.defeatKnight('right')
    store.dropAt('left', 'circle')
    store.dropAt('mid', 'triangle')
    at(10_000)
    store.tick() // caduca el cuadrado
    expect(session().feedback).toEqual({ kind: 'ogres-appeared' })

    store.defeatOgre('left')
    store.defeatOgre('right')
    at(12_999)
    store.tick()
    expect(session().drops?.slots.left.status).toBe('used')
    at(13_000)
    store.tick()
    expect(session().feedback).toEqual({ kind: 'knights-returned' })
    expect(session().drops?.slots.left.status).toBe('knight')
  })

  it('restart keeps rounds and resets them', () => {
    const { store, session } = setupRounds()
    store.defeatKnight('left')
    store.restart()
    expect(session().rounds).toBe(true)
    expect(session().drops?.slots.left.status).toBe('knight')
  })
})
