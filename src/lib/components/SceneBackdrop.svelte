<!--
  Fondo de escena: la sala de Verity reducida a su estructura (camino, grandes
  columnas que se funden sobre la esfera, columnas centrales, espirales y esfera),
  con la luz que entra desde arriba, la bruma y el viñeteado lavanda.
  Cada columna es piedra blanca con cantos finos: una cara frontal ancha y una
  lateral estrecha, planas (la lateral, un tono más lavanda). Cada canto (los dos
  bordes y la arista entre las caras) es un par de líneas finas y nítidas: una
  blanca que recoge la luz y, pegada a ella, una de sombra casi del mismo grosor.
  Detrás de todo, fijo al hacer scroll, muy atenuado (`--scene-opacity`). Solo ambiente: decorativo, sin eventos y oculto a los
  lectores de pantalla.
-->
<script lang="ts">
  import {
    SCENE_CENTER_COLUMNS,
    SCENE_COLUMNS,
    SCENE_HELIX,
    SCENE_HELIX_BOUNDS,
    HELIX_FADE,
    SCENE_HORIZON_Y,
    SCENE_PATH,
    SCENE_SIZE,
    SCENE_SPHERE,
    ribbonBase,
    ribbonPath,
    strip,
    type Ribbon,
  } from '../visual/ribbons'

  /**
   * Posición de la arista entre las dos caras, en fracción del grosor medida
   * desde el borde exterior. Desde el centro de la sala se ve sobre todo la cara
   * frontal; la lateral queda estrecha, del lado que mira al centro.
   */
  const RIDGE_AT = 0.78
  /**
   * Grosor de cada línea de un canto, en unidades del lienzo: el mismo en toda
   * la columna, de la base a la punta (no se ensancha donde la columna es
   * gruesa). Solo se afina con la profundidad: las lejanas tienen cantos más finos.
   */
  const LINE = 1.6
  /** Cuánto se afinan los cantos de la columna más lejana (profundidad 1). */
  const LINE_DEPTH_FALLOFF = 0.5

  /** Un canto: línea blanca que recoge la luz y línea de sombra pegada a ella. */
  interface Edge {
    readonly light: string
    readonly shadow: string
  }

  /** Una columna: caras planas y cantos finos. */
  interface Solid {
    /** Sombra de contacto en su base, para que se apoye en el suelo. */
    readonly contact: { readonly cx: number; readonly cy: number; readonly rx: number; readonly ry: number }
    /** Silueta entera: es también la cara frontal. */
    readonly front: string
    /** Cara lateral, estrecha, detrás de la arista. */
    readonly side: string
    readonly edges: readonly Edge[]
    /** Opacidad: lo lejano se funde con la bruma. */
    readonly opacity: number
  }

  /**
   * `outerSide`: dónde está el borde exterior. En las columnas laterales el eje
   * va por el borde exterior (`'spine'`); en las centrales, por el interior (`'edge'`).
   */
  function solid(ribbon: Ribbon, depth = 0, outerSide: 'spine' | 'edge' = 'spine'): Solid {
    const base = ribbonBase(ribbon)
    const line = LINE * (1 - LINE_DEPTH_FALLOFF * depth)
    // Franja entre dos distancias medidas desde el borde exterior; `at` recibe el
    // grosor de la columna en cada punto (la arista va a una fracción de él).
    const part = (at: (width: number) => readonly [number, number]) =>
      ribbonPath(
        strip(ribbon, (width) => {
          const [from, to] = at(width)
          return outerSide === 'spine' ? [from, to] : [width - to, width - from]
        }),
      )
    return {
      contact: { cx: base.center[0], cy: base.center[1], rx: base.width * 0.7, ry: Math.max(4, base.width * 0.1) },
      front: ribbonPath(ribbon),
      side: part((w) => [RIDGE_AT * w, w]),
      edges: [
        // Borde exterior: la luz en el canto, la sombra hacia dentro de la cara.
        { light: part(() => [0, line]), shadow: part(() => [line, 2 * line]) },
        // Arista entre las caras: la luz en el giro, la sombra en la cara lateral.
        {
          light: part((w) => [RIDGE_AT * w - line, RIDGE_AT * w]),
          shadow: part((w) => [RIDGE_AT * w, RIDGE_AT * w + line]),
        },
        // Borde interior.
        { light: part((w) => [w - line, w]), shadow: part((w) => [w - 2 * line, w - line]) },
      ],
      opacity: 1 - depth * 0.55,
    }
  }

  /** Cinta plana (la espiral): una sola cara y sus dos cantos, con el mismo tratamiento que las columnas. */
  interface Strand {
    readonly face: string
    readonly edges: readonly Edge[]
  }

  function strand(ribbon: Ribbon): Strand {
    const part = (at: (width: number) => readonly [number, number]) => ribbonPath(strip(ribbon, at))
    return {
      face: ribbonPath(ribbon),
      edges: [
        { light: part(() => [0, LINE]), shadow: part(() => [LINE, 2 * LINE]) },
        { light: part((w) => [w - LINE, w]), shadow: part((w) => [w - 2 * LINE, w - LINE]) },
      ],
    }
  }

  const ids = $props.id()

  /*
   * Orden de dibujo, de atrás hacia delante:
   * 1. Suelo y camino.
   * 2. Columnas laterales (de la más lejana a la más cercana): quedan detrás de la esfera.
   * 3. Vueltas traseras de la espiral (quedan tras la esfera).
   * 4. Esfera.
   * 5. Vueltas delanteras de la espiral: pasan sobre la parte baja de la esfera.
   * 6. Columnas centrales, delante de la esfera, que la abrazan por sus lados.
   */
  const helixBack = SCENE_HELIX.filter((s) => !s.front).map((s) => strand(s.ribbon))
  const helixFront = SCENE_HELIX.filter((s) => s.front).map((s) => strand(s.ribbon))
  const columns = SCENE_COLUMNS.map((c) => solid(c.ribbon, c.depth))
  const centerColumns = SCENE_CENTER_COLUMNS.map((r) => solid(r, 0.2, 'edge'))

  const [[leftNear, leftFar], [rightNear, rightFar]] = SCENE_PATH
  const floor = [leftNear, leftFar, rightFar, rightNear].map(([x, y]) => `${x},${y}`).join(' ')

  const contactId = `${ids}-contact`
  const floorId = `${ids}-floor`
  const sphereId = `${ids}-sphere`
  const coreId = `${ids}-core`
  const helixMaskId = `${ids}-helix`
  const helixFadeId = `${ids}-helix-fade`
  const helixHeight = SCENE_HELIX_BOUNDS.bottom - SCENE_HELIX_BOUNDS.top
</script>

{#snippet helixStrand(item: Strand)}
  <path class="helix" d={item.face} />
  {#each item.edges as edge, index (index)}
    <path class="edge-shadow" d={edge.shadow} />
    <path class="edge-light" d={edge.light} />
  {/each}
{/snippet}

{#snippet column(item: Solid)}
  <g opacity={item.opacity}>
    <ellipse class="contact" {...item.contact} filter="url(#{contactId})" />
    <path class="face" d={item.front} />
    <path class="side" d={item.side} />
    {#each item.edges as edge, index (index)}
      <path class="edge-shadow" d={edge.shadow} />
      <path class="edge-light" d={edge.light} />
    {/each}
  </g>
{/snippet}

<div class="scene" aria-hidden="true">
  <svg class="room" viewBox="0 0 {SCENE_SIZE.width} {SCENE_SIZE.height}" preserveAspectRatio="xMidYMid slice">
    <defs>
      <!-- Sombra de contacto: muy difusa. -->
      <filter id={contactId} x="-50%" y="-200%" width="200%" height="500%">
        <feGaussianBlur stdDeviation="6" />
      </filter>
      <!-- Suelo: de la bruma del horizonte al blanco de nieve del primer plano. -->
      <linearGradient id={floorId} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" class="floor-far" />
        <stop offset="100%" class="floor-near" />
      </linearGradient>
      <radialGradient id={sphereId}>
        <!-- Sombra interior que se concentra junto al borde y corta en seco: sin halo hacia fuera. -->
        <stop offset="0%" class="sphere-light" />
        <stop offset="78%" class="sphere-haze" />
        <stop offset="96%" class="sphere-rim" />
        <stop offset="100%" class="sphere-rim" />
      </radialGradient>
      <!-- La espiral va del suelo a la parte baja de la esfera y se desvanece en los dos extremos, sin cortes. -->
      <linearGradient
        id={helixFadeId}
        gradientUnits="userSpaceOnUse"
        x1="0"
        y1={SCENE_HELIX_BOUNDS.top}
        x2="0"
        y2={SCENE_HELIX_BOUNDS.bottom}
      >
        <stop offset="0" stop-color="black" />
        <stop offset={HELIX_FADE.top / helixHeight} stop-color="white" />
        <stop offset={1 - HELIX_FADE.bottom / helixHeight} stop-color="white" />
        <stop offset="1" stop-color="black" />
      </linearGradient>
      <mask id={helixMaskId} maskUnits="userSpaceOnUse" x="0" y="0" width={SCENE_SIZE.width} height={SCENE_SIZE.height}>
        <rect x="0" y={SCENE_HELIX_BOUNDS.top} width={SCENE_SIZE.width} height={helixHeight} fill="url(#{helixFadeId})" />
      </mask>
      <radialGradient id={coreId}>
        <stop offset="0%" class="core" />
        <stop offset="100%" class="core-edge" />
      </radialGradient>
    </defs>

    <!-- Suelo, desde el horizonte. -->
    <rect
      class="floor"
      x="-200"
      y={SCENE_HORIZON_Y}
      width={SCENE_SIZE.width + 400}
      height={SCENE_SIZE.height - SCENE_HORIZON_Y + 200}
      fill="url(#{floorId})"
    />

    <!-- Camino: suelo más claro entre dos bordes que convergen. -->
    <polygon class="path-floor" points={floor} />
    {#each SCENE_PATH as [from, to], index (index)}
      <line class="path-edge" x1={from[0]} y1={from[1]} x2={to[0]} y2={to[1]} />
    {/each}

    {#each columns as item, index (index)}
      {@render column(item)}
    {/each}

    <g class="helix-back" mask="url(#{helixMaskId})">
      {#each helixBack as item, index (index)}
        {@render helixStrand(item)}
      {/each}
    </g>

    <!-- Esfera: luz casi blanca con un núcleo cálido, sostenida por la espiral. -->
    <circle class="sphere" cx={SCENE_SPHERE.cx} cy={SCENE_SPHERE.cy} r={SCENE_SPHERE.r} fill="url(#{sphereId})" />
    <circle cx={SCENE_SPHERE.cx} cy={SCENE_SPHERE.cy} r={SCENE_SPHERE.r * 0.45} fill="url(#{coreId})" />

    <g mask="url(#{helixMaskId})">
      {#each helixFront as item, index (index)}
        {@render helixStrand(item)}
      {/each}
    </g>

    {#each centerColumns as item, index (index)}
      {@render column(item)}
    {/each}

  </svg>
</div>

<style>
  .scene {
    position: fixed;
    inset: 0;
    z-index: -1;
    pointer-events: none;
    opacity: var(--scene-opacity);
    background: var(--scene-bloom);
  }

  /*
   * Por encima de la sala: la bruma del centro (la aleja de lo que se lee)
   * y el viñeteado (también se apaga hacia los bordes).
   */
  .scene::after {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--scene-vignette), var(--scene-mist);
  }

  .room {
    display: block;
    width: 100%;
    height: 100%;
  }

  /*
   * Piedra blanca: caras planas, sin degradado. La lateral, un tono más lavanda.
   * Los cantos son líneas finas y nítidas: luz y, pegada, su sombra.
   */
  .face {
    fill: var(--color-column-lit);
  }

  .side {
    fill: color-mix(in srgb, var(--color-column-lit), var(--color-column-shade) 30%);
  }

  .edge-light {
    fill: var(--color-column-highlight);
  }

  .edge-shadow {
    fill: var(--color-column-shade);
  }

  .floor-far {
    stop-color: var(--color-column-lit);
    stop-opacity: 0;
  }

  .floor-near {
    stop-color: var(--color-column-highlight);
    stop-opacity: 0.9;
  }

  /* Sombra de contacto: apenas un oscurecimiento bajo la base. */
  .contact {
    fill: var(--color-column-shade);
    opacity: 0.35;
  }

  .path-floor {
    fill: var(--color-column-highlight);
    opacity: 0.4;
  }

  .path-edge {
    stroke: var(--color-column-shade);
    stroke-width: 1.5;
    opacity: 0.7;
  }

  /* La espiral es del mismo material que las columnas. */
  .helix {
    fill: var(--color-column-lit);
  }

  /* Vueltas traseras: en la penumbra de detrás de la esfera. */
  .helix-back {
    opacity: 0.6;
  }

  .sphere-light {
    stop-color: var(--color-column-highlight);
  }

  /* Casi opaca: tapa la parte alta de las columnas, donde se funden. */
  .sphere-haze {
    stop-color: var(--color-column-lit);
    stop-opacity: 0.97;
  }

  .sphere-rim {
    stop-color: var(--color-column-shade);
  }

  .core {
    stop-color: var(--color-ember);
    stop-opacity: 0.35;
  }

  .core-edge {
    stop-color: var(--color-ember);
    stop-opacity: 0;
  }
</style>
