/**
 * Cintas: bandas finas que se estrechan en las puntas, como las de la sala de
 * Verity. Cada cinta se define por su eje (una curva Bézier cúbica) y su grosor;
 * el contorno es el eje y una copia desplazada, en cada punto, a lo largo de la
 * normal de la curva en ese punto. Así una columna que nace vertical tiene la
 * base plana sobre el suelo, y el grosor sigue la curva hasta la punta.
 *
 * Geometría pura (sin Svelte), compartida por el fondo de escena y los cuencos
 * de las estatuas.
 */

export type Point = readonly [number, number]

/** Grosor en cada punto del eje: inicio, dos controles y final. */
export type Widths = readonly [number, number, number, number]

export interface Ribbon {
  /** Eje: inicio, dos puntos de control y final. */
  readonly spine: readonly [Point, Point, Point, Point]
  /**
   * Grosor. El signo elige hacia qué lado del eje crece la cinta.
   * - Un número: grosor en los controles y puntas afiladas en los dos extremos
   *   (lo más ancho queda en el centro, ~3/4 del número).
   * - Cuatro números: grosor en cada punto del eje. Así una columna nace ancha
   *   en su base (el inicio) y se afila hacia la punta.
   */
  readonly width: number | Widths
  /**
   * Dirección en la que crece el grosor en cada punto del eje. Por defecto, la
   * normal de la curva (ver `curveNormals`).
   */
  readonly normals?: readonly [Point, Point, Point, Point]
}

function widthsOf(width: Ribbon['width']): Widths {
  return typeof width === 'number' ? [0, width, width, 0] : width
}

const round = (value: number) => Math.round(value * 100) / 100
const point = ([x, y]: Point) => `${round(x)} ${round(y)}`

/** Normal unitaria (a la izquierda del sentido de avance) de la dirección de `from` a `to`. */
function normalBetween([x0, y0]: Point, [x1, y1]: Point): Point | null {
  const dx = x1 - x0
  const dy = y1 - y0
  const length = Math.hypot(dx, dy)
  return length === 0 ? null : [-dy / length, dx / length]
}

/**
 * Normal de la curva en cada punto del eje. En los extremos, la de la tangente
 * (hacia el primer y desde el último control); en los controles, la de la
 * dirección entre sus vecinos. Si un tramo es nulo, la de la cuerda.
 */
export function curveNormals([p0, p1, p2, p3]: Ribbon['spine']): readonly [Point, Point, Point, Point] {
  const chord = normalBetween(p0, p3) ?? [0, 1]
  return [
    normalBetween(p0, p1) ?? chord,
    normalBetween(p0, p2) ?? chord,
    normalBetween(p1, p3) ?? chord,
    normalBetween(p2, p3) ?? chord,
  ]
}

function normalsOf({ spine, normals }: Ribbon): readonly [Point, Point, Point, Point] {
  return normals ?? curveNormals(spine)
}

/** Contorno cerrado de una cinta, como `d` de un `<path>`. */
export function ribbonPath(ribbon: Ribbon): string {
  const [p0, p1, p2, p3] = ribbon.spine
  const [w0, w1, w2, w3] = widthsOf(ribbon.width)
  const [n0, n1, n2, n3] = normalsOf(ribbon)
  const shift = ([x, y]: Point, [nx, ny]: Point, w: number): Point => [x + nx * w, y + ny * w]
  // Ida por el eje; vuelta por la copia desplazada. Con grosor en un extremo, ese
  // extremo queda plano (la base de una columna); sin él, afilado.
  return (
    `M${point(p0)} C${point(p1)} ${point(p2)} ${point(p3)}` +
    (w3 === 0 ? '' : ` L${point(shift(p3, n3, w3))}`) +
    ` C${point(shift(p2, n2, w2))} ${point(shift(p1, n1, w1))} ${point(shift(p0, n0, w0))} Z`
  )
}

/**
 * Franja interior de una cinta, entre las fracciones `from` y `to` de su grosor
 * (0 = el eje, 1 = el otro borde). Sirve para dar volumen: la franja central
 * recoge la luz y los bordes quedan en sombra, como el canto de una columna.
 */
export function band(ribbon: Ribbon, from: number, to: number): Ribbon {
  const widths = widthsOf(ribbon.width)
  const normals = normalsOf(ribbon)
  const shift = (i: 0 | 1 | 2 | 3): Point => {
    const [x, y] = ribbon.spine[i]
    const [nx, ny] = normals[i]
    return [x + nx * widths[i] * from, y + ny * widths[i] * from]
  }
  const scale = to - from
  return {
    spine: [shift(0), shift(1), shift(2), shift(3)],
    width: [widths[0] * scale, widths[1] * scale, widths[2] * scale, widths[3] * scale],
    // Las mismas direcciones que la cinta original: la franja es paralela a sus bordes.
    normals,
  }
}

/**
 * Franja interior de una cinta medida en unidades absolutas: `at` recibe el
 * grosor de la cinta en cada punto del eje y devuelve la franja `[desde, hasta]`
 * como distancias desde el eje. Así una línea puede tener el mismo grosor en
 * toda la cinta aunque la cinta se afile (con `band`, se afilaría con ella).
 * Las distancias se recortan al grosor de la cinta.
 */
export function strip(ribbon: Ribbon, at: (width: number) => readonly [number, number]): Ribbon {
  const widths = widthsOf(ribbon.width)
  const normals = normalsOf(ribbon)
  const spans = widths.map((w) => {
    const size = Math.abs(w)
    const sign = w < 0 ? -1 : 1
    const [from, to] = at(size).map((d) => Math.min(Math.max(d, 0), size))
    return { start: sign * from!, width: sign * (to! - from!) }
  })
  const shift = (i: 0 | 1 | 2 | 3): Point => {
    const [x, y] = ribbon.spine[i]
    const [nx, ny] = normals[i]
    return [x + nx * spans[i]!.start, y + ny * spans[i]!.start]
  }
  return {
    spine: [shift(0), shift(1), shift(2), shift(3)],
    width: [spans[0]!.width, spans[1]!.width, spans[2]!.width, spans[3]!.width],
    normals,
  }
}

/** Centro y anchura del extremo inicial de una cinta (la base de una columna). */
export function ribbonBase(ribbon: Ribbon): { readonly center: Point; readonly width: number } {
  const [x, y] = ribbon.spine[0]
  const [nx, ny] = normalsOf(ribbon)[0]
  const w = widthsOf(ribbon.width)[0]
  return { center: [x + (nx * w) / 2, y + (ny * w) / 2], width: Math.abs(w) }
}

/** Refleja una cinta respecto a la vertical `x = axis` (composiciones simétricas). */
export function mirror({ spine, width, normals }: Ribbon, axis: number): Ribbon {
  const flip = ([x, y]: Point): Point => [2 * axis - x, y]
  return {
    spine: [flip(spine[0]), flip(spine[1]), flip(spine[2]), flip(spine[3])],
    width: typeof width === 'number' ? -width : [-width[0], -width[1], -width[2], -width[3]],
    // Las normales se reflejan y se invierten, igual que el signo del grosor: la cinta crece hacia el mismo lado relativo.
    ...(normals ? { normals: normals.map(([nx, ny]) => [nx, -ny] as Point) as unknown as Ribbon['normals'] } : {}),
  }
}

/** Una cinta y su reflejo. */
export function pair(ribbon: Ribbon, axis: number): readonly Ribbon[] {
  return [ribbon, mirror(ribbon, axis)]
}

/*
 * Escena de fondo en un lienzo de 1600×1000, simétrica respecto al centro.
 * Estructura de la sala (ver docs/estetica.md):
 * - Un camino que llega hasta el primer tercio del fondo.
 * - Cuatro grandes columnas por lado: sus bases se reparten en profundidad por
 *   el suelo y arriba se funden todas en un punto, justo encima de la esfera.
 * - Dos columnas centrales que nacen juntas al final del camino y abrazan la
 *   esfera, una por cada lado, sin volver a juntarse.
 * - Espirales finas bajo la esfera.
 * - La esfera, flotando en el centro.
 * Lo que nace del suelo es ancho en su base y se afila al subir (el inicio de
 * cada eje es la base).
 */
export const SCENE_SIZE = { width: 1600, height: 1000 } as const
const SCENE_AXIS = SCENE_SIZE.width / 2

/** Horizonte: donde empieza el suelo (justo detrás de la base de la columna más lejana). */
export const SCENE_HORIZON_Y = 690

/** Punto donde se funden las grandes columnas laterales, sobre el eje. */
export const SCENE_FUSION: Point = [SCENE_AXIS, 252]

/** Distancia entre la fusión de las columnas y la parte alta de la esfera: unos pocos píxeles. */
export const SPHERE_GAP = 6

/** La esfera: su parte alta queda `SPHERE_GAP` por debajo de la fusión de las columnas. */
export const SCENE_SPHERE = (() => {
  const r = 140
  return { cx: SCENE_AXIS, cy: SCENE_FUSION[1] + SPHERE_GAP + r, r } as const
})()

/**
 * Cuadratura de las columnas (0,55 ≈ círculo, 1 = rectángulo). Cada columna es
 * un cuarto de superelipse: con su reflejo imaginario en el suelo y su pareja
 * del otro lado forma un rectángulo de esquinas redondeadas (squircle), no un
 * óvalo. El lateral (`side`) sube casi recto; el techo (`top`) es algo menos
 * cuadrado, para que no quede plano, pero siempre llega horizontal a la fusión.
 */
export const COLUMN_SQUARENESS = { side: 0.88, top: 0.7 } as const

/**
 * Columna lateral izquierda como cuarto de superelipse: sube casi recta desde
 * su base, gira en una esquina redondeada y llega horizontal a la fusión. Los
 * controles van sobre los lados del rectángulo, a su cuadratura de la esquina.
 */
export function squircleColumn([x0, y0]: Point, widths: Widths, squareness = COLUMN_SQUARENESS): Ribbon {
  const [fx, fy] = SCENE_FUSION
  return {
    spine: [
      [x0, y0],
      [x0, y0 - squareness.side * (y0 - fy)],
      [fx - squareness.top * (fx - x0), fy],
      [fx, fy],
    ],
    width: widths,
  }
}

/** Final del camino: ahí nacen las dos columnas centrales. */
export const SCENE_PATH_END: Point = [SCENE_AXIS, 780]

/** Bordes del camino: del primer plano (abajo) a su final, convergiendo hacia el centro. */
export const SCENE_PATH: readonly (readonly [Point, Point])[] = [
  [[470, 1000], [SCENE_AXIS - 14, SCENE_PATH_END[1]]],
  [[1130, 1000], [SCENE_AXIS + 14, SCENE_PATH_END[1]]],
]

export interface SceneColumn {
  readonly ribbon: Ribbon
  /** Profundidad: 0 en primer plano, 1 al fondo. Lo lejano se funde con la bruma. */
  readonly depth: number
}

/**
 * Columnas del lado izquierdo, de la más cercana a la más lejana (el derecho es
 * su reflejo). La más cercana abre un rectángulo más ancho que alto; las lejanas,
 * por la perspectiva, se estrechan hacia el centro.
 */
const LEFT_COLUMNS: readonly SceneColumn[] = [
  { depth: 0, ribbon: squircleColumn([-90, 1060], [260, 190, 80, 10]) },
  { depth: 0.35, ribbon: squircleColumn([110, 900], [150, 110, 46, 8]) },
  { depth: 0.65, ribbon: squircleColumn([320, 785], [95, 70, 30, 6]) },
  { depth: 0.9, ribbon: squircleColumn([480, 712], [60, 44, 20, 4]) },
]

/** Grandes columnas, de la más lejana a la más cercana (orden de dibujo). */
export const SCENE_COLUMNS: readonly SceneColumn[] = [...LEFT_COLUMNS]
  .reverse()
  .flatMap(({ ribbon, depth }) => pair(ribbon, SCENE_AXIS).map((r) => ({ ribbon: r, depth })))

/**
 * Columnas centrales: simétricas respecto al ecuador de la esfera. Nacen juntas
 * al final del camino, se abren hasta tocar la esfera por sus lados justo en el
 * ecuador (su borde interior, el eje, es tangente a ella ahí, sin entrar) y
 * vuelven a acercarse arriba en espejo, una junto a la otra sin fundirse, igual
 * que en la base. El grosor crece hacia fuera y se afina al subir.
 */
export const CENTER_COLUMN_HUG = 220
export const SCENE_CENTER_COLUMNS: readonly Ribbon[] = (() => {
  const { cx, cy, r } = SCENE_SPHERE
  const x0 = SCENE_AXIS - 4
  const reach = SCENE_PATH_END[1] - cy
  // Con controles simétricos, el punto medio de la curva (el del ecuador) queda en
  // 1/4·x0 + 3/4·xc: se despeja xc para que toque el lado de la esfera.
  const xc = (cx - r - x0 / 4) / 0.75
  return pair(
    {
      spine: [
        [x0, cy + reach],
        [xc, cy + CENTER_COLUMN_HUG],
        [xc, cy - CENTER_COLUMN_HUG],
        [x0, cy - reach],
      ],
      // La forma es simétrica, pero el grosor no: anchas junto al suelo y muy finas arriba.
      width: [-52, -30, -14, -5],
    },
    SCENE_AXIS,
  )
})()

/** Un tramo de espiral: media vuelta de una cinta, por delante o por detrás de la esfera. */
export interface HelixSegment {
  readonly ribbon: Ribbon
  /** Por delante (pasa sobre la parte baja de la esfera) o por detrás (queda oculta tras ella). */
  readonly front: boolean
}

/**
 * Espiral bajo la esfera, del mismo material que las columnas: tres cintas
 * anchas por lado que se enroscan en sentidos opuestos (se cruzan como un
 * cesto) alrededor de un cono invertido: estrecho en el suelo y, arriba, del
 * radio de la esfera. Sube desde el final del camino hasta un poco por encima
 * de la parte baja de la esfera, donde se difumina al tocarla. Las vueltas
 * delanteras pasan sobre la esfera; las traseras quedan detrás.
 * Cada tramo es media vuelta: de un lado del cono al otro, con tangente
 * vertical en los extremos (como una sinusoide). Los tramos se generan de
 * sobra y se recortan a `SCENE_HELIX_BOUNDS` con un desvanecido.
 */
export const SCENE_HELIX_BOUNDS = {
  top: SCENE_SPHERE.cy + SCENE_SPHERE.r - 30,
  bottom: SCENE_PATH_END[1],
} as const
/** Tramo en el que la espiral se desvanece: arriba, al tocar la esfera; abajo, en el suelo. */
export const HELIX_FADE = { top: 60, bottom: 50 } as const
/** Radio del cono arriba (el de la esfera) y abajo (estrecho). */
export const HELIX_RADIUS = { top: SCENE_SPHERE.r, bottom: SCENE_SPHERE.r * 0.32 } as const
export const HELIX_STRANDS = 3
/** Altura de media vuelta. */
const HELIX_HALF_TURN = 110
/** Ancho de cada cinta de la espiral. */
const HELIX_WIDTH = 18

/** Radio del cono a una altura dada (fuera de los límites, sigue la misma recta). */
export function helixRadius(y: number): number {
  const { top, bottom } = SCENE_HELIX_BOUNDS
  const progress = (bottom - y) / (bottom - top)
  return HELIX_RADIUS.bottom + (HELIX_RADIUS.top - HELIX_RADIUS.bottom) * progress
}

export const SCENE_HELIX: readonly HelixSegment[] = (() => {
  const { cx } = SCENE_SPHERE
  const { top, bottom } = SCENE_HELIX_BOUNDS
  const segments: HelixSegment[] = []
  for (let strand = 0; strand < HELIX_STRANDS; strand++) {
    // Cada cinta empieza desfasada un tercio de vuelta respecto a la anterior.
    let y0 = bottom + HELIX_HALF_TURN + (strand * 2 * HELIX_HALF_TURN) / HELIX_STRANDS
    for (let half = 0; y0 > top; half++) {
      const y1 = y0 - HELIX_HALF_TURN
      // Medias vueltas alternas: por delante de izquierda a derecha, por detrás de vuelta.
      const front = half % 2 === 0
      const [r0, r1] = [helixRadius(y0), helixRadius(y1)]
      const [x0, x1] = front ? [cx - r0, cx + r1] : [cx + r0, cx - r1]
      const handle = HELIX_HALF_TURN * 0.36
      const ribbon: Ribbon = {
        spine: [[x0, y0], [x0, y0 - handle], [x1, y1 + handle], [x1, y1]],
        width: [HELIX_WIDTH, HELIX_WIDTH, HELIX_WIDTH, HELIX_WIDTH],
      }
      for (const mirrored of pair(ribbon, SCENE_AXIS)) segments.push({ ribbon: mirrored, front })
      y0 = y1
    }
  }
  return segments
})()

/**
 * Cuenco tejido bajo una estatua, en un lienzo de 100×50. El borde es una
 * elipse con los extremos en `y = CRADLE_RIM_Y` y el centro del borde delantero
 * en `CRADLE_FRONT_RIM_Y`. `back` va detrás de la forma 3D y `front` delante,
 * para que la forma parezca apoyada dentro.
 */
export const CRADLE_SIZE = { width: 100, height: 50 } as const
export const CRADLE_RIM_Y = 12
export const CRADLE_FRONT_RIM_Y = 19.5
const CRADLE_AXIS = CRADLE_SIZE.width / 2

export const CRADLE_RIBBONS: { readonly back: readonly Ribbon[]; readonly front: readonly Ribbon[] } = {
  back: [
    // Borde trasero.
    { spine: [[3, 12], [18, 2], [82, 2], [97, 12]], width: 2.6 },
    // Cintas que cruzan por dentro, de un borde al otro.
    ...pair({ spine: [[8, 13], [18, 40], [62, 42], [86, 9]], width: 3 }, CRADLE_AXIS),
  ],
  front: [
    // Cintas cruzadas por delante: dibujan la panza del cuenco.
    ...pair({ spine: [[3, 12], [8, 46], [56, 54], [80, 19]], width: -4.4 }, CRADLE_AXIS),
    { spine: [[25, 18], [30, 49], [70, 49], [75, 18]], width: -3.2 },
    // Borde delantero.
    { spine: [[3, 12], [18, 22], [82, 22], [97, 12]], width: -3 },
  ],
}
