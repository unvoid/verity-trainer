import { describe, expect, it } from 'vitest'
import { parseFlag } from '../src/lib/features'
import { applyFeatures, DEFAULT_SETTINGS, modeOf, parseSettings } from '../src/lib/stores/settings'

describe('parseFlag', () => {
  it('reads common true/false spellings', () => {
    for (const value of ['true', 'TRUE', '1', 'on', ' true ']) expect(parseFlag(value, false)).toBe(true)
    for (const value of ['false', 'False', '0', 'off']) expect(parseFlag(value, true)).toBe(false)
  })

  it('falls back on missing or unknown values', () => {
    expect(parseFlag(undefined, true)).toBe(true)
    expect(parseFlag('', false)).toBe(false)
    expect(parseFlag('maybe', true)).toBe(true)
  })
})

describe('parseSettings', () => {
  it('returns defaults when nothing is stored', () => {
    expect(parseSettings(null)).toEqual(DEFAULT_SETTINGS)
  })

  it('reads stored settings', () => {
    const stored = { hints: true, challengeMode: true, symbolRounds: false }
    expect(parseSettings(JSON.stringify(stored))).toEqual(stored)
  })

  it('tolerates corrupt data, wrong types and missing keys', () => {
    expect(parseSettings('{not json')).toEqual(DEFAULT_SETTINGS)
    expect(parseSettings('42')).toEqual(DEFAULT_SETTINGS)
    expect(parseSettings('{"hints":"yes","challengeMode":true}')).toEqual({
      ...DEFAULT_SETTINGS,
      challengeMode: true,
    })
  })

  it('ignores unknown keys from other versions', () => {
    expect(parseSettings('{"hints":true,"imageCallouts":true}')).toEqual({ ...DEFAULT_SETTINGS, hints: true })
  })
})

describe('applyFeatures', () => {
  const all = { hints: true, challengeMode: true, symbolRounds: true }

  it('keeps settings whose feature is available', () => {
    expect(applyFeatures(all, all)).toEqual(all)
  })

  it('turns off settings whose feature is disabled in this build', () => {
    expect(applyFeatures(all, { hints: true, challengeMode: false, symbolRounds: false })).toEqual({
      hints: true,
      challengeMode: false,
      symbolRounds: false,
    })
  })

  it('never turns on a setting the player left off', () => {
    expect(applyFeatures(DEFAULT_SETTINGS, all)).toEqual(DEFAULT_SETTINGS)
  })
})

describe('modeOf', () => {
  it('maps challenge mode to the domain mode', () => {
    expect(modeOf({ ...DEFAULT_SETTINGS, challengeMode: true })).toBe('challenge')
    expect(modeOf(DEFAULT_SETTINGS)).toBe('normal')
  })
})
