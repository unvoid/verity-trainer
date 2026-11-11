/**
 * Store de la partida: une el dominio con la interacción de la UI.
 *
 * Dos formas de depositar, equivalentes:
 * - Tocar y tocar: se coge un símbolo (`toggleHold`) y se toca una estatua (`depositAt`).
 * - Arrastrar y soltar: se suelta un símbolo sobre una estatua (`dropAt`).
 *
 * Con símbolos por rondas (`rounds`), los símbolos salen de los caballeros, se
 * gastan al usarlos y caducan; el tiempo avanza con `tick()` (ver `domain/drops.ts`).
 *
 * La lógica del juego vive en el dominio; aquí solo se guarda el estado y se
 * traduce cada acción en una llamada pura.
 */
import { writable, type Readable } from 'svelte/store'
import * as drops from '../domain/drops'
import type { DropsState, OgreSide } from '../domain/drops'
import { isSolved, KNIGHT_DROPS } from '../domain/rules'
import { randomScenario, type Random } from '../domain/scenarios'
import { createGameState, deposit, type DepositError } from '../domain/swap'
import type { Deposit, GameState, Mode, Scenario, Slot, Swap, Symbol2D } from '../domain/types'

/** Resultado de la última acción, para mostrarlo y anunciarlo a lectores de pantalla. */
export type Feedback =
  | { readonly kind: 'no-symbol-held'; readonly slot: Slot }
  | { readonly kind: 'rejected'; readonly error: DepositError; readonly deposit: Deposit }
  | { readonly kind: 'marked'; readonly deposit: Deposit }
  | { readonly kind: 'swapped'; readonly swap: Swap }
  | { readonly kind: 'symbol-unavailable'; readonly symbol: Symbol2D }
  | { readonly kind: 'knight-defeated'; readonly symbol: Symbol2D }
  | { readonly kind: 'expired'; readonly symbols: readonly Symbol2D[] }
  | { readonly kind: 'ogres-appeared' }
  | { readonly kind: 'knights-returned' }

export interface GameConfig {
  readonly mode: Mode
  /** Símbolos por rondas. */
  readonly rounds: boolean
}

export interface GameSession extends GameConfig {
  /** Punto de partida, para poder reiniciar. */
  readonly scenario: Scenario
  readonly state: GameState
  /** Símbolo que lleva el jugador, o `null`. */
  readonly held: Symbol2D | null
  /** Estado de las rondas de símbolos, o `null` sin rondas. */
  readonly drops: DropsState | null
  readonly feedback: Feedback | null
  /** Momento en que se resolvió, o `null` si sigue en curso. */
  readonly finishedAt: number | null
}

export interface GameStore extends Readable<GameSession> {
  /** Nueva partida: con el escenario dado o, si no hay, uno aleatorio. Mantiene la configuración no indicada. */
  newGame(scenario?: Scenario, config?: Partial<GameConfig>): void
  /** Vuelve al punto de partida de la partida actual. */
  restart(): void
  /** Coge un símbolo, o lo suelta si ya lo llevaba. */
  toggleHold(symbol: Symbol2D): void
  /** Deposita el símbolo que se lleva en una estatua. */
  depositAt(slot: Slot): void
  /** Deposita un símbolo concreto en una estatua (arrastrar y soltar). */
  dropAt(slot: Slot, symbol: Symbol2D): void
  /** Rondas: derrota al caballero de una posición. */
  defeatKnight(slot: Slot): void
  /** Rondas: derrota a un ogro. */
  defeatOgre(side: OgreSide): void
  /** Rondas: avanza el tiempo (caducidades, ogros, vuelta de caballeros). */
  tick(): void
}

export interface GameStoreDependencies {
  readonly now: () => number
  readonly random: Random
  readonly timings?: drops.DropTimings
}

const DEFAULT_CONFIG: GameConfig = { mode: 'normal', rounds: false }

export function createGameStore(
  { now, random, timings = drops.DEFAULT_TIMINGS }: GameStoreDependencies,
  initialConfig: Partial<GameConfig> = {},
): GameStore {
  function start(scenario: Scenario, config: GameConfig): GameSession {
    const state = createGameState(scenario, now())
    const solved = isSolved(state.callouts, state.statues, config.mode)
    return {
      ...config,
      scenario,
      state,
      held: null,
      drops: config.rounds ? drops.createDrops() : null,
      feedback: null,
      finishedAt: solved ? state.startedAt : null,
    }
  }

  const { subscribe, update } = writable(start(randomScenario(random), { ...DEFAULT_CONFIG, ...initialConfig }))

  /** Aplica `change` solo si la partida sigue en curso. */
  function whilePlaying(change: (session: GameSession) => GameSession) {
    update((session) => (session.finishedAt !== null ? session : change(session)))
  }

  /** Aplica un depósito. Si se acepta, el símbolo se gasta y el jugador se queda sin él. */
  function applyDeposit(session: GameSession, attempt: Deposit): GameSession {
    if (session.drops && !drops.isAvailable(session.drops, attempt.symbol)) {
      return { ...session, feedback: { kind: 'symbol-unavailable', symbol: attempt.symbol } }
    }

    const result = deposit(session.state, attempt)
    if (!result.ok) return { ...session, feedback: { kind: 'rejected', error: result.error, deposit: attempt } }

    const { state } = result
    const previous = session.state.selection
    const feedback: Feedback =
      result.swapped && previous
        ? { kind: 'swapped', swap: { first: previous, second: attempt } }
        : { kind: 'marked', deposit: attempt }
    const solved = result.swapped && isSolved(state.callouts, state.statues, session.mode)

    return {
      ...session,
      state,
      held: null,
      drops: session.drops && drops.use(session.drops, attempt.symbol),
      feedback,
      finishedAt: solved ? now() : null,
    }
  }

  return {
    subscribe,

    newGame(scenario, config) {
      update((session) =>
        start(scenario ?? randomScenario(random), {
          mode: config?.mode ?? session.mode,
          rounds: config?.rounds ?? session.rounds,
        }),
      )
    },

    restart() {
      update((session) => start(session.scenario, session))
    },

    toggleHold(symbol) {
      whilePlaying((session) => {
        const releasing = session.held === symbol
        if (!releasing && session.drops && !drops.isAvailable(session.drops, symbol)) {
          return { ...session, feedback: { kind: 'symbol-unavailable', symbol } }
        }

        let state = session.drops
        if (state && session.held) state = drops.putDown(state, session.held, now())
        if (state && !releasing) state = drops.pickUp(state, symbol)

        return { ...session, held: releasing ? null : symbol, drops: state, feedback: null }
      })
    },

    depositAt(slot) {
      whilePlaying((session) =>
        session.held
          ? applyDeposit(session, { slot, symbol: session.held })
          : { ...session, feedback: { kind: 'no-symbol-held', slot } },
      )
    },

    dropAt(slot, symbol) {
      whilePlaying((session) => applyDeposit(session, { slot, symbol }))
    },

    defeatKnight(slot) {
      whilePlaying((session) => {
        if (!session.drops || session.drops.slots[slot].status !== 'knight') return session
        const state = drops.defeatKnight(session.drops, slot, now())
        return { ...session, drops: state, feedback: { kind: 'knight-defeated', symbol: KNIGHT_DROPS[slot] } }
      })
    },

    defeatOgre(side) {
      whilePlaying((session) => {
        if (!session.drops?.ogres?.[side]) return session
        return { ...session, drops: drops.defeatOgre(session.drops, side, now(), timings), feedback: null }
      })
    },

    tick() {
      whilePlaying((session) => {
        if (!session.drops) return session
        const result = drops.tick(session.drops, now(), timings)
        if (result.state === session.drops) return session

        const feedback: Feedback | null = result.knightsReturned
          ? { kind: 'knights-returned' }
          : result.ogresAppeared
            ? { kind: 'ogres-appeared' }
            : result.expired.length > 0
              ? { kind: 'expired', symbols: result.expired }
              : session.feedback
        return { ...session, drops: result.state, feedback }
      })
    },
  }
}

/** Partida de la aplicación. */
export const game = createGameStore({ now: Date.now, random: Math.random })
