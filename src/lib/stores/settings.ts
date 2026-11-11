/**
 * Ajustes del jugador, guardados en localStorage.
 *
 * `settings` guarda lo que eligió el jugador; `activeSettings` es lo que se
 * aplica: un ajuste solo cuenta si su funcionalidad está disponible en esta
 * versión (ver `features.ts`).
 */
import { derived, writable } from 'svelte/store'
import type { Mode } from '../domain/types'
import { FEATURES, type Features } from '../features'

export interface Settings {
  readonly hints: boolean
  readonly challengeMode: boolean
  readonly symbolRounds: boolean
}

export type SettingKey = keyof Settings

export const DEFAULT_SETTINGS: Settings = { hints: false, challengeMode: false, symbolRounds: false }

const STORAGE_KEY = 'verity-trainer:settings'

/** Lee ajustes guardados; tolera datos ausentes, corruptos o de versiones anteriores. */
export function parseSettings(raw: string | null): Settings {
  if (!raw) return DEFAULT_SETTINGS
  try {
    const data: unknown = JSON.parse(raw)
    if (typeof data !== 'object' || data === null) return DEFAULT_SETTINGS
    const record = data as Record<string, unknown>
    const pick = (key: SettingKey) => (typeof record[key] === 'boolean' ? record[key] : DEFAULT_SETTINGS[key])
    return { hints: pick('hints'), challengeMode: pick('challengeMode'), symbolRounds: pick('symbolRounds') }
  } catch {
    return DEFAULT_SETTINGS
  }
}

/** Ajustes que se aplican: los elegidos, limitados a las funcionalidades disponibles. */
export function applyFeatures(settings: Settings, features: Features): Settings {
  return {
    hints: settings.hints && features.hints,
    challengeMode: settings.challengeMode && features.challengeMode,
    symbolRounds: settings.symbolRounds && features.symbolRounds,
  }
}

export function modeOf(settings: Settings): Mode {
  return settings.challengeMode ? 'challenge' : 'normal'
}

function load(): Settings {
  try {
    return parseSettings(window.localStorage.getItem(STORAGE_KEY))
  } catch {
    return DEFAULT_SETTINGS
  }
}

function save(value: Settings): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
  } catch {
    // Sin localStorage: los ajustes no persisten.
  }
}

const isBrowser = typeof window !== 'undefined'

const store = writable<Settings>(isBrowser ? load() : DEFAULT_SETTINGS)
if (isBrowser) store.subscribe(save)

export const settings = {
  subscribe: store.subscribe,
  set(key: SettingKey, value: boolean) {
    store.update((current) => ({ ...current, [key]: value }))
  },
}

export const activeSettings = derived(store, (value) => applyFeatures(value, FEATURES))
