/**
 * Edición del punto de partida.
 *
 * Callouts y estatuas se editan por grupos de tres. En ambos, al elegir dos
 * posiciones la tercera queda determinada por las reglas:
 * - Callouts: son los tres símbolos distintos → la tercera es el símbolo que falta.
 * - Estatuas: entre las tres hay dos de cada símbolo → los dos símbolos que
 *   faltan forman la tercera forma.
 * Por eso solo se ofrecen opciones que admiten una tercera válida, y las
 * reglas 1 y 2 no se pueden incumplir.
 */
import { compose, countSymbol } from './shapes'
import { SHAPES, SLOTS, SYMBOLS, type Shape3D, type Slot, type Symbol2D } from './types'

/** Grupo de tres posiciones en edición; `null` = sin elegir. */
export type Draft<T> = Readonly<Record<Slot, T | null>>

export type CalloutsDraft = Draft<Symbol2D>
export type StatuesDraft = Draft<Shape3D>

export const EMPTY_DRAFT: Draft<never> = { left: null, mid: null, right: null }

/** Posiciones elegidas de un grupo. */
function filledSlots<T>(draft: Draft<T>): Slot[] {
  return SLOTS.filter((slot) => draft[slot] !== null)
}

/** El grupo completo, o `null` si falta alguna posición. */
export function completeDraft<T>(draft: Draft<T>): Readonly<Record<Slot, T>> | null {
  const { left, mid, right } = draft
  return left !== null && mid !== null && right !== null ? { left, mid, right } : null
}

/**
 * Elige un valor en una posición del grupo:
 * - Si el grupo estaba completo, se empieza de nuevo: las otras dos se vacían.
 * - Si no, se fija la posición y, si ya hay dos, se completa la tercera.
 */
export function selectInDraft<T>(
  draft: Draft<T>,
  slot: Slot,
  value: T,
  completeThird: (draft: Draft<T>) => Draft<T>,
): Draft<T> {
  if (completeDraft(draft)) return { ...EMPTY_DRAFT, [slot]: value }
  return completeThird({ ...draft, [slot]: value })
}

// --- Callouts ---------------------------------------------------------------

/** Símbolos que se pueden elegir en una posición sin repetir los de las otras. */
export function calloutOptions(draft: CalloutsDraft, slot: Slot): Symbol2D[] {
  if (completeDraft(draft)) return [...SYMBOLS]
  const used = new Set(SLOTS.filter((other) => other !== slot).map((other) => draft[other]))
  return SYMBOLS.filter((symbol) => !used.has(symbol))
}

/** Con dos callouts distintos elegidos, completa el tercero con el símbolo que falta. */
export function completeCallouts(draft: CalloutsDraft): CalloutsDraft {
  const filled = filledSlots(draft)
  if (filled.length !== 2) return draft
  const empty = SLOTS.find((slot) => draft[slot] === null)!
  const missing = SYMBOLS.filter((symbol) => !filled.some((slot) => draft[slot] === symbol))
  return missing.length === 1 ? { ...draft, [empty]: missing[0]! } : draft
}

export function selectCallout(draft: CalloutsDraft, slot: Slot, symbol: Symbol2D): CalloutsDraft {
  return selectInDraft(draft, slot, symbol, completeCallouts)
}

// --- Estatuas ---------------------------------------------------------------

/** Símbolos que aún faltan para llegar a dos de cada uno, sin contar `exclude`. */
function remainingSymbols(draft: StatuesDraft, exclude?: Slot): Record<Symbol2D, number> {
  const remaining = { circle: 2, square: 2, triangle: 2 }
  for (const slot of SLOTS) {
    const shape = draft[slot]
    if (slot === exclude || shape === null) continue
    for (const symbol of SYMBOLS) remaining[symbol] -= countSymbol(shape, symbol)
  }
  return remaining
}

/**
 * Formas que se pueden elegir en una posición de modo que el grupo siga
 * teniendo solución (como mucho dos de cada símbolo entre las elegidas).
 */
export function statueOptions(draft: StatuesDraft, slot: Slot): Shape3D[] {
  if (completeDraft(draft)) return [...SHAPES]
  const remaining = remainingSymbols(draft, slot)
  return SHAPES.filter((shape) => SYMBOLS.every((symbol) => countSymbol(shape, symbol) <= remaining[symbol]))
}

/** Con dos estatuas elegidas, completa la tercera con los dos símbolos que faltan. */
export function completeStatues(draft: StatuesDraft): StatuesDraft {
  if (filledSlots(draft).length !== 2) return draft
  const empty = SLOTS.find((slot) => draft[slot] === null)!
  const remaining = remainingSymbols(draft)
  if (SYMBOLS.some((symbol) => remaining[symbol] < 0)) return draft
  const missing = SYMBOLS.flatMap((symbol) => Array<Symbol2D>(remaining[symbol]).fill(symbol))
  const [a, b] = missing
  return missing.length === 2 && a && b ? { ...draft, [empty]: compose(a, b) } : draft
}

export function selectStatue(draft: StatuesDraft, slot: Slot, shape: Shape3D): StatuesDraft {
  return selectInDraft(draft, slot, shape, completeStatues)
}
