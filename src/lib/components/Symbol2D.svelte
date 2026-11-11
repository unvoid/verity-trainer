<!--
  Símbolo 2D: silueta casi negra con un núcleo de brasa cobre en el centro.
  Decorativo por defecto; con `label` se anuncia como imagen.
-->
<script lang="ts">
  import type { Symbol2D } from '../domain/types'

  interface Props {
    symbol: Symbol2D
    /** Tamaño máximo en px (ancho y alto); se encoge si no cabe. */
    size?: number
    /** Texto accesible. Sin él, el símbolo es decorativo. */
    label?: string
  }

  let { symbol, size = 48, label }: Props = $props()

  const gradientId = $props.id()

  /** Siluetas en un lienzo de 100×100. */
  const SILHOUETTES: Record<Symbol2D, string> = {
    circle: 'M50 8 a42 42 0 1 1 0 84 a42 42 0 1 1 0 -84 Z',
    square: 'M12 12 H88 V88 H12 Z',
    triangle: 'M50 8 L94 88 H6 Z',
  }

  /** Centro de la brasa: en el triángulo baja hacia su centro visual. */
  const EMBER_CENTER_Y: Record<Symbol2D, number> = { circle: 50, square: 50, triangle: 62 }
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
    <radialGradient id={gradientId} cx="50" cy={EMBER_CENTER_Y[symbol]} r="26" gradientUnits="userSpaceOnUse">
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

  .silhouette {
    fill: var(--color-silhouette);
  }

  .ember-core {
    stop-color: var(--color-ember);
  }

  .ember-glow {
    stop-color: var(--color-ember);
    stop-opacity: 0.5;
  }

  .ember-edge {
    stop-color: var(--color-ember);
    stop-opacity: 0;
  }
</style>
