import { describe, expect, it } from 'vitest'
import { countStatueSymbols, isSolved, isStatueSolved, validateScenario } from '../../src/lib/domain/rules'
import type { Callouts, Statues } from '../../src/lib/domain/types'

const callouts: Callouts = { left: 'circle', mid: 'triangle', right: 'square' }

describe('countStatueSymbols', () => {
  it('adds up the symbols of all statues', () => {
    expect(countStatueSymbols({ left: 'sphere', mid: 'prism', right: 'prism' })).toEqual({
      circle: 2,
      square: 2,
      triangle: 2,
    })
  })
})

describe('isStatueSolved / isSolved', () => {
  // Ninguna contiene el símbolo de su callout, todas mixtas.
  const normalOnly: Statues = { left: 'prism', mid: 'cylinder', right: 'cone' }
  // Ninguna contiene el símbolo de su callout, todas puras (solución A del documento).
  const challenge: Statues = { left: 'cube', mid: 'sphere', right: 'tetrahedron' }

  it('checks a single statue', () => {
    expect(isStatueSolved(callouts, normalOnly, 'left')).toBe(true)
    expect(isStatueSolved(callouts, { ...normalOnly, left: 'sphere' }, 'left')).toBe(false)
  })

  it('normal mode only needs every statue free of its callout', () => {
    expect(isSolved(callouts, normalOnly, 'normal')).toBe(true)
    expect(isSolved(callouts, challenge, 'normal')).toBe(true)
  })

  it('challenge mode also needs pure shapes', () => {
    expect(isSolved(callouts, normalOnly, 'challenge')).toBe(false)
    expect(isSolved(callouts, challenge, 'challenge')).toBe(true)
  })

  it('accepts both challenge solutions', () => {
    // Solución B: izquierda = pura del callout central, centro = del derecho, derecha = del izquierdo.
    expect(isSolved(callouts, { left: 'tetrahedron', mid: 'cube', right: 'sphere' }, 'challenge')).toBe(true)
  })

  it('fails when any statue still holds its callout', () => {
    expect(isSolved(callouts, { ...normalOnly, right: 'cube' }, 'normal')).toBe(false)
  })
})

describe('validateScenario', () => {
  const valid: Statues = { left: 'sphere', mid: 'tetrahedron', right: 'cube' }

  it('accepts a valid starting point with no issues', () => {
    expect(validateScenario({ callouts, statues: valid })).toEqual({ valid: true, issues: [] })
  })

  it('rule 1: rejects repeated callouts', () => {
    const result = validateScenario({ callouts: { left: 'circle', mid: 'circle', right: 'square' }, statues: valid })
    expect(result.valid).toBe(false)
    expect(result.issues).toContainEqual({ code: 'duplicate-callouts', severity: 'error', missing: ['triangle'] })
  })

  it('rule 2: rejects statues without two of each symbol', () => {
    const result = validateScenario({ callouts, statues: { left: 'sphere', mid: 'sphere', right: 'cube' } })
    expect(result.valid).toBe(false)
    expect(result.issues).toContainEqual({
      code: 'unbalanced-symbols',
      severity: 'error',
      counts: { circle: 4, square: 2, triangle: 0 },
    })
  })

  describe('rule 3: statues starting already solved', () => {
    const solvedStart: Statues = { left: 'prism', mid: 'cone', right: 'cylinder' } // izquierda sin círculo

    it('warns by default without invalidating', () => {
      const result = validateScenario({ callouts, statues: solvedStart })
      expect(result.valid).toBe(true)
      expect(result.issues).toEqual([{ code: 'statue-starts-solved', severity: 'warning', slots: ['left'] }])
    })

    it('rejects when enforced', () => {
      const result = validateScenario({ callouts, statues: solvedStart }, { unsolvedStart: 'enforce' })
      expect(result.valid).toBe(false)
      expect(result.issues[0]?.severity).toBe('error')
    })

    it('is ignored when off', () => {
      expect(validateScenario({ callouts, statues: solvedStart }, { unsolvedStart: 'off' }).issues).toEqual([])
    })
  })

  it('reports several issues at once', () => {
    const result = validateScenario({
      callouts: { left: 'square', mid: 'square', right: 'square' },
      statues: { left: 'cube', mid: 'cube', right: 'cube' },
    })
    expect(result.issues.map((issue) => issue.code)).toEqual(['duplicate-callouts', 'unbalanced-symbols'])
  })
})

describe('validateScenario with a play mode', () => {
  const callouts: Callouts = { left: 'circle', mid: 'triangle', right: 'square' }
  // Ninguna estatua contiene su callout: resuelto en modo normal (no en desafío: hay mixtas).
  const solvedNormal: Statues = { left: 'prism', mid: 'cylinder', right: 'cone' }
  // Además todas puras: resuelto también en desafío.
  const solvedChallenge: Statues = { left: 'cube', mid: 'sphere', right: 'tetrahedron' }

  it('rejects a starting point already solved in the given mode', () => {
    const result = validateScenario({ callouts, statues: solvedNormal }, { unsolvedStart: 'warn', mode: 'normal' })
    expect(result.valid).toBe(false)
    expect(result.issues).toEqual([{ code: 'already-solved', severity: 'error', mode: 'normal' }])
  })

  it('accepts it in challenge mode when shapes are not all pure', () => {
    const result = validateScenario({ callouts, statues: solvedNormal }, { unsolvedStart: 'warn', mode: 'challenge' })
    expect(result.valid).toBe(true)
    expect(result.issues.map((i) => i.code)).toEqual(['statue-starts-solved'])
  })

  it('rejects in challenge mode when already pure and free of callouts', () => {
    const result = validateScenario({ callouts, statues: solvedChallenge }, { unsolvedStart: 'warn', mode: 'challenge' })
    expect(result.issues).toEqual([{ code: 'already-solved', severity: 'error', mode: 'challenge' }])
  })

  it('does not check solved state without a mode', () => {
    expect(validateScenario({ callouts, statues: solvedNormal }).valid).toBe(true)
  })
})
