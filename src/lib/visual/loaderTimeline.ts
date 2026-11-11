/**
 * Tiempos del loader de fragmentos en modo "una vez" (ver ShardLoader).
 *
 * Fracciones del ciclo (`cycle`), con la animación ya en marcha:
 * - La primera forma empieza entera y se rompe a FIRST_BREAK.
 * - La segunda empieza a recomponerse BREAK_LEAD después (para que la rotura se
 *   lea antes) y se rompe a su vez; la última entra BREAK_LEAD después de esa rotura
 *   y queda entera a FINAL_FORMED.
 * La forma que se rompe se pinta encima de la que entra (ver ShardLoader).
 * Las fracciones salen de la línea de tiempo de cada forma: 0–11 % se recompone,
 * 11–33 % entera, 33–45 % se rompe (la primera arranca en el 12 %, ya entera).
 */

export const FIRST_START = -0.12
/** Fracción del ciclo en que una forma se rompe, desde su inicio (33 %). */
export const BREAK_AT = 0.33
/** Margen entre el inicio de una rotura y el inicio de la forma siguiente. */
export const BREAK_LEAD = 0.05
export const FIRST_BREAK = FIRST_START + BREAK_AT
export const MIDDLE_START = FIRST_BREAK + BREAK_LEAD
export const FINAL_START = MIDDLE_START + BREAK_AT + BREAK_LEAD
export const FINAL_FORMED = FINAL_START + 0.11

/** Milisegundos desde que arranca la animación hasta que la última forma queda entera. */
export function onceDuration(cycle: number): number {
  return Math.round(cycle * FINAL_FORMED)
}

export interface SplashTimings {
  /** Fundido de entrada del título y la primera forma, sin animación. */
  readonly fadeIn: number
  /** Pausa con la primera forma quieta antes de empezar la animación. */
  readonly pauseBeforeStart: number
  /** Pausa con la última forma entera antes de salir. */
  readonly holdLast: number
  /** Fundido de salida del título y la forma. */
  readonly fadeOut: number
  /** Fundido de la capa de fondo, que deja ver la app. */
  readonly overlayFade: number
  /** Cuánto antes de terminar el fundido de salida empieza el de la capa (0: la forma y el título ya han desaparecido). */
  readonly overlap: number
}

export const DEFAULT_SPLASH_TIMINGS: SplashTimings = {
  fadeIn: 400,
  pauseBeforeStart: 200,
  holdLast: 400,
  fadeOut: 400,
  overlayFade: 400,
  overlap: 0,
}

export interface SplashSchedule {
  /** Empieza la animación de las formas. */
  readonly start: number
  /** Empieza el fundido de salida del título y la forma. */
  readonly fadeOut: number
  /** Empieza el fundido de la capa y la aparición de la app. */
  readonly reveal: number
  /** Termina todo: se retira la pantalla de entrada. */
  readonly end: number
}

/** Momentos (ms desde que aparece la pantalla de entrada) de cada fase. */
export function splashSchedule(cycle: number, timings: SplashTimings = DEFAULT_SPLASH_TIMINGS): SplashSchedule {
  const start = timings.fadeIn + timings.pauseBeforeStart
  const fadeOut = start + onceDuration(cycle) + timings.holdLast
  const reveal = fadeOut + timings.fadeOut - timings.overlap
  return { start, fadeOut, reveal, end: reveal + timings.overlayFade }
}
