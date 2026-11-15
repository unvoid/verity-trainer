import { describe, expect, it } from 'vitest'
import { MIST_PRESET, MIST_PRESETS, mistTile } from '../src/lib/visual/mist'

const decode = (url: string) => decodeURIComponent(url.slice('url("data:image/svg+xml,'.length, -'")'.length))

describe('mist', () => {
  it('builds a seamless fractal-noise tile as an SVG data URL', () => {
    const url = mistTile({ tile: 600, frequency: 0.004, seed: 7 }, { contrast: 2.5, threshold: 1 })
    expect(url.startsWith('url("data:image/svg+xml,')).toBe(true)
    const svg = decode(url)
    expect(svg).toContain('width="600" height="600"')
    expect(svg).toContain('type="fractalNoise"')
    expect(svg).toContain('baseFrequency="0.004"')
    expect(svg).toContain('seed="7"')
    // Se repite sin costuras.
    expect(svg).toContain('stitchTiles="stitch"')
    // Blanco con el alfa sacado del ruido, con contraste y umbral.
    expect(svg).toContain('2.5 0 0 0 -1')
  })

  it('uses an existing preset', () => {
    expect(Object.keys(MIST_PRESETS)).toContain(MIST_PRESET)
  })

  describe.each(Object.entries(MIST_PRESETS))('preset %s', (_name, preset) => {
    it('keeps average noise almost transparent so the mist forms patches, not a uniform veil', () => {
      expect(preset.contrast * 0.5 - preset.threshold).toBeLessThan(0.3)
      expect(preset.contrast * 0.8 - preset.threshold).toBeGreaterThan(0.6)
      expect(preset.strength).toBeGreaterThan(0)
      expect(preset.strength).toBeLessThanOrEqual(1)
    })

    it('has several layers with different cloud sizes, speeds and directions, moving slowly', () => {
      const { layers } = preset
      expect(layers.length).toBeGreaterThanOrEqual(2)
      expect(new Set(layers.map((l) => l.tile)).size).toBe(layers.length)
      expect(new Set(layers.map((l) => l.duration)).size).toBe(layers.length)
      expect(new Set(layers.map((l) => Math.sign(l.drift[0]))).size).toBe(2)
      for (const layer of layers) {
        // Lento: un recorrido completo de más de medio minuto.
        expect(layer.duration).toBeGreaterThanOrEqual(30)
        expect(layer.opacity).toBeGreaterThan(0)
        expect(layer.opacity).toBeLessThanOrEqual(1)
      }
    })
  })

  it('the breeze preset moves faster and is more present than the calm one', () => {
    const avg = (xs: readonly number[]) => xs.reduce((a, b) => a + b, 0) / xs.length
    const speed = (p: (typeof MIST_PRESETS)[keyof typeof MIST_PRESETS]) =>
      avg(p.layers.map((l) => Math.hypot(...l.drift) / l.duration))
    expect(speed(MIST_PRESETS.breeze)).toBeGreaterThan(2 * speed(MIST_PRESETS.calm))
    expect(MIST_PRESETS.breeze.strength).toBeGreaterThan(MIST_PRESETS.calm.strength)
  })
})
