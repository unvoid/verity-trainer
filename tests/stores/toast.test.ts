import { get } from 'svelte/store'
import { describe, expect, it } from 'vitest'
import { createToastStore, TOAST_DURATION } from '../../src/lib/stores/toast'

function fakeTimers() {
  const pending = new Map<number, () => void>()
  let next = 1
  return {
    schedule: (fn: () => void) => {
      const id = next++
      pending.set(id, fn)
      return id
    },
    cancel: (id: unknown) => pending.delete(id as number),
    runAll: () => [...pending.entries()].forEach(([id, fn]) => (pending.delete(id), fn())),
    count: () => pending.size,
  }
}

describe('toast store', () => {
  it('shows a message and hides it after its duration', () => {
    const timers = fakeTimers()
    const toast = createToastStore(timers.schedule, timers.cancel)
    toast.show('Hola')
    expect(get(toast)?.message).toBe('Hola')
    timers.runAll()
    expect(get(toast)).toBeNull()
  })

  it('replaces the previous message (one at a time) and restarts its timer', () => {
    const timers = fakeTimers()
    const toast = createToastStore(timers.schedule, timers.cancel)
    toast.show('Primero')
    const first = get(toast)!.id
    toast.show('Segundo', 'error')
    expect(get(toast)).toMatchObject({ message: 'Segundo', tone: 'error' })
    expect(get(toast)!.id).not.toBe(first)
    expect(timers.count()).toBe(1)
  })

  it('keeps errors on screen longer than info', () => {
    expect(TOAST_DURATION.error).toBeGreaterThan(TOAST_DURATION.info)
  })

  it('can be dismissed', () => {
    const timers = fakeTimers()
    const toast = createToastStore(timers.schedule, timers.cancel)
    toast.show('Adiós')
    toast.dismiss()
    expect(get(toast)).toBeNull()
    expect(timers.count()).toBe(0)
  })
})
