/**
 * Composición y descomposición de formas 3D en símbolos 2D.
 */
import { SHAPES, type Shape3D, type Symbol2D } from './types'

/** Los dos símbolos de cada forma 3D. */
export const SHAPE_SYMBOLS: Readonly<Record<Shape3D, readonly [Symbol2D, Symbol2D]>> = {
  sphere: ['circle', 'circle'],
  cube: ['square', 'square'],
  tetrahedron: ['triangle', 'triangle'],
  cylinder: ['circle', 'square'],
  cone: ['circle', 'triangle'],
  prism: ['square', 'triangle'],
}

export function decompose(shape: Shape3D): readonly [Symbol2D, Symbol2D] {
  return SHAPE_SYMBOLS[shape]
}

/** Forma 3D formada por dos símbolos, en cualquier orden. */
export function compose(a: Symbol2D, b: Symbol2D): Shape3D {
  const shape = SHAPES.find((candidate) => {
    const [x, y] = SHAPE_SYMBOLS[candidate]
    return (x === a && y === b) || (x === b && y === a)
  })
  // Las seis formas cubren todos los pares posibles: nunca llega aquí.
  if (!shape) throw new Error(`No shape for symbols ${a} + ${b}`)
  return shape
}

/** Forma pura: sus dos símbolos son iguales (esfera, cubo, tetraedro). */
export function isPure(shape: Shape3D): boolean {
  const [a, b] = SHAPE_SYMBOLS[shape]
  return a === b
}

/** Forma pura de un símbolo: círculo → esfera, etc. */
export function pureShapeOf(symbol: Symbol2D): Shape3D {
  return compose(symbol, symbol)
}

export function contains(shape: Shape3D, symbol: Symbol2D): boolean {
  return SHAPE_SYMBOLS[shape].includes(symbol)
}

/** Cuántas veces aparece un símbolo en una forma (0, 1 o 2). */
export function countSymbol(shape: Shape3D, symbol: Symbol2D): number {
  return SHAPE_SYMBOLS[shape].filter((s) => s === symbol).length
}

/**
 * Forma resultante de quitar un `removed` y añadir un `added`.
 * Lanza un error si la forma no contiene `removed`.
 */
export function replaceSymbol(shape: Shape3D, removed: Symbol2D, added: Symbol2D): Shape3D {
  const [a, b] = SHAPE_SYMBOLS[shape]
  if (a === removed) return compose(added, b)
  if (b === removed) return compose(a, added)
  throw new Error(`Shape ${shape} does not contain ${removed}`)
}
