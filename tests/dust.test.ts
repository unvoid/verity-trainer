import { describe, expect, it } from 'vitest'
import {
  DUST,
  createDust,
  dustDensity,
  fractalNoise,
  moteAlpha,
  motePosition,
  sceneFrame,
  seededRandom,
} from '../src/lib/visual/dust'
import { SCENE_SIZE, SCENE_SPHERE } from '../src/lib/visual/ribbons'

describe('snow dust', () => {
  const motes = createDust(1500, seededRandom(1))

  it('is the same on every load (seeded)', () => {
    expect(createDust(50, seededRandom(42))).toEqual(createDust(50, seededRandom(42)))
  })

  it('creates the requested motes inside the room', () => {
    expect(motes).toHaveLength(1500)
    for (const mote of motes) {
      expect(mote.x).toBeGreaterThanOrEqual(0)
      expect(mote.x).toBeLessThanOrEqual(SCENE_SIZE.width)
      expect(mote.y).toBeGreaterThanOrEqual(0)
      expect(mote.y).toBeLessThanOrEqual(SCENE_SIZE.height)
    }
  })

  it('gathers around the sphere much more than far from it', () => {
    const near = motes.filter((m) => Math.hypot(m.x - SCENE_SPHERE.cx, m.y - SCENE_SPHERE.cy) < SCENE_SPHERE.r * 1.5)
    const nearArea = Math.PI * (SCENE_SPHERE.r * 1.5) ** 2
    const density = (count: number, area: number) => count / area
    const overall = density(motes.length, SCENE_SIZE.width * SCENE_SIZE.height)
    expect(density(near.length, nearArea)).toBeGreaterThan(overall * 4)
    expect(dustDensity(SCENE_SPHERE.cx, SCENE_SPHERE.cy)).toBeGreaterThan(dustDensity(40, 960))
  })

  it('makes only a few big motes', () => {
    const big = motes.filter((m) => m.size >= DUST.bigSize[0])
    expect(big.length).toBeGreaterThan(0)
    expect(big.length / motes.length).toBeLessThan(DUST.bigShare * 2)
  })

  it('sways and swirls without drifting away: motes stay near their rest position', () => {
    const limit = Math.hypot(...DUST.wind) + 1
    for (const mote of motes.slice(0, 200)) {
      for (const t of [0, 13, 60, 600]) {
        const [x, y] = motePosition(mote, t)
        const fromSphere = Math.hypot(x - SCENE_SPHERE.cx, y - SCENE_SPHERE.cy)
        const restFromSphere = Math.hypot(mote.x - SCENE_SPHERE.cx, mote.y - SCENE_SPHERE.cy)
        // El giro conserva la distancia a la esfera; el vaivén la cambia como mucho lo que mide.
        expect(Math.abs(fromSphere - restFromSphere)).toBeLessThanOrEqual(limit)
      }
    }
  })

  it('twinkles between dim and full', () => {
    const mote = motes[0]!
    const alphas = Array.from({ length: 2000 }, (_, i) => moteAlpha(mote, i * 0.05))
    expect(Math.min(...alphas)).toBeGreaterThanOrEqual(0)
    expect(Math.max(...alphas)).toBeLessThanOrEqual(1)
    expect(Math.max(...alphas) - Math.min(...alphas)).toBeGreaterThan(mote.alpha * 0.5)
  })

  it('frames the room like the scene SVG (xMidYMid slice)', () => {
    const wide = sceneFrame(3200, 1000)
    expect(wide.scale).toBe(2)
    expect(wide.offsetX).toBe(0)
    expect(wide.offsetY).toBe(-500)
    const tall = sceneFrame(375, 740)
    expect(tall.scale).toBeCloseTo(0.74)
    expect(tall.offsetY).toBeCloseTo(0)
    expect(tall.offsetX).toBeLessThan(0)
  })

  it('uses noise between 0 and 1', () => {
    for (let i = 0; i < 200; i++) {
      const value = fractalNoise(i * 0.37, i * 0.11)
      expect(value).toBeGreaterThanOrEqual(0)
      expect(value).toBeLessThanOrEqual(1)
    }
  })
})
