/**
 * Núcleo del i18n: tipos y funciones puras, sin Svelte ni APIs del navegador.
 */
import type { es } from './es'

export const LOCALES = ['es', 'en'] as const
export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'en'

/** Forma de un diccionario: las claves de `es.ts`, todas con valor `string`. */
export type Messages = typeof es
export type MessageKey = keyof Messages
export type MessageParams = Record<string, string | number>

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value)
}

/**
 * Elige el primer idioma soportado de una lista de preferencias del navegador
 * (p. ej. `navigator.languages`), comparando por idioma principal: `es-ES` → `es`.
 */
export function resolveLocale(preferred: readonly string[], fallback: Locale = DEFAULT_LOCALE): Locale {
  for (const tag of preferred) {
    const primary = tag.toLowerCase().split('-')[0]
    if (isLocale(primary)) return primary
  }
  return fallback
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
