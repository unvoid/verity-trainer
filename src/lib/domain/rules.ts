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

/** Símbolo que suelta cada caballero al morir, según su posición. */
export const KNIGHT_DROPS: Readonly<Record<Slot, Symbol2D>> = {
  left: 'circle',
  mid: 'triangle',
  right: 'square',
}

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
 * El compañero de la sala interior en esta posición ya puede salir: su estatua
 * cumple la condición de victoria del modo (sin el símbolo de su callout y, en
 * Challenge Mode, además pura).
 */
export function canExit(callouts: Callouts, statues: Statues, slot: Slot, mode: Mode): boolean {
  return isStatueSolved(callouts, statues, slot) && (mode === 'normal' || isPure(statues[slot]))
}

/**
 * Condición de victoria.
 * - Normal: ninguna estatua contiene el símbolo de su callout.
 * - Challenge: además, las tres estatuas son formas puras.
 */
export function isSolved(callouts: Callouts, statues: Statues, mode: Mode): boolean {
  return SLOTS.every((slot) => canExit(callouts, statues, slot, mode))
}

// --- Validación del punto de partida ---------------------------------------

/**
 * Cómo tratar la regla 3 (cada estatua empieza conteniendo el símbolo de su callout).
 * Pendiente de confirmar si es una regla del juego: por defecto solo avisa.
 */
export type UnsolvedStartRule = 'off' | 'warn' | 'enforce'

export interface ValidationOptions {
  readonly unsolvedStart: UnsolvedStartRule
  /**
   * Modo en el que se va a jugar. Si se indica, un punto de partida que ya
   * cumple la condición de victoria en ese modo es un error: no hay nada que entrenar.
   */
  readonly mode?: Mode
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
  /** El punto de partida ya está resuelto en el modo indicado. */
  | { readonly code: 'already-solved'; readonly severity: 'error'; readonly mode: Mode }

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

  const balanced = issues.length === 0
  const alreadySolved = balanced && options.mode !== undefined && isSolved(callouts, statues, options.mode)
  if (alreadySolved && options.mode) {
    issues.push({ code: 'already-solved', severity: 'error', mode: options.mode })
  }

  // El aviso de la regla 3 sobra si el punto de partida ya está resuelto del todo.
  if (options.unsolvedStart !== 'off' && !alreadySolved) {
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
