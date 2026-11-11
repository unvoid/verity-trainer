/**
 * Geometría del loader de fragmentos (ver docs/estetica.md, "Loader").
 *
 * Cada forma se parte con cortes rectos:
 * - Cuadrado y triángulo: dos mitades por un corte horizontal.
 * - Círculo: tres quesitos iguales desde el centro.
 * Cada fragmento es un polígono grande que se recorta con la silueta de la forma.
 * Los fragmentos se solapan unas décimas por el corte para que al encajar no
 * quede una costura de antialias.
 */
import type { Symbol2D } from '../domain/types'
import { SILHOUETTES } from './silhouettes'

export interface Shard {
  /** Puntos del polígono (atributo `points`), en el lienzo de 100×100. */
  readonly points: string
  /** Desplazamiento al romperse (unidades del lienzo). */
  readonly dx: number
  readonly dy: number
  /** Giro y sesgo al romperse (grados). */
  readonly rotate: number
  readonly skew: number
}

export interface ShardShape {
  readonly symbol: Symbol2D
  readonly silhouette: string
  readonly shards: readonly Shard[]
}

/** Solape por el corte de las mitades (unidades). */
export const HALF_OVERLAP = 0.6
/** Solape de los quesitos: ángulo extra por lado (grados) y retraso del vértice (unidades). */
export const WEDGE_OVERLAP_DEG = 1.5
export const WEDGE_APEX_OFFSET = 1.5

const round = (n: number) => Math.round(n * 10) / 10
const toPoints = (pts: readonly (readonly [number, number])[]) => pts.map(([x, y]) => `${round(x)},${round(y)}`).join(' ')
const rad = (deg: number) => (deg * Math.PI) / 180

/** Dos mitades por un corte horizontal en `cutY`: la de arriba sube y la de abajo baja. */
export function halves(cutY: number, separation = 6): Shard[] {
  const top = cutY + HALF_OVERLAP
  const bottom = cutY - HALF_OVERLAP
  return [
    { points: toPoints([[0, 0], [100, 0], [100, top], [0, top]]), dx: -2, dy: -separation, rotate: -4, skew: 6 },
    { points: toPoints([[0, bottom], [100, bottom], [100, 100], [0, 100]]), dx: 2, dy: separation, rotate: 3, skew: -6 },
  ]
}

/** Quesitos desde el centro, cortados en los ángulos dados (grados, en orden creciente). */
export function wedges(angles: readonly number[], separation = 6): Shard[] {
  const rotations = [-5, 4, -3]
  const skews = [6, -5, 4]
  const at = (deg: number, r: number, from: readonly [number, number] = [50, 50]) =>
    [from[0] + Math.cos(rad(deg)) * r, from[1] + Math.sin(rad(deg)) * r] as const

  return angles.map((start, i) => {
    const end = (angles[(i + 1) % angles.length] ?? start) + (i === angles.length - 1 ? 360 : 0)
    const mid = (start + end) / 2
    const apex = at(mid + 180, WEDGE_APEX_OFFSET)
    const points = toPoints([apex, at(start - WEDGE_OVERLAP_DEG, 95), at(mid, 95), at(end + WEDGE_OVERLAP_DEG, 95)])
    const [dx, dy] = at(mid, separation, [0, 0])
    return {
      points,
      dx: round(dx),
      dy: round(dy),
      rotate: rotations[i % rotations.length]!,
      skew: skews[i % skews.length]!,
    }
  })
}

/** Formas del loader, en el orden en que aparecen. */
export function shardShapes(separation = 6): ShardShape[] {
  return [
    { symbol: 'square', silhouette: SILHOUETTES.square, shards: halves(50, separation) },
    { symbol: 'triangle', silhouette: SILHOUETTES.triangle, shards: halves(58, separation) },
    { symbol: 'circle', silhouette: SILHOUETTES.circle, shards: wedges([-60, 60, 180], separation) },
  ]
}
