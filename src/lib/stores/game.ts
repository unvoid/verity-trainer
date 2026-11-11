/**
 * Store de la partida: une el dominio con la interacción de la UI.
 *
 * Interacción "tocar y tocar": se coge un símbolo (`toggleHold`) y se deposita
 * en una estatua (`depositAt`). La lógica del juego vive en el dominio; aquí
 * solo se guarda el estado y se traduce cada acción en una llamada pura.
 */
import { writable, type Readable } from 'svelte/store'
import { isSolved } from '../domain/rules'
import { randomScenario, type Random } from '../domain/scenarios'
import { createGameState, deposit, type DepositError } from '../domain/swap'
import type { Deposit, GameState, Mode, Scenario, Slot, Swap, Symbol2D } from '../domain/types'

/** Resultado de la última acción, para mostrarlo y anunciarlo a lectores de pantalla. */
export type Feedback =
  | { readonly kind: 'no-symbol-held'; readonly slot: Slot }
  | { readonly kind: 'rejected'; readonly error: DepositError; readonly deposit: Deposit }
  | { readonly kind: 'marked'; readonly deposit: Deposit }
  | { readonly kind: 'swapped'; readonly swap: Swap }

export interface GameSession {
  /** Punto de partida, para poder reiniciar. */
  readonly scenario: Scenario
  readonly mode: Mode
  readonly state: GameState
  /** Símbolo que lleva el jugador, o `null`. */
  readonly held: Symbol2D | null
  readonly feedback: Feedback | null
  /** Momento en que se resolvió, o `null` si sigue en curso. */
  readonly finishedAt: number | null
}

export interface GameStore extends Readable<GameSession> {
  /** Nueva partida: con el escenario dado o, si no hay, uno aleatorio. */
  newGame(scenario?: Scenario, mode?: Mode): void
  /** Vuelve al punto de partida de la partida actual. */
  restart(): void
  /** Coge un símbolo, o lo suelta si ya lo llevaba. */
  toggleHold(symbol: Symbol2D): void
  /** Deposita el símbolo que se lleva en una estatua. */
  depositAt(slot: Slot): void
}

export interface GameStoreDependencies {
  readonly now: () => number
  readonly random: Random
}

export function createGameStore(
  { now, random }: GameStoreDependencies,
  initialMode: Mode = 'normal',
): GameStore {
  function start(scenario: Scenario, mode: Mode): GameSession {
    const state = createGameState(scenario, now())
    const solved = isSolved(state.callouts, state.statues, mode)
    return { scenario, mode, state, held: null, feedback: null, finishedAt: solved ? state.startedAt : null }
  }

  const { subscribe, update } = writable(start(randomScenario(random), initialMode))

  return {
    subscribe,

    newGame(scenario, mode) {
      update((session) => start(scenario ?? randomScenario(random), mode ?? session.mode))
    },

    restart() {
      update((session) => start(session.scenario, session.mode))
    },

    toggleHold(symbol) {
      update((session) => {
        if (session.finishedAt !== null) return session
        return { ...session, held: session.held === symbol ? null : symbol, feedback: null }
      })
    },

    depositAt(slot) {
      update((session) => {
        if (session.finishedAt !== null) return session
        if (!session.held) return { ...session, feedback: { kind: 'no-symbol-held', slot } }

        const attempt: Deposit = { slot, symbol: session.held }
        const result = deposit(session.state, attempt)
        if (!result.ok) return { ...session, feedback: { kind: 'rejected', error: result.error, deposit: attempt } }

        const { state } = result
        const previous = session.state.selection
        const feedback: Feedback =
          result.swapped && previous
            ? { kind: 'swapped', swap: { first: previous, second: attempt } }
            : { kind: 'marked', deposit: attempt }
        const solved = result.swapped && isSolved(state.callouts, state.statues, session.mode)

        return { ...session, state, held: null, feedback, finishedAt: solved ? now() : null }
      })
    },
  }
}

/** Partida de la aplicación. */
export const game = createGameStore({ now: Date.now, random: Math.random })
