<!--
  Símbolo 2D: silueta casi negra con un núcleo de brasa cobre en el centro.
  Decorativo por defecto; con `label` se anuncia como imagen.
-->
<script lang="ts">
  import type { Symbol2D } from '../domain/types'
  import { SILHOUETTES, VISUAL_CENTER_Y } from '../visual/silhouettes'

  interface Props {
    symbol: Symbol2D
    /** Tamaño máximo en px (ancho y alto); se encoge si no cabe. */
    size?: number
    /** Texto accesible. Sin él, el símbolo es decorativo. */
    label?: string
  }

  let { symbol, size = 48, label }: Props = $props()

  const gradientId = $props.id()

  /** Radio de la brasa, en unidades del lienzo (100×100): recogida en el centro de la forma. */
  const EMBER_RADIUS = 21
</script>

<svg
  class="symbol"
  width={size}
  height={size}
  viewBox="0 0 100 100"
  role={label ? 'img' : undefined}
  aria-label={label}
  aria-hidden={label ? undefined : 'true'}
>
  <defs>
    <radialGradient id={gradientId} cx="50" cy={VISUAL_CENTER_Y[symbol]} r={EMBER_RADIUS} gradientUnits="userSpaceOnUse">
      <stop offset="0%" class="ember-core" />
      <stop offset="45%" class="ember-glow" />
      <stop offset="100%" class="ember-edge" />
    </radialGradient>
  </defs>
  <path class="silhouette" d={SILHOUETTES[symbol]} />
  <path d={SILHOUETTES[symbol]} fill="url(#{gradientId})" />
</svg>

<style>
  .symbol {
    display: block;
    flex: none;
    max-width: 100%;
    height: auto;
  }

  /* Silueta casi negra; en oscuro, con un filo de luz fino (mismo grosor a cualquier tamaño). */
  .silhouette {
    fill: var(--color-symbol);
    stroke: var(--color-symbol-edge);
    stroke-width: 1;
    vector-effect: non-scaling-stroke;
    /* Detrás del relleno: solo asoma la mitad exterior, un filo de medio píxel. */
    paint-order: stroke;
  }

  /* Brasa contenida: se intuye en el centro, no deslumbra. */
  .ember-core {
    stop-color: var(--color-ember);
    stop-opacity: 0.75;
  }

  .ember-glow {
    stop-color: var(--color-ember);
    stop-opacity: 0.3;
  }

  .ember-edge {
    stop-color: var(--color-ember);
    stop-opacity: 0;
  }
</style>
