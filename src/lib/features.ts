/**
 * Funcionalidades disponibles en esta versión (interruptores de compilación).
 *
 * Se fijan con variables de entorno al compilar (`.env`, `.env.production`...):
 *   VITE_FEATURE_CHALLENGE_MODE=false
 * Una funcionalidad desactivada no aparece en la interfaz y su ajuste se ignora,
 * aunque el jugador lo tuviera guardado. No confundir con los ajustes, que
 * activa o desactiva el jugador (ver `stores/settings.ts`).
 */

export interface Features {
  readonly hints: boolean
  readonly challengeMode: boolean
  readonly symbolRounds: boolean
}

/** Valor de un interruptor: `true`/`1`/`on` activan, `false`/`0`/`off` desactivan; otro valor → `fallback`. */
export function parseFlag(value: string | undefined, fallback: boolean): boolean {
  const normalized = value?.trim().toLowerCase()
  if (normalized === 'true' || normalized === '1' || normalized === 'on') return true
  if (normalized === 'false' || normalized === '0' || normalized === 'off') return false
  return fallback
}

export const FEATURES: Features = {
  hints: parseFlag(import.meta.env.VITE_FEATURE_HINTS, true),
  challengeMode: parseFlag(import.meta.env.VITE_FEATURE_CHALLENGE_MODE, true),
  symbolRounds: parseFlag(import.meta.env.VITE_FEATURE_SYMBOL_ROUNDS, true),
}
