/**
 * Estado del arrastre en curso, compartido entre quien arrastra (la caja de
 * símbolos), quien lo dibuja (la capa de arrastre) y los destinos (estatuas).
 */
import { writable } from 'svelte/store'
import type { Slot, Symbol2D } from '../domain/types'

export interface DragState {
  readonly symbol: Symbol2D
  /** Posición del puntero en la ventana (px). */
  readonly x: number
  readonly y: number
  /** Estatua bajo el puntero, o `null`. */
  readonly over: Slot | null
}

export const drag = writable<DragState | null>(null)
