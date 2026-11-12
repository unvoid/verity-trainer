import { describe, expect, it } from 'vitest'
import {
  CRADLE_RIBBONS,
  CRADLE_SIZE,
  SCENE_CENTER_COLUMNS,
  SCENE_COLUMNS,
  SCENE_FUSION,
  SCENE_HELIX,
  SCENE_HELIX_BOUNDS,
  HELIX_STRANDS,
  HELIX_RADIUS,
  SPHERE_GAP,
  helixRadius,
  SCENE_HORIZON_Y,
  SCENE_PATH_END,
  SCENE_SIZE,
  SCENE_SPHERE,
  COLUMN_SQUARENESS,
  squircleColumn,
  band,
  curveNormals,
  ribbonBase,
  mirror,
  pair,
  ribbonPath,
  strip,
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

  it('a strip keeps the same absolute thickness while the ribbon tapers', () => {
    const line = strip(column, () => [1, 3])
    // Mismo grosor (2) en todos los puntos con grosor suficiente; en la punta (grosor 0) se recorta.
    expect(line.width).toEqual([2, 2, 1, 0])
    expect(line.spine[0]).toEqual([1, 0])
    // Las distancias pueden depender del grosor de cada punto (p. ej. una fracción).
    expect(strip(column, (w) => [w / 2, w / 2 + 1]).spine[0]).toEqual([5, 0])
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
    ...SCENE_HELIX.map((s) => s.ribbon),
    ...CRADLE_RIBBONS.back,
    ...CRADLE_RIBBONS.front,
  ]

  it('every ribbon produces a valid path', () => {
    for (const r of all) expect(ribbonPath(r)).toMatch(PATH_SHAPE)
  })

  it('has four great columns per side meeting at a fusion point a few pixels above the sphere', () => {
    expect(SCENE_COLUMNS).toHaveLength(8)
    for (const { ribbon } of SCENE_COLUMNS) expect(ribbon.spine[3]).toEqual(SCENE_FUSION)
    expect(SCENE_FUSION[0]).toBe(AXIS)
    // La parte alta de la esfera queda unos pocos píxeles por debajo de la fusión.
    expect(SCENE_SPHERE.cy - SCENE_SPHERE.r - SCENE_FUSION[1]).toBe(SPHERE_GAP)
    expect(SPHERE_GAP).toBeGreaterThan(0)
    expect(SPHERE_GAP).toBeLessThanOrEqual(10)
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

  it('columns are quarter squircles: they rise straight, turn a rounded corner and reach the fusion level', () => {
    const { spine } = squircleColumn([100, 900], [10, 6, 2, 0])
    const [p0, p1, p2, p3] = spine
    // Sale de la base en vertical y llega a la fusión en horizontal (sin pico).
    expect(p1[0]).toBe(p0[0])
    expect(p2[1]).toBe(p3[1])
    // Más cuadrada que un círculo (0,55); el techo, algo menos que el lateral.
    expect(COLUMN_SQUARENESS.side).toBeGreaterThan(0.75)
    expect(COLUMN_SQUARENESS.top).toBeGreaterThan(0.55)
    expect(COLUMN_SQUARENESS.top).toBeLessThan(COLUMN_SQUARENESS.side)
    expect(p1[1]).toBeCloseTo(p0[1] - COLUMN_SQUARENESS.side * (p0[1] - SCENE_FUSION[1]))
  })

  it('the nearest column and its floor reflection make a shape wider than tall', () => {
    const nearest = SCENE_COLUMNS.at(-1)!.ribbon
    const [[x0, y0]] = nearest.spine
    const width = 2 * Math.abs(SCENE_FUSION[0] - x0)
    const height = 2 * (y0 - SCENE_FUSION[1])
    expect(width).toBeGreaterThan(height)
  })

  it('the two centre columns are born side by side at the end of the path and never merge', () => {
    const [left, right] = SCENE_CENTER_COLUMNS
    expect(left!.spine[0][1]).toBe(SCENE_PATH_END[1])
    expect(Math.abs(left!.spine[0][0] - right!.spine[0][0])).toBeLessThan(20)
    // Cada una se queda en su lado del eje, también arriba.
    for (const [x] of left!.spine) expect(x).toBeLessThan(AXIS)
    for (const [x] of right!.spine) expect(x).toBeGreaterThan(AXIS)
  })

  it('the centre columns are symmetric around the equator of the sphere and touch its sides there', () => {
    const ribbon = SCENE_CENTER_COLUMNS[0]!
    const [p0, p1, p2, p3] = ribbon.spine
    const { cx, cy, r } = SCENE_SPHERE
    // Espejo respecto al ecuador: mismos x, y reflejadas.
    expect(p3[0]).toBe(p0[0])
    expect(p2[0]).toBe(p1[0])
    expect(p0[1] - cy).toBeCloseTo(cy - p3[1])
    expect(p1[1] - cy).toBeCloseTo(cy - p2[1])
    // El grosor no es simétrico: anchas junto al suelo, muy finas arriba.
    const widths = (ribbon.width as readonly number[]).map(Math.abs)
    for (let i = 1; i < widths.length; i++) expect(widths[i]).toBeLessThan(widths[i - 1]!)
    expect(widths[3]!).toBeLessThan(widths[0]! / 4)
    // Nacen al final del camino.
    expect(p0[1]).toBe(SCENE_PATH_END[1])
    // Tocan la esfera en el ecuador sin entrar en ella.
    const at = (t: number, i: 0 | 1) =>
      (1 - t) ** 3 * p0[i] + 3 * (1 - t) ** 2 * t * p1[i] + 3 * (1 - t) * t ** 2 * p2[i] + t ** 3 * p3[i]
    let contact = { gap: Infinity, y: 0 }
    for (let t = 0; t <= 1; t += 0.001) {
      const gap = Math.hypot(at(t, 0) - cx, at(t, 1) - cy) - r
      if (gap < contact.gap) contact = { gap, y: at(t, 1) }
    }
    expect(contact.gap).toBeGreaterThan(-0.5)
    expect(contact.gap).toBeLessThan(0.5)
    expect(contact.y).toBeCloseTo(cy, 0)
  })

  it('the helix is an inverted cone: narrow at the floor, as wide as the sphere at the top', () => {
    const { top, bottom } = SCENE_HELIX_BOUNDS
    expect(helixRadius(top)).toBeCloseTo(SCENE_SPHERE.r)
    expect(helixRadius(bottom)).toBeCloseTo(HELIX_RADIUS.bottom)
    expect(HELIX_RADIUS.bottom).toBeLessThan(HELIX_RADIUS.top / 2)
    // Del suelo (final del camino) a un poco por encima de la parte baja de la esfera.
    expect(bottom).toBe(SCENE_PATH_END[1])
    expect(top).toBeLessThan(SCENE_SPHERE.cy + SCENE_SPHERE.r)
    expect(top).toBeGreaterThan(SCENE_SPHERE.cy + SCENE_SPHERE.r / 2)
    // Cubre todo el tramo visible y tiene vueltas por delante y por detrás.
    const ys = SCENE_HELIX.flatMap((s) => [s.ribbon.spine[0][1], s.ribbon.spine[3][1]])
    expect(Math.max(...ys)).toBeGreaterThanOrEqual(bottom)
    expect(Math.min(...ys)).toBeLessThanOrEqual(top)
    expect(SCENE_HELIX.some((s) => s.front)).toBe(true)
    expect(SCENE_HELIX.some((s) => !s.front)).toBe(true)
    expect(HELIX_STRANDS).toBe(3)
  })

  it('is symmetric around the centre', () => {
    const key = (r: Ribbon) => JSON.stringify(r.spine.map(([x, y]) => [Math.round(x), Math.round(y)]))
    const groups = [SCENE_COLUMNS.map((c) => c.ribbon), SCENE_CENTER_COLUMNS, SCENE_HELIX.map((s) => s.ribbon)]
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
