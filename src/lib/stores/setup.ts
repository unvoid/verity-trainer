/**
 * Store del punto de partida: propone un escenario aleatorio que el jugador
 * puede personalizar antes de iniciar el entreno.
 */
import { derived, writable, type Readable } from 'svelte/store'
import {
  completeDraft,
  selectCallout,
  selectStatue,
  type CalloutsDraft,
  type StatuesDraft,
} from '../domain/editor'
import { validateScenario, type ValidationResult } from '../domain/rules'
import { randomScenario, type Random } from '../domain/scenarios'
import type { Scenario, Shape3D, Slot, Symbol2D } from '../domain/types'

export interface SetupDraft {
  readonly callouts: CalloutsDraft
  readonly statues: StatuesDraft
}

export interface SetupStore extends Readable<SetupDraft> {
  /** Nueva propuesta aleatoria (descarta los cambios). */
  propose(): void
  selectCallout(slot: Slot, symbol: Symbol2D): void
  selectStatue(slot: Slot, shape: Shape3D): void
}

export function createSetupStore(random: Random): SetupStore {
  const { subscribe, set, update } = writable<SetupDraft>(randomScenario(random))

  return {
    subscribe,
    propose: () => set(randomScenario(random)),
    selectCallout: (slot, symbol) =>
      update((draft) => ({ ...draft, callouts: selectCallout(draft.callouts, slot, symbol) })),
    selectStatue: (slot, shape) => update((draft) => ({ ...draft, statues: selectStatue(draft.statues, slot, shape) })),
  }
}

/** Escenario completo del borrador, o `null` si falta alguna posición. */
export function draftScenario(draft: SetupDraft): Scenario | null {
  const callouts = completeDraft(draft.callouts)
  const statues = completeDraft(draft.statues)
  return callouts && statues ? { callouts, statues } : null
}

export interface SetupStatus {
  readonly scenario: Scenario | null
  readonly validation: ValidationResult | null
  /** Se puede iniciar el entreno: completo y sin errores (los avisos no bloquean). */
  readonly ready: boolean
}

export function setupStatus(store: Readable<SetupDraft>): Readable<SetupStatus> {
  return derived(store, (draft) => {
    const scenario = draftScenario(draft)
    const validation = scenario ? validateScenario(scenario) : null
    return { scenario, validation, ready: validation?.valid ?? false }
  })
}

/** Punto de partida de la aplicación. */
export const setup = createSetupStore(Math.random)
export const setupState = setupStatus(setup)
