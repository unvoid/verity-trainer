/**
 * Tema claro / oscuro.
 *
 * - Por defecto, claro (como el juego). No se mira la configuración del sistema:
 *   solo cambia si el jugador lo elige con el control de la cabecera.
 * - La elección se guarda en localStorage, aparte de los ajustes de juego.
 * - Se aplica como `data-theme` en `<html>` (los tokens del tema oscuro cuelgan de
 *   `:root[data-theme='dark']`).
 * - `index.html` aplica el tema guardado antes de pintar (sin destello claro).
 *
 * Las funciones de decisión son puras; el store solo las conecta con el navegador.
 */
import { writable } from 'svelte/store'

export type Theme = 'light' | 'dark'

export const DEFAULT_THEME: Theme = 'light'

/** Clave en localStorage. `index.html` usa la misma. */
export const THEME_STORAGE_KEY = 'verity-trainer:theme'

export function parseTheme(raw: string | null): Theme {
  return raw === 'dark' ? 'dark' : DEFAULT_THEME
}

export function oppositeTheme(theme: Theme): Theme {
  return theme === 'dark' ? 'light' : 'dark'
}

const isBrowser = typeof window !== 'undefined'

function load(): Theme {
  try {
    return parseTheme(window.localStorage.getItem(THEME_STORAGE_KEY))
  } catch {
    return DEFAULT_THEME
  }
}

function save(value: Theme): void {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, value)
  } catch {
    // Sin localStorage: la elección no persiste.
  }
}

const store = writable<Theme>(isBrowser ? load() : DEFAULT_THEME)

if (isBrowser) {
  store.subscribe((value) => {
    document.documentElement.dataset.theme = value
    save(value)
  })
}

/** Tema que se ve ahora. */
export const theme = { subscribe: store.subscribe }

/** Cambia al tema contrario al que se ve. */
export function toggleTheme(): void {
  store.update(oppositeTheme)
}
