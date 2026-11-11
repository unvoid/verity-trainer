/**
 * Depósitos e intercambios.
 *
 * 1. Un depósito solo se acepta si la forma de la estatua contiene el símbolo.
 * 2. El primer depósito marca la estatua.
 * 3. No se puede depositar en la estatua marcada.
 * 4. El segundo depósito, en otra estatua, intercambia: la marcada cede su
 *    símbolo y recibe el nuevo; la otra cede el nuevo y recibe el marcado.
 * 5. Cada intercambio suma 1 al contador.
 */
import { contains, replaceSymbol } from './shapes'
import type { Deposit, GameState, Scenario, Statues } from './types'

export function createGameState(scenario: Scenario, startedAt: number): GameState {
  return {
    callouts: scenario.callouts,
    statues: scenario.statues,
    selection: null,
    swaps: 0,
    startedAt,
  }
}

/**
 * Intercambia los símbolos de dos depósitos en estatuas distintas.
 * Lanza un error si las estatuas coinciden o no contienen su símbolo.
 */
export function swapSymbols(statues: Statues, first: Deposit, second: Deposit): Statues {
  if (first.slot === second.slot) throw new Error(`Cannot swap a statue with itself (${first.slot})`)
  return {
    ...statues,
    [first.slot]: replaceSymbol(statues[first.slot], first.symbol, second.symbol),
    [second.slot]: replaceSymbol(statues[second.slot], second.symbol, first.symbol),
  }
}

export type DepositError =
  /** La forma de la estatua no contiene el símbolo. */
  | 'symbol-not-in-shape'
  /** La estatua ya está marcada por el primer depósito. */
  | 'statue-already-selected'

/** Motivo por el que un depósito no se acepta, o `null` si se acepta. */
export function depositError(state: GameState, deposit: Deposit): DepositError | null {
  if (state.selection?.slot === deposit.slot) return 'statue-already-selected'
  if (!contains(state.statues[deposit.slot], deposit.symbol)) return 'symbol-not-in-shape'
  return null
}

export type DepositResult =
  | { readonly ok: true; readonly state: GameState; readonly swapped: boolean }
  | { readonly ok: false; readonly error: DepositError }

export function deposit(state: GameState, next: Deposit): DepositResult {
  const error = depositError(state, next)
  if (error) return { ok: false, error }

  if (!state.selection) {
    return { ok: true, swapped: false, state: { ...state, selection: next } }
  }

  return {
    ok: true,
    swapped: true,
    state: {
      ...state,
      statues: swapSymbols(state.statues, state.selection, next),
      selection: null,
      swaps: state.swaps + 1,
    },
  }
}
