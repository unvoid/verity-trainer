/**
 * Store del idioma activo y función `t()` reactiva.
 *
 * - Idioma inicial: el guardado en localStorage o, si no hay, el del navegador.
 * - Al cambiar: se guarda la preferencia y se actualiza `<html lang>`.
 */
import { derived, writable } from 'svelte/store'
import {
  DEFAULT_LOCALE,
  isLocale,
  resolveLocale,
  translate,
  type Locale,
  type MessageKey,
  type MessageParams,
  type Messages,
} from './core'
import { en } from './en'
import { es } from './es'

export { LOCALES, type Locale, type MessageKey, type MessageParams } from './core'

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
  return readStoredLocale() ?? resolveLocale(navigator.languages ?? [navigator.language])
}

export const locale = writable<Locale>(initialLocale())

if (isBrowser) {
  locale.subscribe((value) => {
    storeLocale(value)
    document.documentElement.lang = value
  })
}

export type Translate = (key: MessageKey, params?: MessageParams) => string

export const t = derived(locale, (value): Translate => {
  const messages = dictionaries[value]
  return (key, params) => translate(messages, key, params)
})
