import { describe, expect, it } from 'vitest'
import {
  createDrops,
  defeatKnight,
  defeatOgre,
  isAvailable,
  pickUp,
  putDown,
  remainingLife,
  slotOfSymbol,
  tick,
  use,
  type DropsState,
} from '../../src/lib/domain/drops'

const T = { symbolLifetime: 10_000, respawnDelay: 3_000 }

/** Ronda con los tres caballeros derrotados en `t`. */
function allDropped(t = 0): DropsState {
  return defeatKnight(defeatKnight(defeatKnight(createDrops(), 'left', t), 'mid', t), 'right', t)
}

describe('knights', () => {
  it('start alive: no symbol available', () => {
    const state = createDrops()
    expect(isAvailable(state, 'circle')).toBe(false)
  })

  it('drop their symbol when defeated', () => {
    const state = defeatKnight(createDrops(), 'left', 0)
    expect(isAvailable(state, 'circle')).toBe(true)
    expect(isAvailable(state, 'triangle')).toBe(false)
  })

  it('map to the symbol each one drops', () => {
    expect(slotOfSymbol('circle')).toBe('left')
    expect(slotOfSymbol('triangle')).toBe('mid')
    expect(slotOfSymbol('square')).toBe('right')
  })

  it('cannot be defeated twice', () => {
    const once = defeatKnight(createDrops(), 'left', 0)
    expect(defeatKnight(once, 'left', 5_000)).toBe(once)
  })
})

describe('expiry', () => {
  it('expires an unused symbol after its lifetime', () => {
    const dropped = defeatKnight(createDrops(), 'left', 0)
    expect(tick(dropped, 9_999, T).expired).toEqual([])
    const result = tick(dropped, 10_000, T)
    expect(result.expired).toEqual(['circle'])
    expect(isAvailable(result.state, 'circle')).toBe(false)
  })

  it('does not expire while held', () => {
    const held = pickUp(defeatKnight(createDrops(), 'left', 0), 'circle')
    expect(tick(held, 60_000, T).expired).toEqual([])
  })

  it('restarts the countdown when put down', () => {
    const putBack = putDown(pickUp(defeatKnight(createDrops(), 'left', 0), 'circle'), 'circle', 8_000)
    expect(tick(putBack, 17_999, T).expired).toEqual([])
    expect(tick(putBack, 18_000, T).expired).toEqual(['circle'])
  })

  it('reports the remaining life fraction', () => {
    const { slots } = defeatKnight(createDrops(), 'left', 0)
    expect(remainingLife(slots.left, 0, T)).toBe(1)
    expect(remainingLife(slots.left, 2_500, T)).toBe(0.75)
    expect(remainingLife(slots.left, 20_000, T)).toBe(0)
    expect(remainingLife(slots.mid, 0, T)).toBe(0)
  })
})

describe('rounds', () => {
  it('using a symbol spends it', () => {
    const state = use(allDropped(), 'circle')
    expect(state.slots.left.status).toBe('used')
    expect(state.ogres).toBeNull()
  })

  it('ogres appear once all three are used', () => {
    const state = use(use(use(allDropped(), 'circle'), 'triangle'), 'square')
    expect(state.ogres).toEqual({ left: true, right: true })
  })

  it('ogres appear once all three are used or expired', () => {
    const used = use(use(allDropped(), 'circle'), 'triangle')
    const result = tick(used, 10_000, T)
    expect(result.expired).toEqual(['square'])
    expect(result.ogresAppeared).toBe(true)
    expect(result.state.ogres).toEqual({ left: true, right: true })
  })

  it('knights return after defeating both ogres and the respawn delay', () => {
    let state = use(use(use(allDropped(), 'circle'), 'triangle'), 'square')
    state = defeatOgre(state, 'left', 1_000, T)
    expect(state.ogres).toEqual({ left: false, right: true })
    expect(state.respawnAt).toBeNull()

    state = defeatOgre(state, 'right', 2_000, T)
    expect(state.ogres).toBeNull()
    expect(state.respawnAt).toBe(5_000)

    expect(tick(state, 4_999, T).knightsReturned).toBe(false)
    const back = tick(state, 5_000, T)
    expect(back.knightsReturned).toBe(true)
    expect(back.state).toEqual(createDrops())
  })

  it('ogres cannot be defeated when absent or twice', () => {
    const noOgres = allDropped()
    expect(defeatOgre(noOgres, 'left', 0, T)).toBe(noOgres)
    const withOgres = use(use(use(allDropped(), 'circle'), 'triangle'), 'square')
    const once = defeatOgre(withOgres, 'left', 0, T)
    expect(defeatOgre(once, 'left', 0, T)).toBe(once)
  })

  it('spent symbols cannot be picked up or used again', () => {
    const state = use(allDropped(), 'circle')
    expect(pickUp(state, 'circle')).toBe(state)
    expect(use(state, 'circle')).toBe(state)
  })
})
