/**
 * Reglas del encuentro: validación del punto de partida y condición de victoria.
 * Reglas 1-3 del punto de partida: callouts distintos, dos de cada símbolo
 * entre las estatuas, y cada estatua empieza con el símbolo de su callout.
 */
import { contains, countSymbol, isPure } from './shapes'
import {
  SLOTS,
  SYMBOLS,
  type Callouts,
  type Mode,
  type Scenario,
  type Slot,
  type Statues,
  type Symbol2D,
} from './types'

/** Cuántas veces aparece cada símbolo sumando las tres estatuas. */
export function countStatueSymbols(statues: Statues): Record<Symbol2D, number> {
  const counts = { circle: 0, square: 0, triangle: 0 }
  for (const slot of SLOTS) {
    for (const symbol of SYMBOLS) counts[symbol] += countSymbol(statues[slot], symbol)
  }
  return counts
}

/** Una estatua está resuelta si no contiene el símbolo de su callout. */
export function isStatueSolved(callouts: Callouts, statues: Statues, slot: Slot): boolean {
  return !contains(statues[slot], callouts[slot])
}

/**
 * Condición de victoria.
 * - Normal: ninguna estatua contiene el símbolo de su callout.
 * - Challenge: además, las tres estatuas son formas puras.
 */
export function isSolved(callouts: Callouts, statues: Statues, mode: Mode): boolean {
  return SLOTS.every(
    (slot) => isStatueSolved(callouts, statues, slot) && (mode === 'normal' || isPure(statues[slot])),
  )
}

// --- Validación del punto de partida ---------------------------------------

/**
 * Cómo tratar la regla 3 (cada estatua empieza conteniendo el símbolo de su callout).
 * Pendiente de confirmar si es una regla del juego: por defecto solo avisa.
 */
export type UnsolvedStartRule = 'off' | 'warn' | 'enforce'

export interface ValidationOptions {
  readonly unsolvedStart: UnsolvedStartRule
}

export const DEFAULT_VALIDATION_OPTIONS: ValidationOptions = { unsolvedStart: 'warn' }

export type Severity = 'error' | 'warning'

export type ScenarioIssue =
  /** Regla 1: los callouts deben ser los tres símbolos distintos. */
  | { readonly code: 'duplicate-callouts'; readonly severity: 'error'; readonly missing: readonly Symbol2D[] }
  /** Regla 2: entre las estatuas debe haber exactamente dos de cada símbolo. */
  | {
      readonly code: 'unbalanced-symbols'
      readonly severity: 'error'
      readonly counts: Readonly<Record<Symbol2D, number>>
    }
  /** Regla 3: estatuas que empiezan sin el símbolo de su callout (ya resueltas). */
  | { readonly code: 'statue-starts-solved'; readonly severity: Severity; readonly slots: readonly Slot[] }

export interface ValidationResult {
  /** Sin errores. Los avisos no invalidan. */
  readonly valid: boolean
  readonly issues: readonly ScenarioIssue[]
}

export function validateScenario(
  scenario: Scenario,
  options: ValidationOptions = DEFAULT_VALIDATION_OPTIONS,
): ValidationResult {
  const { callouts, statues } = scenario
  const issues: ScenarioIssue[] = []

  const used = new Set(SLOTS.map((slot) => callouts[slot]))
  if (used.size !== SYMBOLS.length) {
    issues.push({
      code: 'duplicate-callouts',
      severity: 'error',
      missing: SYMBOLS.filter((symbol) => !used.has(symbol)),
    })
  }

  const counts = countStatueSymbols(statues)
  if (SYMBOLS.some((symbol) => counts[symbol] !== 2)) {
    issues.push({ code: 'unbalanced-symbols', severity: 'error', counts })
  }

  if (options.unsolvedStart !== 'off') {
    const solvedSlots = SLOTS.filter((slot) => isStatueSolved(callouts, statues, slot))
    if (solvedSlots.length > 0) {
      issues.push({
        code: 'statue-starts-solved',
        severity: options.unsolvedStart === 'enforce' ? 'error' : 'warning',
        slots: solvedSlots,
      })
    }
  }

  return { valid: issues.every((issue) => issue.severity !== 'error'), issues }
}
