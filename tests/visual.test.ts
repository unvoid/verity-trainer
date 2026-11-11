import { describe, expect, it } from 'vitest'
import { HALF_OVERLAP, halves, shardShapes, wedges } from '../src/lib/visual/shards'
import { SILHOUETTES } from '../src/lib/visual/silhouettes'

const parse = (points: string) => points.split(' ').map((p) => p.split(',').map(Number) as [number, number])

describe('shard loader geometry', () => {
  it('has square, triangle and circle in that order, with the shared silhouettes', () => {
    const shapes = shardShapes()
    expect(shapes.map((s) => s.symbol)).toEqual(['square', 'triangle', 'circle'])
    for (const shape of shapes) expect(shape.silhouette).toBe(SILHOUETTES[shape.symbol])
  })

  it('splits square and triangle in two halves and the circle in three wedges', () => {
    const [square, triangle, circle] = shardShapes()
    expect(square!.shards).toHaveLength(2)
    expect(triangle!.shards).toHaveLength(2)
    expect(circle!.shards).toHaveLength(3)
  })

  it('halves overlap across the horizontal cut and separate vertically', () => {
    const [top, bottom] = halves(50)
    const topMaxY = Math.max(...parse(top!.points).map(([, y]) => y))
    const bottomMinY = Math.min(...parse(bottom!.points).map(([, y]) => y))
    expect(topMaxY - bottomMinY).toBeCloseTo(2 * HALF_OVERLAP)
    expect(top!.dy).toBeLessThan(0)
    expect(bottom!.dy).toBeGreaterThan(0)
  })

  it('wedges cover the centre (apex pulled back) and move outwards', () => {
    for (const wedge of wedges([-60, 60, 180])) {
      const [apex] = parse(wedge.points)
      // El vértice queda al otro lado del centro respecto a la dirección de salida.
      expect((apex![0] - 50) * wedge.dx + (apex![1] - 50) * wedge.dy).toBeLessThan(0)
      expect(Math.hypot(wedge.dx, wedge.dy)).toBeCloseTo(6, 0)
    }
  })

  it('scales the separation', () => {
    expect(halves(50, 10)[1]!.dy).toBe(10)
  })
})
