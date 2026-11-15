/**
 * Polvo de nieve: miles de motas diminutas que flotan en la sala, agrupadas en
 * jirones como una nebulosa y muy concentradas alrededor de la esfera.
 *
 * Las motas viven en las coordenadas de la sala (`SCENE_SIZE`, 1600×1000) y se
 * llevan a la pantalla con el mismo encuadre que el SVG de la escena
 * (`xMidYMid slice`): la nube queda sobre la esfera con cualquier ventana.
 *
 * El movimiento no las dispersa: un vaivén lento en la dirección del viento y un
 * giro alrededor de la esfera conservan el reparto inicial.
 *
 * Funciones puras, sin Svelte ni canvas: el componente `SnowDust` las dibuja.
 */
import { SCENE_SIZE, SCENE_SPHERE } from './ribbons'

export interface DustParams {
  /** Número de motas en pantallas grandes y en pantallas estrechas. */
  readonly count: number
  readonly compactCount: number
  /** Tamaño de una mota, en px de pantalla (no escala con la sala: son casi de un píxel). */
  readonly size: readonly [number, number]
  /** Parte de las motas que son más grandes y brillantes, y su tamaño. */
  readonly bigShare: number
  readonly bigSize: readonly [number, number]
  /** Parte de las motas con un toque cálido. */
  readonly warmShare: number
  /** Reparto: peso de la nube de la esfera, de los jirones y del polvo disperso (relativos). */
  readonly sphereWeight: number
  readonly wispWeight: number
  readonly baseWeight: number
  /** Radio de la nube de la esfera, en radios de la esfera. */
  readonly sphereSpread: number
  /** Tamaño de los jirones (frecuencia del ruido, por unidad de la sala). Más baja = jirones más grandes. */
  readonly wispFrequency: number
  /** Viento: dirección del vaivén (unidades de la sala) y su periodo, en segundos. */
  readonly wind: readonly [number, number]
  readonly windPeriod: readonly [number, number]
  /** Giro alrededor de la esfera, en radianes por segundo, junto a ella (se apaga al alejarse). */
  readonly swirl: number
  /** Parpadeo: periodo de cada mota, en segundos. */
  readonly twinklePeriod: readonly [number, number]
}

/** Parámetros para ajustar a ojo, como los de la bruma. */
export const DUST: DustParams = {
  count: 2400,
  compactCount: 1100,
  size: [0.8, 1.6],
  bigShare: 0.04,
  bigSize: [1.8, 2.8],
  warmShare: 0.18,
  sphereWeight: 1,
  wispWeight: 0.55,
  baseWeight: 0.06,
  sphereSpread: 1.6,
  wispFrequency: 0.004,
  wind: [42, 14],
  windPeriod: [55, 110],
  swirl: 0.02,
  twinklePeriod: [2.5, 7],
}

export interface DustMote {
  /** Posición de reposo, en coordenadas de la sala. */
  readonly x: number
  readonly y: number
  /** Tamaño en px de pantalla. */
  readonly size: number
  /** Intensidad base (0 a 1). */
  readonly alpha: number
  readonly warm: boolean
  /** Fases y periodos propios, para que cada mota vaya a su ritmo. */
  readonly phase: number
  readonly windPeriod: number
  readonly twinklePeriod: number
}

/** Generador de números en [0, 1) con semilla: el reparto es el mismo en cada carga. */
export function seededRandom(seed: number): () => number {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Ruido de valor 2D en [0, 1], suave (interpolación bicúbica de una rejilla aleatoria). */
function valueNoise(x: number, y: number, seed: number): number {
  const hash = (ix: number, iy: number) => {
    let h = Math.imul(ix, 374761393) ^ Math.imul(iy, 668265263) ^ Math.imul(seed, 2147483647)
    h = Math.imul(h ^ (h >>> 13), 1274126177)
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296
  }
  const x0 = Math.floor(x)
  const y0 = Math.floor(y)
  const fx = x - x0
  const fy = y - y0
  const smooth = (t: number) => t * t * (3 - 2 * t)
  const sx = smooth(fx)
  const sy = smooth(fy)
  const top = hash(x0, y0) + (hash(x0 + 1, y0) - hash(x0, y0)) * sx
  const bottom = hash(x0, y0 + 1) + (hash(x0 + 1, y0 + 1) - hash(x0, y0 + 1)) * sx
  return top + (bottom - top) * sy
}

/** Ruido fractal (varias octavas), en [0, 1]: jirones con bordes irregulares. */
export function fractalNoise(x: number, y: number, seed = 7, octaves = 4): number {
  let sum = 0
  let amplitude = 0.5
  let frequency = 1
  let total = 0
  for (let octave = 0; octave < octaves; octave++) {
    sum += valueNoise(x * frequency, y * frequency, seed + octave * 31) * amplitude
    total += amplitude
    amplitude /= 2
    frequency *= 2
  }
  return sum / total
}

/**
 * Densidad del polvo en un punto de la sala (0 a 1, sin normalizar del todo): nube
 * alrededor de la esfera, jirones donde el ruido es denso y un poco de polvo disperso.
 */
export function dustDensity(x: number, y: number, params: DustParams = DUST): number {
  const spread = SCENE_SPHERE.r * params.sphereSpread
  const distance = Math.hypot(x - SCENE_SPHERE.cx, y - SCENE_SPHERE.cy)
  const sphere = Math.exp(-((distance / spread) ** 2))
  // Solo las zonas densas del ruido forman jirones; el resto queda casi vacío.
  const noise = fractalNoise(x * params.wispFrequency, y * params.wispFrequency)
  const wisps = Math.max(0, noise - 0.5) * 2
  return params.sphereWeight * sphere + params.wispWeight * wisps ** 1.5 + params.baseWeight
}

/** Reparte `count` motas por la sala según `dustDensity` (muestreo por rechazo). */
export function createDust(count: number, random: () => number, params: DustParams = DUST): DustMote[] {
  const maxDensity = params.sphereWeight + params.wispWeight + params.baseWeight
  const between = ([min, max]: readonly [number, number]) => min + (max - min) * random()
  const motes: DustMote[] = []
  while (motes.length < count) {
    const x = random() * SCENE_SIZE.width
    const y = random() * SCENE_SIZE.height
    if (random() * maxDensity > dustDensity(x, y, params)) continue
    const big = random() < params.bigShare
    motes.push({
      x,
      y,
      size: between(big ? params.bigSize : params.size),
      alpha: big ? 0.9 + 0.1 * random() : 0.35 + 0.5 * random(),
      warm: random() < params.warmShare,
      phase: random() * Math.PI * 2,
      windPeriod: between(params.windPeriod),
      twinklePeriod: between(params.twinklePeriod),
    })
  }
  return motes
}

/** Posición de una mota en el instante `t` (s), en coordenadas de la sala. */
export function motePosition(mote: DustMote, t: number, params: DustParams = DUST): readonly [number, number] {
  // Giro alrededor de la esfera: más rápido junto a ella, nulo lejos.
  const dx = mote.x - SCENE_SPHERE.cx
  const dy = mote.y - SCENE_SPHERE.cy
  const reach = SCENE_SPHERE.r * params.sphereSpread * 1.5
  const falloff = Math.exp(-((Math.hypot(dx, dy) / reach) ** 2))
  const angle = params.swirl * t * falloff
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  // Vaivén del viento: va y vuelve, así la nube no se va de la esfera.
  const sway = Math.sin((t / mote.windPeriod) * Math.PI * 2 + mote.phase)
  return [
    SCENE_SPHERE.cx + dx * cos - dy * sin + params.wind[0] * sway,
    SCENE_SPHERE.cy + dx * sin + dy * cos + params.wind[1] * sway,
  ]
}

/** Intensidad de una mota en el instante `t`: parpadeo suave a su ritmo (0 a 1). */
export function moteAlpha(mote: DustMote, t: number): number {
  const twinkle = 0.55 + 0.45 * Math.sin((t / mote.twinklePeriod) * Math.PI * 2 + mote.phase)
  return mote.alpha * twinkle
}

/** Encuadre de la sala en una ventana de `width` × `height` px, como `xMidYMid slice`. */
export function sceneFrame(width: number, height: number): { scale: number; offsetX: number; offsetY: number } {
  const scale = Math.max(width / SCENE_SIZE.width, height / SCENE_SIZE.height)
  return {
    scale,
    offsetX: (width - SCENE_SIZE.width * scale) / 2,
    offsetY: (height - SCENE_SIZE.height * scale) / 2,
  }
}
