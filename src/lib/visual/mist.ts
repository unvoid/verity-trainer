/**
 * Bruma irregular sobre la escena: capas de ruido fractal (como nubes) que se
 * desplazan muy despacio, como si las moviera el viento.
 *
 * El ruido se genera una sola vez como imagen SVG (`feTurbulence`) y se usa
 * como máscara de una capa de color: el navegador lo pinta una vez y luego solo
 * mueve la capa, que es casi gratis (no se recalcula el ruido en cada fotograma).
 *
 * Funciones puras, sin Svelte.
 */

export interface MistLayer {
  /** Lado del mosaico de ruido, en px. Más grande = nubes más grandes. */
  readonly tile: number
  /** Frecuencia base del ruido (por px del mosaico). Más baja = nubes más grandes y suaves. */
  readonly frequency: number
  /** Semilla del ruido: cada capa con su propio dibujo. */
  readonly seed: number
  /** Intensidad de la capa (0 a 1). */
  readonly opacity: number
  /** Duración de un recorrido completo del viento, en segundos. */
  readonly duration: number
  /** Desplazamiento máximo en cada eje, en px (el signo marca la dirección). */
  readonly drift: readonly [number, number]
  /** Duración de una "ráfaga" (la capa se aclara y se vuelve a espesar), en segundos. */
  readonly gust: number
}

/** Un ajuste completo de la bruma: capas, forma de los jirones e intensidad. */
export interface MistPreset {
  readonly layers: readonly MistLayer[]
  /**
   * Forma de los jirones: alfa = `contrast` · ruido − `threshold`. El ruido medio
   * (0,5) queda casi transparente y solo las zonas densas forman nubes. Más
   * contraste = bordes más definidos.
   */
  readonly contrast: number
  readonly threshold: number
  /** Intensidad general (0 a 1). Se multiplica por `--mist-opacity` del tema. */
  readonly strength: number
}

/**
 * Ajustes para comparar. Las capas van de nubes grandes y lentas a más pequeñas
 * y algo más rápidas; al moverse en direcciones distintas, la forma de la bruma
 * cambia sin parar y nunca parece un dibujo que se desliza en bloque.
 */
export const MIST_PRESETS = {
  /** Casi quieta: se nota más al volver a mirar que mientras se mira. */
  calm: {
    layers: [
      { tile: 1400, frequency: 0.0016, seed: 3, opacity: 0.9, duration: 140, drift: [-180, 40], gust: 46 },
      { tile: 900, frequency: 0.0026, seed: 11, opacity: 0.7, duration: 105, drift: [140, -50], gust: 33 },
      { tile: 600, frequency: 0.004, seed: 23, opacity: 0.5, duration: 80, drift: [-90, -30], gust: 27 },
    ],
    contrast: 2.4,
    threshold: 0.95,
    strength: 0.6,
  },
  /** Viento suave que se percibe: unas tres veces más rápida, más presente y con bordes más definidos. */
  breeze: {
    layers: [
      { tile: 1400, frequency: 0.0016, seed: 3, opacity: 0.9, duration: 70, drift: [-380, 70], gust: 24 },
      { tile: 900, frequency: 0.0026, seed: 11, opacity: 0.75, duration: 55, drift: [300, -90], gust: 18 },
      { tile: 600, frequency: 0.004, seed: 23, opacity: 0.55, duration: 42, drift: [-200, -60], gust: 14 },
    ],
    contrast: 2.8,
    threshold: 1.15,
    strength: 0.8,
  },
} as const satisfies Record<string, MistPreset>

export type MistPresetName = keyof typeof MIST_PRESETS

/** Ajuste en uso. Cámbialo para comparar (`'calm'` o `'breeze'`). */
export const MIST_PRESET: MistPresetName = 'calm'

/**
 * Mosaico de ruido como imagen SVG en una URL `data:`, listo para `mask-image`.
 * Blanco con alfa variable; `stitchTiles` hace que el mosaico se repita sin costuras.
 */
export function mistTile(
  { tile, frequency, seed }: Pick<MistLayer, 'tile' | 'frequency' | 'seed'>,
  { contrast, threshold }: Pick<MistPreset, 'contrast' | 'threshold'>,
): string {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${tile}" height="${tile}">` +
    `<filter id="n" x="0" y="0" width="100%" height="100%">` +
    `<feTurbulence type="fractalNoise" baseFrequency="${frequency}" numOctaves="4" seed="${seed}" stitchTiles="stitch"/>` +
    `<feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 ${contrast} 0 0 0 -${threshold}"/>` +
    `</filter>` +
    `<rect width="100%" height="100%" filter="url(#n)"/>` +
    `</svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}
