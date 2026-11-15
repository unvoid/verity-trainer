/**
 * Contorno de las tiles de piedra: sin una sola línea recta, como la sala.
 *
 * Como las columnas (`squircleColumn` en `ribbons.ts`), cada cuarto es un cuarto de
 * superelipse hecho con una sola curva de Bézier: sale horizontal del centro de
 * arriba (o de abajo) y llega vertical a media altura del lateral. Al ser una sola
 * curva por cuarto, no hay uniones entre arco y lateral: ni hombros ni ondas. La
 * forma es simétrica arriba-abajo e izquierda-derecha.
 *
 * Los controles van sobre los lados del rectángulo, a su cuadratura: cuanto más
 * cerca de 1, más se acerca la forma a un rectángulo (arcos y laterales más planos,
 * esquinas más cerradas). Se calcula con el tamaño real de la tile.
 */

export interface TileSquareness {
  /** Cuadratura de los arcos de arriba y abajo (0–1). */
  readonly top: number
  /** Cuadratura de los laterales (0–1). */
  readonly side: number
}

export const TILE_SQUARENESS: TileSquareness = { top: 0.9, side: 0.95 }

const round = (value: number) => Math.round(value * 100) / 100

/**
 * Contorno de una tile de `width` × `height` px como `d` de un `path` SVG.
 * `inset` lo mete hacia dentro (positivo, p. ej. el surco) o lo saca hacia fuera
 * (negativo, p. ej. el anillo de foco).
 */
export function tilePath(width: number, height: number, inset = 0, squareness: TileSquareness = TILE_SQUARENESS): string {
  const left = inset
  const right = width - inset
  const top = inset
  const bottom = height - inset
  if (right <= left || bottom <= top) return ''

  const cx = (left + right) / 2
  const cy = (top + bottom) / 2
  // Distancia de los controles al centro de su lado.
  const dx = squareness.top * (right - cx)
  const dy = squareness.side * (bottom - cy)

  const p = (x: number, y: number) => `${round(x)} ${round(y)}`

  return [
    `M ${p(cx, top)}`,
    `C ${p(cx + dx, top)} ${p(right, cy - dy)} ${p(right, cy)}`,
    `C ${p(right, cy + dy)} ${p(cx + dx, bottom)} ${p(cx, bottom)}`,
    `C ${p(cx - dx, bottom)} ${p(left, cy + dy)} ${p(left, cy)}`,
    `C ${p(left, cy - dy)} ${p(cx - dx, top)} ${p(cx, top)}`,
    'Z',
  ].join(' ')
}
