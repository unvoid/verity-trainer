/**
 * Store del punto de partida: propone un escenario aleatorio que el jugador
 * puede personalizar antes de iniciar el entreno.
 */
import { derived, readable, writable, type Readable } from 'svelte/store'
import {
  completeDraft,
  selectCallout,
  selectStatue,
  type CalloutsDraft,
  type StatuesDraft,
} from '../domain/editor'
import { DEFAULT_VALIDATION_OPTIONS, validateScenario, type ValidationResult } from '../domain/rules'
import { randomScenario, type Random } from '../domain/scenarios'
import type { Mode, Scenario, Shape3D, Slot, Symbol2D } from '../domain/types'
import { activeSettings, modeOf } from './settings'

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

/**
 * Estado del borrador. Se valida con el modo en que se va a jugar: un punto de
 * partida ya resuelto en ese modo no se puede iniciar.
 */
export function setupStatus(
  store: Readable<SetupDraft>,
  mode: Readable<Mode> = readable<Mode>('normal'),
): Readable<SetupStatus> {
  return derived([store, mode], ([draft, currentMode]) => {
    const scenario = draftScenario(draft)
    const validation = scenario
      ? validateScenario(scenario, { ...DEFAULT_VALIDATION_OPTIONS, mode: currentMode })
      : null
    return { scenario, validation, ready: validation?.valid ?? false }
  })
}

/** Punto de partida de la aplicación. */
export const setup = createSetupStore(Math.random)
export const setupState = setupStatus(
  setup,
  derived(activeSettings, (settings) => modeOf(settings)),
)
