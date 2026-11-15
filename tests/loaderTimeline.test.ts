import { describe, expect, it } from 'vitest'
import {
  INTRO_STAGGER,
  INTRO_STAGGER_WITHOUT_DUST,
  introStagger,
  BREAK_AT,
  BREAK_LEAD,
  DEFAULT_SPLASH_TIMINGS,
  FINAL_FORMED,
  FINAL_START,
  FIRST_BREAK,
  MIDDLE_START,
  onceDuration,
  splashSchedule,
} from '../src/lib/visual/loaderTimeline'

describe('loader timeline (once)', () => {
  it('chains the three shapes: each starts a little after the previous breaks', () => {
    expect(MIDDLE_START - FIRST_BREAK).toBeCloseTo(BREAK_LEAD)
    expect(FINAL_START - (MIDDLE_START + BREAK_AT)).toBeCloseTo(BREAK_LEAD)
    expect(FINAL_FORMED - FINAL_START).toBeCloseTo(0.11)
  })

  it('computes when the last shape is whole', () => {
    expect(onceDuration(3600)).toBe(Math.round(3600 * FINAL_FORMED))
  })
})

describe('splash schedule', () => {
  const t = DEFAULT_SPLASH_TIMINGS
  const s = splashSchedule(3600, t)

  it('starts the animation after the fade-in and pause', () => {
    expect(s.start).toBe(t.fadeIn + t.pauseBeforeStart)
  })

  it('fades out after the last shape has been whole for holdLast', () => {
    expect(s.fadeOut).toBe(s.start + onceDuration(3600) + t.holdLast)
  })

  it('reveals the app once the title and shape have faded out, then finishes', () => {
    expect(t.overlap).toBe(0)
    expect(s.reveal).toBe(s.fadeOut + t.fadeOut)
    expect(s.end).toBe(s.reveal + t.overlayFade)
  })

  it('fades out as long as it fades in', () => {
    expect(t.fadeOut).toBe(t.fadeIn)
  })

  it('without animation (cycle 0) only waits for fades and pauses', () => {
    const r = splashSchedule(0, t)
    expect(r.fadeOut).toBe(r.start + t.holdLast)
  })
})

describe('intro stagger', () => {
  it('shows the scene, then the snow, then the content, each starting while the previous one appears', () => {
    const times = introStagger(true, false)
    expect(times).toBe(INTRO_STAGGER)
    expect(times.dust).toBeGreaterThan(0)
    expect(times.content).toBeGreaterThan(times.dust)
  })

  it('does not wait for the snow when it is off', () => {
    const times = introStagger(false, false)
    expect(times).toBe(INTRO_STAGGER_WITHOUT_DUST)
    expect(times.content).toBeLessThan(INTRO_STAGGER.content)
  })

  it('shows everything at once with reduced motion', () => {
    expect(introStagger(true, true)).toEqual({ dust: 0, content: 0 })
    expect(introStagger(false, true)).toEqual({ dust: 0, content: 0 })
  })
})
