import { get } from 'svelte/store'
import { describe, expect, it } from 'vitest'
import { allScenarios } from '../../src/lib/domain/scenarios'
import { createSetupStore, setupStatus } from '../../src/lib/stores/setup'

function setup() {
  const store = createSetupStore(() => 0)
  const status = setupStatus(store)
  return { store, draft: () => get(store), status: () => get(status) }
}

describe('setup store', () => {
  it('starts with a ready random proposal', () => {
    const { status } = setup()
    expect(status().ready).toBe(true)
    expect(status().scenario).toEqual(allScenarios()[0])
  })

  it('is not ready while a group is being edited', () => {
    const { store, status } = setup()
    store.selectCallout('left', 'square')
    expect(status().ready).toBe(false)
    expect(status().scenario).toBeNull()
  })

  it('becomes ready again once the group is completed', () => {
    const { store, status, draft } = setup()
    store.selectStatue('left', 'sphere')
    store.selectStatue('mid', 'prism')
    expect(draft().statues).toEqual({ left: 'sphere', mid: 'prism', right: 'prism' })
    expect(status().ready).toBe(true)
  })

  it('warns, without blocking, when only some statues start solved (rule 3)', () => {
    const { store, status } = setup()
    store.selectCallout('left', 'circle')
    store.selectCallout('mid', 'triangle') // → right: square
    store.selectStatue('left', 'cube') // sin círculo: empieza resuelta
    store.selectStatue('mid', 'tetrahedron') // con triángulo: sin resolver → right: sphere
    const { validation, ready } = status()
    expect(validation?.issues).toEqual([{ code: 'statue-starts-solved', severity: 'warning', slots: ['left', 'right'] }])
    expect(ready).toBe(true)
  })

  it('propose discards edits', () => {
    const { store, status } = setup()
    store.selectCallout('left', 'square')
    store.propose()
    expect(status().ready).toBe(true)
  })
})

describe('setup store: already solved', () => {
  it('blocks starting a starting point that is already solved', () => {
    const store = createSetupStore(() => 0)
    const status = setupStatus(store)
    store.selectCallout('left', 'circle')
    store.selectCallout('mid', 'triangle') // → right: square
    store.selectStatue('left', 'prism')
    store.selectStatue('mid', 'cylinder') // → right: cone (ninguna con su callout)
    expect(get(status).ready).toBe(false)
    expect(get(status).validation?.issues.map((i) => i.code)).toEqual(['already-solved'])
  })
})
