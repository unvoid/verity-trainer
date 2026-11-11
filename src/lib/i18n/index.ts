/**
 * Store del idioma activo y función `t()` reactiva.
 *
 * - Idioma inicial: el guardado en localStorage o, si no hay, inglés (`DEFAULT_LOCALE`).
 *   No se detecta el del navegador: la web es en inglés salvo que el jugador elija otro.
 * - Al cambiar: se actualiza `<html lang>` y se guarda la elección en localStorage
 *   (solo si el jugador ha elegido; el idioma por defecto no se guarda).
 */
import { derived, writable } from 'svelte/store'
import {
  DEFAULT_LOCALE,
  isLocale,
  translate,
  translatePlural,
  type Locale,
  type MessageKey,
  type MessageParams,
  type Messages,
  type PluralKey,
} from './core'
import { en } from './en'
import { es } from './es'

export { LOCALES, type Locale, type MessageKey, type MessageParams, type PluralKey } from './core'

const STORAGE_KEY = 'verity-trainer:locale'

const dictionaries: Record<Locale, Messages> = { es, en }

const isBrowser = typeof window !== 'undefined'

function readStoredLocale(): Locale | null {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return isLocale(stored) ? stored : null
  } catch {
    return null
  }
}

function storeLocale(value: Locale): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, value)
  } catch {
    // Sin localStorage (modo privado, permisos): la preferencia no persiste.
  }
}

function initialLocale(): Locale {
  if (!isBrowser) return DEFAULT_LOCALE
  return readStoredLocale() ?? DEFAULT_LOCALE
}

const initial = initialLocale()
export const locale = writable<Locale>(initial)

if (isBrowser) {
  locale.subscribe((value) => {
    document.documentElement.lang = value
    // Solo se guarda lo que elige el jugador, no el idioma por defecto.
    if (value !== initial || readStoredLocale() !== null) storeLocale(value)
  })
}

export type Translate = (key: MessageKey, params?: MessageParams) => string
export type TranslatePlural = (key: PluralKey, count: number, params?: MessageParams) => string

export const t = derived(locale, (value): Translate => {
  const messages = dictionaries[value]
  return (key, params) => translate(messages, key, params)
})

/** Como `t`, pero elige singular o plural según `count` (claves `.one` / `.other`). */
export const tn = derived(locale, (value): TranslatePlural => {
  const messages = dictionaries[value]
  return (key, count, params) => translatePlural(messages, value, key, count, params)
})
