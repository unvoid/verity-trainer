<!--
  Piedra de una tile (`.tile`, base.css), con su contorno curvo sin rectas
  (`visual/tileShape.ts`). Va como primer hijo de la tile, ocupa todo su tamaño y
  queda detrás del contenido. Decorativo y oculto a los lectores de pantalla.

  Dibuja, de atrás hacia delante:
  - Sombra suave bajo la piedra y halo cálido (solo fuera del contorno).
  - Piedra: velo claro y esmerilado, recortado con el contorno.
  - Canto: un filo de luz justo fuera del contorno. Sin línea de sombra: la escena
    junto a las tiles ya es más oscura que la piedra, y una sombra encajonaría la
    luz entre dos grises (se leería como un contorno oscuro).
  - Surco interior paralelo al borde (sombra dentro, luz fuera).
  - Contorno cobre de estado y anillo de foco.

  El aspecto se controla desde la tile con variables CSS, sin props:
  `--tile-fill` (piedra; p. ej. al pasar por encima), `--tile-outline-width` y
  `--tile-outline-dash` (contorno de estado), `--tile-glow` (0–1, halo cálido) y
  `--tile-focus` (0–1, foco; base.css lo activa con `:focus-visible`).
-->
<script lang="ts">
  import { tilePath } from '../visual/tileShape'

  /** Separación del surco respecto al borde, en px. */
  const GROOVE_INSET = 5
  /** Separación del anillo de foco respecto al borde, en px (como `outline-offset`). */
  const FOCUS_OFFSET = 3
  /** Sombra bajo la piedra: cuánto se recoge, cuánto baja y cuánto se difumina, en px. */
  const SHADOW = { inset: 14, offset: 10, blur: 12 } as const
  /** Halo cálido: cuánto se difumina, en px. */
  const GLOW_BLUR = 6
  /** Margen alrededor de la tile para lo que se dibuja fuera (sombra, halo, foco), en px. */
  const BLEED = 40

  const id = $props.id()

  let width = $state(0)
  let height = $state(0)

  const outline = $derived(tilePath(width, height))
  // Líneas de 1 px a medio px del contorno, para que queden nítidas a cada lado.
  const edgeLight = $derived(tilePath(width, height, -0.5))
  const grooveShade = $derived(tilePath(width, height, GROOVE_INSET + 0.5))
  const grooveLight = $derived(tilePath(width, height, GROOVE_INSET - 0.5))
  const stateOutline = $derived(tilePath(width, height, -1))
  const focusRing = $derived(tilePath(width, height, -FOCUS_OFFSET))
  const shadow = $derived(tilePath(width, height, SHADOW.inset))
  const box = $derived(`${-BLEED} ${-BLEED} ${width + 2 * BLEED} ${height + 2 * BLEED}`)
</script>

<span class="tile-frame" aria-hidden="true" bind:clientWidth={width} bind:clientHeight={height}>
  {#if outline}
    <svg class="layer" viewBox={box} width={width + 2 * BLEED} height={height + 2 * BLEED} style:margin="{-BLEED}px">
      <defs>
        <!-- Lo de fuera (sombra, halo) no se ve a través de la piedra translúcida. -->
        <mask id="{id}-outside" maskUnits="userSpaceOnUse" x={-BLEED} y={-BLEED} width={width + 2 * BLEED} height={height + 2 * BLEED}>
          <rect x={-BLEED} y={-BLEED} width={width + 2 * BLEED} height={height + 2 * BLEED} fill="white" />
          <path d={outline} fill="black" />
        </mask>
        <filter id="{id}-shadow" filterUnits="userSpaceOnUse" x={-BLEED} y={-BLEED} width={width + 2 * BLEED} height={height + 2 * BLEED}>
          <feGaussianBlur stdDeviation={SHADOW.blur / 2} />
        </filter>
        <filter id="{id}-glow" filterUnits="userSpaceOnUse" x={-BLEED} y={-BLEED} width={width + 2 * BLEED} height={height + 2 * BLEED}>
          <feGaussianBlur stdDeviation={GLOW_BLUR} />
        </filter>
      </defs>

      <g mask="url(#{id}-outside)">
        <path class="shadow" d={shadow} transform="translate(0 {SHADOW.offset})" filter="url(#{id}-shadow)" />
        <g class="glow">
          <path class="glow-soft" d={outline} filter="url(#{id}-glow)" />
          <path class="glow-ring" d={edgeLight} />
        </g>
      </g>
    </svg>

    <span class="stone" style:clip-path="path('{outline}')"></span>

    <svg class="layer" viewBox={box} width={width + 2 * BLEED} height={height + 2 * BLEED} style:margin="{-BLEED}px">
      <path class="line light" d={edgeLight} />
      <path class="line shade" d={grooveShade} />
      <path class="line light" d={grooveLight} />
      <path class="state" d={stateOutline} />
      <path class="focus" d={focusRing} />
    </svg>
  {/if}
</span>

<style>
  .tile-frame {
    position: absolute;
    inset: 0;
    z-index: -1;
    display: block;
    pointer-events: none;
  }

  /* Cubre la tile más el margen de todos los lados; el origen (0, 0) es la esquina de la tile. */
  .layer {
    position: absolute;
    top: 0;
    left: 0;
    overflow: visible;
  }

  .stone {
    position: absolute;
    inset: 0;
    background: var(--tile-fill, var(--color-stone));
    -webkit-backdrop-filter: blur(var(--stone-blur));
    backdrop-filter: blur(var(--stone-blur));
    transition: background-color var(--duration-fast) var(--easing-standard);
  }

  .shadow {
    fill: var(--color-stone-shadow);
  }

  .glow {
    opacity: var(--tile-glow, 0);
    transition: opacity var(--duration-reveal) var(--easing-standard);
  }

  .glow-soft {
    fill: none;
    stroke: var(--color-glow-ready-soft);
    stroke-width: 4;
  }

  .glow-ring {
    fill: none;
    stroke: var(--color-glow-ready);
    stroke-width: 1;
  }

  .line {
    fill: none;
    stroke-width: 1;
  }

  .shade {
    stroke: var(--bevel-shade);
  }

  .light {
    stroke: var(--bevel-light);
  }

  .state {
    fill: none;
    stroke: var(--color-active);
    stroke-width: var(--tile-outline-width, 0);
    stroke-dasharray: var(--tile-outline-dash, none);
    transition: stroke-width var(--duration-fast) var(--easing-standard);
  }

  .focus {
    fill: none;
    stroke: var(--color-focus);
    stroke-width: var(--stroke-focus);
    opacity: var(--tile-focus, 0);
  }
</style>
