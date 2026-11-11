/**
 * Tipos del dominio del encuentro Verity. TypeScript puro, sin Svelte.
 */

/** Formas 2D (símbolos). En el juego: Orbicular / Quadrate / Trigon. */
export const SYMBOLS = ['circle', 'square', 'triangle'] as const
export type Symbol2D = (typeof SYMBOLS)[number]

/** Formas 3D (sólidos). Cada una se compone de dos símbolos. */
export const SHAPES = ['sphere', 'cube', 'tetrahedron', 'cylinder', 'cone', 'prism'] as const
export type Shape3D = (typeof SHAPES)[number]

/** Posiciones, de izquierda a derecha. */
export const SLOTS = ['left', 'mid', 'right'] as const
export type Slot = (typeof SLOTS)[number]

/** Símbolos de la sala interior, uno por posición. */
export type Callouts = Readonly<Record<Slot, Symbol2D>>

/** Formas 3D de las estatuas exteriores, una por posición. */
export type Statues = Readonly<Record<Slot, Shape3D>>

/** Punto de partida de una partida. */
export interface Scenario {
  readonly callouts: Callouts
  readonly statues: Statues
}

/** Un depósito: qué símbolo en qué estatua. */
export interface Deposit {
  readonly slot: Slot
  readonly symbol: Symbol2D
}

/** Estatua marcada por el primer depósito, a la espera del segundo. */
export type Selection = Deposit

/** Un intercambio completo: el depósito que marca y el que intercambia. */
export interface Swap {
  readonly first: Deposit
  readonly second: Deposit
}

export interface GameState {
  readonly callouts: Callouts
  readonly statues: Statues
  readonly selection: Selection | null
  readonly swaps: number
  /** Marca de tiempo (ms) de inicio. La pone quien crea el estado. */
  readonly startedAt: number
}

export type Mode = 'normal' | 'challenge'
