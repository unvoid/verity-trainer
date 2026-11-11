/**
 * Siluetas de los símbolos 2D en un lienzo de 100×100. Compartidas por
 * `Symbol2D` y el loader, para que las formas sean siempre las mismas.
 */
import type { Symbol2D } from '../domain/types'

export const SILHOUETTES: Readonly<Record<Symbol2D, string>> = {
  circle: 'M50 8 a42 42 0 1 1 0 84 a42 42 0 1 1 0 -84 Z',
  square: 'M12 12 H88 V88 H12 Z',
  triangle: 'M50 8 L94 88 H6 Z',
}

/** Centro visual de cada silueta (el del triángulo queda por debajo de la mitad). */
export const VISUAL_CENTER_Y: Readonly<Record<Symbol2D, number>> = { circle: 50, square: 50, triangle: 62 }
