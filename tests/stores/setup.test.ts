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

  it('warns, without blocking, when a statue starts already solved (rule 3)', () => {
    const { store, status } = setup()
    const { callouts } = status().scenario!
    // Una estatua sin el símbolo de su callout: estatuas puras de los otros símbolos.
    store.selectStatue('left', callouts.left === 'circle' ? 'cube' : 'sphere')
    store.selectStatue('mid', callouts.left === 'triangle' ? 'cube' : 'tetrahedron')
    const { validation, ready } = status()
    expect(validation?.issues.some((issue) => issue.code === 'statue-starts-solved' && issue.slots.includes('left'))).toBe(true)
    expect(ready).toBe(true)
  })

  it('propose discards edits', () => {
    const { store, status } = setup()
    store.selectCallout('left', 'square')
    store.propose()
    expect(status().ready).toBe(true)
  })
})
