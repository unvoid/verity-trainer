<!--
  Fondo de escena: la sala de Verity reducida a su estructura (camino, grandes
  columnas que se funden sobre la esfera, columnas centrales, espirales y esfera),
  con la luz que entra desde arriba, la bruma y el viñeteado lavanda.
  Cada columna tiene volumen: el centro de su canto recoge la luz y los bordes
  quedan en sombra. Detrás de todo, fijo al hacer scroll, muy atenuado
  (`--scene-opacity`). Solo ambiente: decorativo, sin eventos y oculto a los
  lectores de pantalla.
-->
<script lang="ts">
  import {
    SCENE_CENTER_COLUMNS,
    SCENE_COLUMNS,
    SCENE_HELIX,
    SCENE_HORIZON_Y,
    SCENE_PATH,
    SCENE_SIZE,
    SCENE_SPHERE,
    band,
    ribbonBase,
    ribbonPath,
    type Ribbon,
  } from '../visual/ribbons'

  /** Una columna con volumen: entera en sombra, franja iluminada y brillo central. */
  interface Solid {
    /** Sombra de contacto en su base, para que se apoye en el suelo. */
    readonly contact: { readonly cx: number; readonly cy: number; readonly rx: number; readonly ry: number }
    readonly shade: string
    readonly lit: string
    readonly highlight: string
    /** Opacidad: lo lejano se funde con la bruma. */
    readonly opacity: number
  }

  function solid(ribbon: Ribbon, depth = 0): Solid {
    const base = ribbonBase(ribbon)
    return {
      contact: { cx: base.center[0], cy: base.center[1], rx: base.width * 0.85, ry: Math.max(4, base.width * 0.14) },
      shade: ribbonPath(ribbon),
      lit: ribbonPath(band(ribbon, 0.18, 0.82)),
      highlight: ribbonPath(band(ribbon, 0.4, 0.6)),
      opacity: 1 - depth * 0.55,
    }
  }

  // Orden de dibujo, de lo más lejano a lo más cercano.
  const farColumns = SCENE_COLUMNS.filter((c) => c.depth >= 0.5).map((c) => solid(c.ribbon, c.depth))
  const nearColumns = SCENE_COLUMNS.filter((c) => c.depth < 0.5).map((c) => solid(c.ribbon, c.depth))
  const centerColumns = SCENE_CENTER_COLUMNS.map((r) => solid(r, 0.45))
  const helix = SCENE_HELIX.map(ribbonPath)

  const [[leftNear, leftFar], [rightNear, rightFar]] = SCENE_PATH
  const floor = [leftNear, leftFar, rightFar, rightNear].map(([x, y]) => `${x},${y}`).join(' ')

  const ids = $props.id()
  const softId = `${ids}-soft`
  const contactId = `${ids}-contact`
  const floorId = `${ids}-floor`
  const sphereId = `${ids}-sphere`
  const coreId = `${ids}-core`
</script>

{#snippet column(item: Solid)}
  <g opacity={item.opacity}>
    <ellipse class="contact" {...item.contact} filter="url(#{contactId})" />
    <path class="column-shade" d={item.shade} />
    <path class="column-lit" d={item.lit} filter="url(#{softId})" />
    <path class="column-highlight" d={item.highlight} filter="url(#{softId})" />
  </g>
{/snippet}

<div class="scene" aria-hidden="true">
  <svg class="room" viewBox="0 0 {SCENE_SIZE.width} {SCENE_SIZE.height}" preserveAspectRatio="xMidYMid slice">
    <defs>
      <!-- Difumina la luz del canto: del centro iluminado a los bordes en sombra, sin escalones. -->
      <filter id={softId} x="-10%" y="-10%" width="120%" height="120%">
        <feGaussianBlur stdDeviation="3" />
      </filter>
      <!-- Sombra de contacto: muy difusa. -->
      <filter id={contactId} x="-50%" y="-200%" width="200%" height="500%">
        <feGaussianBlur stdDeviation="8" />
      </filter>
      <!-- Suelo: de la bruma del horizonte al blanco de nieve del primer plano. -->
      <linearGradient id={floorId} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" class="floor-far" />
        <stop offset="100%" class="floor-near" />
      </linearGradient>
      <radialGradient id={sphereId}>
        <stop offset="0%" class="sphere-light" />
        <stop offset="70%" class="sphere-haze" />
        <stop offset="94%" class="sphere-rim" />
        <stop offset="100%" class="sphere-edge" />
      </radialGradient>
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

    {#each farColumns as item, index (index)}
      {@render column(item)}
    {/each}

    {#each helix as d, index (index)}
      <path class="helix" {d} />
    {/each}

    <!-- Esfera: luz casi blanca con un núcleo cálido, flotando bajo el punto de fusión. -->
    <circle class="sphere" cx={SCENE_SPHERE.cx} cy={SCENE_SPHERE.cy} r={SCENE_SPHERE.r} fill="url(#{sphereId})" />
    <circle cx={SCENE_SPHERE.cx} cy={SCENE_SPHERE.cy} r={SCENE_SPHERE.r * 0.45} fill="url(#{coreId})" />

    {#each centerColumns as item, index (index)}
      {@render column(item)}
    {/each}

    {#each nearColumns as item, index (index)}
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

  /* Columnas: bordes en sombra, centro iluminado y un brillo fino en medio del canto. */
  .column-shade {
    fill: var(--color-column-shade);
  }

  .column-lit {
    fill: var(--color-column-lit);
  }

  .column-highlight {
    fill: var(--color-column-highlight);
  }

  .floor-far {
    stop-color: var(--color-column-lit);
    stop-opacity: 0;
  }

  .floor-near {
    stop-color: var(--color-column-highlight);
    stop-opacity: 0.9;
  }

  .contact {
    fill: var(--color-column-shade);
    opacity: 0.7;
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

  .helix {
    fill: var(--color-helix);
  }

  .sphere-light {
    stop-color: var(--color-column-highlight);
  }

  .sphere-haze {
    stop-color: var(--color-column-lit);
    stop-opacity: 0.85;
  }

  .sphere-rim {
    stop-color: var(--color-column-shade);
    stop-opacity: 0.6;
  }

  .sphere-edge {
    stop-color: var(--color-column-shade);
    stop-opacity: 0;
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
