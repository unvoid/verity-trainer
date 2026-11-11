/**
 * Núcleo del i18n: tipos y funciones puras, sin Svelte ni APIs del navegador.
 */
import type { en } from './en'

export const LOCALES = ['es', 'en'] as const
export type Locale = (typeof LOCALES)[number]

/** Idioma de la web mientras el jugador no elija otro. */
export const DEFAULT_LOCALE: Locale = 'en'

/** Forma de un diccionario: las claves de `en.ts` (idioma base), todas con valor `string`. */
export type Messages = typeof en
export type MessageKey = keyof Messages
export type MessageParams = Record<string, string | number>

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value)
}

/**
 * Devuelve el texto de `key`, sustituyendo `{param}` por su valor.
 * Los marcadores sin parámetro se dejan tal cual para que el fallo sea visible.
 */
export function translate(messages: Messages, key: MessageKey, params?: MessageParams): string {
  const template = messages[key]
  if (!params) return template
  return template.replace(/\{(\w+)\}/g, (placeholder, name: string) =>
    Object.hasOwn(params, name) ? String(params[name]) : placeholder,
  )
}

/**
 * Claves con plural: las que existen como `<base>.one` y `<base>.other`.
 * P. ej. `status.swaps.one` + `status.swaps.other` → `status.swaps`.
 */
export type PluralKey = {
  [K in MessageKey]: K extends `${infer Base}.one` ? (`${Base}.other` extends MessageKey ? Base : never) : never
}[MessageKey]

/**
 * Texto con plural según `count` y las reglas del idioma (`Intl.PluralRules`).
 * Para los idiomas soportados basta con `one` y `other`. `count` se pasa como
 * parámetro `{count}`.
 */
export function translatePlural(
  messages: Messages,
  locale: Locale,
  key: PluralKey,
  count: number,
  params?: MessageParams,
): string {
  const category = new Intl.PluralRules(locale).select(count) === 'one' ? 'one' : 'other'
  return translate(messages, `${key}.${category}`, { count, ...params })
}
