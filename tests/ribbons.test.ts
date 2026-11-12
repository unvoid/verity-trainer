import { describe, expect, it } from 'vitest'
import {
  CRADLE_RIBBONS,
  CRADLE_SIZE,
  SCENE_CENTER_COLUMNS,
  SCENE_COLUMNS,
  SCENE_FUSION,
  SCENE_HELIX,
  SCENE_HORIZON_Y,
  SCENE_PATH_END,
  SCENE_SIZE,
  SCENE_SPHERE,
  band,
  curveNormals,
  ribbonBase,
  mirror,
  pair,
  ribbonPath,
  type Ribbon,
} from '../src/lib/visual/ribbons'

const AXIS = SCENE_SIZE.width / 2
const PATH_SHAPE = /^M[-\d. ]+ C[-\d. ]+( L[-\d. ]+)? C[-\d. ]+ Z$/

describe('ribbon geometry', () => {
  // Columna recta hacia arriba: la normal de la curva es (1, 0) en todos sus puntos.
  const column: Ribbon = { spine: [[0, 0], [0, -20], [0, -40], [0, -60]], width: [10, 6, 2, 0] }

  it('grows along the curve normal: a vertical column has a flat base and a sharp tip', () => {
    expect(ribbonPath(column)).toBe('M0 0 C0 -20 0 -40 0 -60 C2 -40 6 -20 10 0 Z')
    // Con grosor también en la punta, la punta queda plana.
    expect(ribbonPath({ ...column, width: [10, 6, 2, 1] })).toContain('0 -60 L1 -60 C2 -40')
  })

  it('a single width keeps both tips sharp', () => {
    const d = ribbonPath({ ...column, width: 4 })
    expect(d.startsWith('M0 0 ')).toBe(true)
    expect(d.endsWith(' 0 0 Z')).toBe(true)
  })

  it('curve normals follow the tangent at the ends', () => {
    const arch: Ribbon['spine'] = [[0, 0], [0, -50], [50, -100], [100, -100]]
    const [start, , , end] = curveNormals(arch)
    // Sube en vertical: la base es horizontal. Llega en horizontal: la punta es vertical.
    expect(start).toEqual([1, 0])
    expect(end[0]).toBeCloseTo(0)
    expect(end[1]).toBeCloseTo(1)
  })

  it('knows the centre and width of its base', () => {
    expect(ribbonBase(column)).toEqual({ center: [5, 0], width: 10 })
    expect(ribbonBase(mirror(column, 50))).toEqual({ center: [95, 0], width: 10 })
  })

  it('a band is a parallel strip inside the ribbon', () => {
    const strip = band(column, 0.25, 0.75)
    expect(strip.spine[0]).toEqual([2.5, 0])
    expect(strip.width).toEqual([5, 3, 1, 0])
    expect(strip.normals).toEqual(curveNormals(column.spine))
    expect(ribbonPath(band(column, 0, 1))).toBe(ribbonPath(column))
  })

  it('mirrors around a vertical axis and flips the side the width grows to', () => {
    const ribbon: Ribbon = { spine: [[0, 0], [10, -20], [30, -20], [40, 0]], width: 4 }
    const mirrored = mirror(ribbon, 50)
    expect(mirrored.spine).toEqual([[100, 0], [90, -20], [70, -20], [60, 0]])
    expect(mirrored.width).toBe(-4)
    expect(pair(ribbon, 50)).toEqual([ribbon, mirrored])
    expect(mirror(column, 50).width).toEqual([-10, -6, -2, -0])
    // El reflejo de una franja con normales propias es la franja del reflejo.
    expect(ribbonPath(mirror(band(column, 0.2, 0.8), 50))).toBe(ribbonPath(band(mirror(column, 50), 0.2, 0.8)))
  })
})

describe('scene composition', () => {
  const all = [
    ...SCENE_COLUMNS.map((c) => c.ribbon),
    ...SCENE_CENTER_COLUMNS,
    ...SCENE_HELIX,
    ...CRADLE_RIBBONS.back,
    ...CRADLE_RIBBONS.front,
  ]

  it('every ribbon produces a valid path', () => {
    for (const r of all) expect(ribbonPath(r)).toMatch(PATH_SHAPE)
  })

  it('has four great columns per side, all meeting at the fusion point above the sphere', () => {
    expect(SCENE_COLUMNS).toHaveLength(8)
    for (const { ribbon } of SCENE_COLUMNS) expect(ribbon.spine[3]).toEqual(SCENE_FUSION)
    expect(SCENE_FUSION[0]).toBe(AXIS)
    expect(SCENE_FUSION[1]).toBeLessThan(SCENE_SPHERE.cy - SCENE_SPHERE.r)
  })

  it('columns are drawn from the farthest to the nearest, and nearer ones are wider at the base', () => {
    const depths = SCENE_COLUMNS.map((c) => c.depth)
    expect(depths).toEqual([...depths].sort((a, b) => b - a))
    const baseWidth = (r: Ribbon) => Math.abs(typeof r.width === 'number' ? 0 : r.width[0])
    const left = SCENE_COLUMNS.filter((c) => c.ribbon.spine[0][0] < AXIS)
    for (let i = 1; i < left.length; i++) {
      expect(baseWidth(left[i]!.ribbon)).toBeGreaterThan(baseWidth(left[i - 1]!.ribbon))
    }
  })

  it('every column stands on the floor, below the horizon', () => {
    for (const { ribbon } of SCENE_COLUMNS) expect(ribbonBase(ribbon).center[1]).toBeGreaterThan(SCENE_HORIZON_Y)
    expect(SCENE_PATH_END[1]).toBeGreaterThan(SCENE_HORIZON_Y)
  })

  it('the two centre columns are born together at the end of the path and do not meet again', () => {
    const [left, right] = SCENE_CENTER_COLUMNS
    expect(Math.abs(left!.spine[0][1] - SCENE_PATH_END[1])).toBe(0)
    expect(Math.abs(left!.spine[0][0] - right!.spine[0][0])).toBeLessThan(20)
    // Arriba se pierden fuera del lienzo, cada una por su lado del eje.
    expect(left!.spine[3][1]).toBeLessThan(0)
    expect(left!.spine[3][0]).toBeLessThan(AXIS)
    expect(right!.spine[3][0]).toBeGreaterThan(AXIS)
  })

  it('is symmetric around the centre', () => {
    const key = (r: Ribbon) => JSON.stringify(r.spine.map(([x, y]) => [Math.round(x), Math.round(y)]))
    const groups = [SCENE_COLUMNS.map((c) => c.ribbon), SCENE_CENTER_COLUMNS, SCENE_HELIX]
    for (const group of groups) {
      const keys = new Set(group.map(key))
      for (const r of group) expect(keys.has(key(mirror(r, AXIS)))).toBe(true)
    }
  })

  it('cradle ribbons stay inside the cradle canvas horizontally', () => {
    for (const r of [...CRADLE_RIBBONS.back, ...CRADLE_RIBBONS.front]) {
      for (const [x] of r.spine) {
        expect(x).toBeGreaterThanOrEqual(0)
        expect(x).toBeLessThanOrEqual(CRADLE_SIZE.width)
      }
    }
  })
})
