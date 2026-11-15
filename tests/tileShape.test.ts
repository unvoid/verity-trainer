import { describe, expect, it } from 'vitest'
import { tilePath } from '../src/lib/visual/tileShape'

type Point = [number, number]

/** Puntos de cada comando del path (inicio y curvas cúbicas, en orden). */
function parse(d: string): { start: Point; curves: [Point, Point, Point][] } {
  const numbers = (part: string) => part.trim().split(/\s+/).map(Number)
  const parts = d.split(/(?=[MCZ])/).map((part) => part.trim())
  const [mx, my] = numbers(parts[0]!.slice(1))
  const curves = parts
    .filter((part) => part.startsWith('C'))
    .map((part) => {
      const n = numbers(part.slice(1))
      return [
        [n[0]!, n[1]!],
        [n[2]!, n[3]!],
        [n[4]!, n[5]!],
      ] as [Point, Point, Point]
    })
  return { start: [mx!, my!], curves }
}

function sample(d: string, steps = 20): Point[] {
  const { start, curves } = parse(d)
  const points: Point[] = []
  let from = start
  for (const [c1, c2, to] of curves) {
    for (let i = 0; i <= steps; i++) {
      const t = i / steps
      const u = 1 - t
      const at = (k: 0 | 1) => u * u * u * from[k] + 3 * u * u * t * c1[k] + 3 * u * t * t * c2[k] + t * t * t * to[k]
      points.push([at(0), at(1)])
    }
    from = to
  }
  return points
}

describe('tile shape', () => {
  const width = 180
  const height = 150

  it('is a closed path of cubic curves only (no straight segments)', () => {
    const d = tilePath(width, height)
    expect(d.startsWith('M')).toBe(true)
    expect(d.endsWith('Z')).toBe(true)
    expect(d).not.toMatch(/[LHV]/)
    expect(parse(d).curves).toHaveLength(4)
  })

  it('fits the box and touches its four sides', () => {
    const points = sample(tilePath(width, height))
    const xs = points.map(([x]) => x)
    const ys = points.map(([, y]) => y)
    expect(Math.min(...xs)).toBeCloseTo(0, 1)
    expect(Math.max(...xs)).toBeCloseTo(width, 1)
    expect(Math.min(...ys)).toBeCloseTo(0, 1)
    expect(Math.max(...ys)).toBeCloseTo(height, 1)
  })

  it('is symmetric left-right', () => {
    for (const [x, y] of sample(tilePath(width, height))) {
      const mirrored = sample(tilePath(width, height)).some(
        ([mx, my]) => Math.abs(mx - (width - x)) < 0.5 && Math.abs(my - y) < 0.5,
      )
      expect(mirrored).toBe(true)
    }
  })

  it('joins its curves smoothly (each one leaves along the previous tangent)', () => {
    const { start, curves } = parse(tilePath(width, height))
    let previous: { c2: Point; end: Point } = { c2: curves.at(-1)![1], end: start }
    for (const [c1, c2, end] of curves) {
      const incoming: Point = [previous.end[0] - previous.c2[0], previous.end[1] - previous.c2[1]]
      const outgoing: Point = [c1[0] - previous.end[0], c1[1] - previous.end[1]]
      const cross = incoming[0] * outgoing[1] - incoming[1] * outgoing[0]
      const dot = incoming[0] * outgoing[0] + incoming[1] * outgoing[1]
      expect(Math.abs(cross)).toBeLessThan(1e-6 + 0.01 * Math.hypot(...incoming) * Math.hypot(...outgoing))
      expect(dot).toBeGreaterThan(0)
      previous = { c2, end }
    }
  })

  it('curves every side outwards uniformly: convex, widest at the middle, never wavy', () => {
    const points = sample(tilePath(width, height))
    // Cuarto superior derecho: al bajar, x solo crece (sin S) y llega al borde a media altura.
    const quarter = points.filter(([x, y]) => x >= width / 2 && y <= height / 2).sort((a, b) => a[1] - b[1])
    for (let i = 1; i < quarter.length; i++) expect(quarter[i]![0]).toBeGreaterThanOrEqual(quarter[i - 1]![0] - 1e-9)
    const widest = quarter.reduce((a, b) => (b[0] > a[0] ? b : a))
    expect(widest[0]).toBeCloseTo(width, 5)
    expect(widest[1]).toBeCloseTo(height / 2, 5)
    // Sin tramo recto: a un cuarto de altura el lateral ya se ha recogido algo.
    const quarterHeight = quarter.reduce((a, b) => (Math.abs(b[1] - height / 4) < Math.abs(a[1] - height / 4) ? b : a))
    expect(width - quarterHeight[0]).toBeGreaterThan(0.5)
  })

  it('moves the outline in or out with the inset', () => {
    const inner = sample(tilePath(width, height, 5))
    const outer = sample(tilePath(width, height, -3))
    expect(Math.min(...inner.map(([x]) => x))).toBeCloseTo(5, 1)
    expect(Math.min(...outer.map(([x]) => x))).toBeCloseTo(-3, 1)
  })

  it('returns an empty path when there is no room', () => {
    expect(tilePath(0, 0)).toBe('')
    expect(tilePath(10, 10, 6)).toBe('')
  })
})
